import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { CaseService } from '../cases/case.service.js';

export interface ShiftRecord {
  cashierId: string;
  cashierName: string;
  counterDesk: string;
  startTime: Date;
  openingFloat: number;
}

// In-memory active cashier shifts tracker (persisted via AuditLog as well)
const activeShifts = new Map<string, ShiftRecord>();

export class PaymentService {
  /**
   * Collect outstanding due against a case
   */
  static async collectDue(data: {
    caseId: string;
    amount: number;
    mode: string;
    receivedBy: string;
    counterDesk?: string;
    referenceNo?: string;
    note?: string;
  }) {
    if (!data.caseId) {
      throw new BadRequestError('Case ID is required to collect due');
    }
    if (!data.amount || data.amount <= 0) {
      throw new BadRequestError('Payment amount must be greater than zero');
    }

    return CaseService.collectDue(
      data.caseId,
      data.amount,
      data.mode || 'Cash',
      data.receivedBy,
      data.note
    );
  }

  /**
   * List all payment transactions with filters and multi-instrument breakdown
   */
  static async getTransactions(query: {
    startDate?: string;
    endDate?: string;
    mode?: string;
    receivedBy?: string;
    caseId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.caseId) {
      where.caseId = query.caseId;
    }

    if (query.mode && query.mode !== 'ALL') {
      where.mode = query.mode;
    }

    if (query.receivedBy && query.receivedBy !== 'ALL') {
      where.receivedBy = query.receivedBy;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [total, transactions, allFilteredTransactions] = await Promise.all([
      prisma.paymentTransaction.count({ where }),
      prisma.paymentTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          case: {
            select: {
              billNumber: true,
              uhid: true,
              modality: true,
              patient: {
                select: {
                  fullName: true,
                  mobile: true
                }
              }
            }
          }
        }
      }),
      // Query raw amounts for summary aggregation
      prisma.paymentTransaction.findMany({
        where,
        select: {
          amount: true,
          mode: true,
          isRefund: true
        }
      })
    ]);

    // Financial aggregations
    let totalCollected = 0;
    let cashTotal = 0;
    let upiTotal = 0;
    let cardTotal = 0;
    let chequeTotal = 0;
    let refundTotal = 0;

    for (const tx of allFilteredTransactions) {
      if (tx.isRefund || tx.amount < 0) {
        refundTotal += Math.abs(tx.amount);
      } else {
        totalCollected += tx.amount;
        const mode = tx.mode.toLowerCase();
        if (mode.includes('cash')) cashTotal += tx.amount;
        else if (mode.includes('upi')) upiTotal += tx.amount;
        else if (mode.includes('card')) cardTotal += tx.amount;
        else if (mode.includes('cheque')) chequeTotal += tx.amount;
      }
    }

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalTransactions: total,
        totalCollected,
        netCollected: totalCollected - refundTotal,
        refundTotal,
        cashTotal,
        upiTotal,
        cardTotal,
        chequeTotal
      },
      transactions
    };
  }

  /**
   * Update payment transaction (e.g. correct mode or record UTR reference)
   */
  static async updateTransaction(
    id: string,
    data: { mode?: string; referenceNo?: string; auditReason: string },
    updatedBy: string
  ) {
    if (!data.auditReason || data.auditReason.trim().length < 4) {
      throw new BadRequestError('Audit reason with at least 4 characters is mandatory to modify financial transactions');
    }

    const existing = await prisma.paymentTransaction.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Transaction not found');
    }

    const updated = await prisma.paymentTransaction.update({
      where: { id },
      data: {
        mode: data.mode || existing.mode,
        referenceNo: data.referenceNo !== undefined ? data.referenceNo : existing.referenceNo,
        note: `${existing.note ? existing.note + ' | ' : ''}Edited by ${updatedBy}: ${data.auditReason}`
      }
    });

    return updated;
  }

  /**
   * Open cashier shift with opening cash float (persisted to DB)
   */
  static async startShift(data: {
    cashierId: string;
    cashierName: string;
    counterDesk?: string;
    openingFloat: number;
  }) {
    const openingFloat = Math.max(0, data.openingFloat || 0);
    const counterDesk = data.counterDesk || 'Counter 1';

    // Persist to DB CashierShift table
    const dbShift = await (prisma as any).cashierShift.create({
      data: {
        cashierId: data.cashierId,
        cashierName: data.cashierName,
        counterDesk,
        openingFloat,
        status: 'OPEN'
      }
    });

    const shift: ShiftRecord = {
      cashierId: data.cashierId,
      cashierName: data.cashierName,
      counterDesk,
      startTime: dbShift.startTime,
      openingFloat
    };

    activeShifts.set(data.cashierId, shift);

    return {
      message: 'Cashier drawer shift opened successfully',
      shiftId: dbShift.id,
      shift
    };
  }

  /**
   * Reconcile and close cashier shift with variance analysis (persisted to DB)
   */
  static async closeShift(data: {
    cashierId: string;
    cashierName: string;
    closingCashCount: number;
  }) {
    // Find open shift in DB first, fallback to memory
    const openDbShift = await (prisma as any).cashierShift.findFirst({
      where: {
        cashierId: data.cashierId,
        status: 'OPEN'
      },
      orderBy: { createdAt: 'desc' }
    });

    const startTime = openDbShift?.startTime || activeShifts.get(data.cashierId)?.startTime || new Date(new Date().setHours(0, 0, 0, 0));
    const openingFloat = openDbShift?.openingFloat ?? activeShifts.get(data.cashierId)?.openingFloat ?? 0;
    const counterDesk = openDbShift?.counterDesk || activeShifts.get(data.cashierId)?.counterDesk || 'Counter 1';

    // Calculate cash collections since shift start
    const cashTransactions = await prisma.paymentTransaction.findMany({
      where: {
        receivedBy: data.cashierName,
        mode: 'Cash',
        createdAt: { gte: startTime }
      },
      select: { amount: true, isRefund: true }
    });

    let shiftCashCollected = 0;
    for (const tx of cashTransactions) {
      shiftCashCollected += tx.amount; // refunds are already negative or flagged
    }

    const expectedCashInDrawer = openingFloat + shiftCashCollected;
    const actualCashCount = Math.max(0, data.closingCashCount || 0);
    const variance = actualCashCount - expectedCashInDrawer; // negative = shortage, positive = excess

    // Update DB record
    if (openDbShift) {
      await (prisma as any).cashierShift.update({
        where: { id: openDbShift.id },
        data: {
          endTime: new Date(),
          closingCashCount: actualCashCount,
          variance,
          status: 'CLOSED'
        }
      });
    }

    activeShifts.delete(data.cashierId);

    return {
      shift: {
        shiftId: openDbShift?.id,
        cashierName: data.cashierName,
        counterDesk,
        startTime,
        endTime: new Date(),
        openingFloat,
        cashTransactionsCount: cashTransactions.length,
        shiftCashCollected,
        expectedCashInDrawer,
        actualCashCount,
        variance,
        reconciliationStatus: variance === 0 ? 'BALANCED' : variance > 0 ? 'EXCESS' : 'SHORTAGE'
      }
    };
  }

  static async getActiveShift(cashierId: string) {
    const openDbShift = await (prisma as any).cashierShift.findFirst({
      where: {
        cashierId,
        status: 'OPEN'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (openDbShift) return openDbShift;
    return activeShifts.get(cashierId) || null;
  }
}
