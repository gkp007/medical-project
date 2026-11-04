import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { EmailService } from '../../shared/email/email.service.js';

export class BusinessService {
  /**
   * Top-level dashboard KPI metrics and recent transactions
   */
  static async getDashboardMetrics() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayCases, totalPatients, pendingCases, clinic, recentActivityCases] = await Promise.all([
      prisma.case.findMany({
        where: { createdAt: { gte: todayStart } },
        include: { items: true, payments: true, patient: true, doctor: true }
      }),
      prisma.patient.count({ where: { isArchived: false } }),
      prisma.case.count({
        where: { reportStatus: { in: ['Registered', 'Sample Collected', 'In Process'] } }
      }),
      prisma.clinicSetting.findUnique({ where: { id: 'clinic_default' } }),
      prisma.case.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { patient: true, doctor: true, items: true }
      })
    ]);

    const todayGross = todayCases.reduce((sum, c) => sum + c.grossAmount, 0);
    const todayDiscounts = todayCases.reduce((sum, c) => sum + c.discountAmount, 0);
    const todaySales = todayCases.reduce((sum, c) => sum + c.netPayable, 0);
    const todayCollections = todayCases.reduce((sum, c) => sum + c.paidAmount, 0);
    const todayDues = todayCases.reduce((sum, c) => sum + c.balanceDue, 0);

    return {
      metrics: {
        todayCasesCount: todayCases.length,
        todayGross,
        todayDiscounts,
        todaySales,
        todayCollections,
        todayDues,
        pendingReportsCount: pendingCases,
        totalPatientsCount: totalPatients,
        monthlyTarget: 500000.0,
        monthlyTargetAchieved: 342500.0
      },
      recentCases: recentActivityCases.map(c => ({
        id: c.id,
        billNumber: c.billNumber,
        dailyCode: c.dailyCode,
        uhid: c.uhid,
        patientName: `${c.patient.prefix || 'Mr.'} ${c.patient.fullName}`,
        doctorName: c.doctor.name,
        modality: c.modality,
        gross: c.grossAmount,
        paid: c.paidAmount,
        due: c.balanceDue,
        reportStatus: c.reportStatus,
        paymentStatus: c.paymentStatus,
        createdAt: c.createdAt
      }))
    };
  }

  /**
   * Day-End Financial Summary with Net Income formula:
   * Net Income = Total Income + Total Collection Charge - Expenses
   */
  static async getDailyBusiness(dateString?: string) {
    let startOfDay: Date;
    let endOfDay: Date;
    let dateStr: string;

    if (dateString && dateString.includes('-')) {
      const parts = dateString.split('T')[0].split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      startOfDay = new Date(year, month, day, 0, 0, 0, 0);
      endOfDay = new Date(year, month, day, 23, 59, 59, 999);
      dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else {
      const targetDate = dateString ? new Date(dateString) : new Date();
      startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
      endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
      dateStr = `${startOfDay.getFullYear()}-${String(startOfDay.getMonth() + 1).padStart(2, '0')}-${String(startOfDay.getDate()).padStart(2, '0')}`;
    }

    const [cases, payments, expenses, collectionAgents] = await Promise.all([
      prisma.case.findMany({
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        include: { items: true, agent: true }
      }),
      prisma.paymentTransaction.findMany({
        where: { createdAt: { gte: startOfDay, lte: endOfDay } }
      }),
      prisma.expenseVoucher.findMany({
        where: { date: { gte: startOfDay, lte: endOfDay }, isVoid: false }
      }),
      prisma.collectionAgent.findMany({
        where: { isActive: true }
      })
    ]);

    const grossSales = cases.reduce((sum, c) => sum + c.grossAmount, 0);
    const totalDiscounts = cases.reduce((sum, c) => sum + c.discountAmount, 0);
    const netRevenue = cases.reduce((sum, c) => sum + c.netPayable, 0);
    const totalDues = cases.reduce((sum, c) => sum + c.balanceDue, 0);

    // Instrument split breakdown
    let cash = 0;
    let upi = 0;
    let card = 0;
    let cheque = 0;
    let insurance = 0;
    let refunds = 0;

    for (const p of payments) {
      if (p.isRefund || p.amount < 0) {
        refunds += Math.abs(p.amount);
      } else {
        const mode = p.mode.toLowerCase();
        if (mode.includes('cash')) cash += p.amount;
        else if (mode.includes('upi')) upi += p.amount;
        else if (mode.includes('card')) card += p.amount;
        else if (mode.includes('cheque')) cheque += p.amount;
        else if (mode.includes('insurance') || mode.includes('credit')) insurance += p.amount;
        else cash += p.amount; // default
      }
    }

    const totalIncome = cash + upi + card + cheque + insurance;
    
    // Home collection charges from home collection cases
    const totalCollectionCharge = cases.filter(c => c.agentId).length * 100.0;

    // Expenses breakdown
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const cashExpenses = expenses.filter(e => e.paymentMode.toLowerCase().includes('cash')).reduce((sum, e) => sum + e.amount, 0);

    // Exact Net Income formula: Income + Collection Charge - Expenses
    const netIncome = (totalIncome - refunds) + totalCollectionCharge - totalExpenses;
    const netCashInDrawer = Math.max(0, cash - refunds - cashExpenses);

    return {
      date: dateStr,
      totalCases: cases.length,
      grossSales,
      totalDiscounts,
      netRevenue,
      totalDues,
      financials: {
        totalIncome,
        totalRefunds: refunds,
        netIncomeCollected: totalIncome - refunds,
        totalCollectionCharge,
        totalExpenses,
        netIncome, // Formal Day-End Net Income
        netCashInDrawer
      },
      paymentBreakdown: {
        cash,
        upi,
        card,
        cheque,
        insurance,
        refunds
      },
      expensesCount: expenses.length
    };
  }

  /**
   * Generates printable Day-End Settlement Sheet report
   */
  static async getDailyReport(dateString?: string) {
    const summary = await this.getDailyBusiness(dateString);
    let startOfDay: Date;
    let endOfDay: Date;

    if (dateString && dateString.includes('-')) {
      const parts = dateString.split('T')[0].split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      startOfDay = new Date(year, month, day, 0, 0, 0, 0);
      endOfDay = new Date(year, month, day, 23, 59, 59, 999);
    } else {
      const targetDate = dateString ? new Date(dateString) : new Date();
      startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
      endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
    }

    const [clinic, expensesList, recentPayments, dailyCases] = await Promise.all([
      prisma.clinicSetting.findUnique({ where: { id: 'clinic_default' } }),
      prisma.expenseVoucher.findMany({
        where: { date: { gte: startOfDay, lte: endOfDay }, isVoid: false }
      }),
      prisma.paymentTransaction.findMany({
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        include: { case: { include: { patient: true, doctor: true } } }
      }),
      prisma.case.findMany({
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        include: { patient: true, doctor: true }
      })
    ]);

    return {
      clinic,
      summary,
      expenses: expensesList,
      transactions: recentPayments.map(p => ({
        receiptNumber: p.receiptNumber,
        billNumber: p.case?.billNumber || 'BL-001',
        patientName: p.case?.patient?.fullName || 'Walk-in Patient',
        referredBy: p.case?.doctor?.name || 'Self Referral',
        amount: p.amount,
        mode: p.mode,
        receivedBy: p.receivedBy,
        time: p.createdAt
      })),
      cases: dailyCases.map(c => ({
        id: c.id,
        regNo: c.billNumber,
        date: c.createdAt,
        patient: `${c.patient.prefix || 'Mr.'} ${c.patient.fullName}`,
        referredBy: c.doctor?.name || 'Self Referral',
        total: c.grossAmount,
        paid: c.paidAmount,
        discount: c.discountAmount,
        balance: c.balanceDue,
        status: c.paymentStatus
      })),
      printedAt: new Date().toISOString()
    };
  }

  static async emailDailyReport(dateString?: string, recipientEmail?: string) {
    const targetEmail = recipientEmail || 'directors@metropolisdiagnostics.com';
    const report = await this.getDailyReport(dateString);

    await EmailService.sendDailySummaryEmail({
      toEmail: targetEmail,
      date: report.summary.date,
      totalRevenue: report.summary.financials.totalIncome,
      totalExpenses: report.summary.financials.totalExpenses,
      netProfit: report.summary.financials.netIncome,
      cashInDrawer: report.summary.financials.netCashInDrawer,
      billCount: report.summary.totalCases
    });

    return {
      success: true,
      message: `Day-end settlement report for ${report.summary.date} successfully dispatched to ${targetEmail}`,
      dispatchedTo: targetEmail,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Debt Aging Analysis segregated into 4 buckets:
   * 0-7 days, 8-30 days, 31-60 days, >60 days
   */
  static async getDuesAging() {
    const cases = await prisma.case.findMany({
      where: {
        balanceDue: { gt: 0 },
        reportStatus: { not: 'Cancelled' }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        doctor: true
      }
    });

    const now = Date.now();
    let bucket0to7 = 0;
    let bucket8to30 = 0;
    let bucket31to60 = 0;
    let bucketOver60 = 0;

    const debtorsList = cases.map(c => {
      const diffMs = now - new Date(c.createdAt).getTime();
      const daysOutstanding = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (daysOutstanding <= 7) bucket0to7 += c.balanceDue;
      else if (daysOutstanding <= 30) bucket8to30 += c.balanceDue;
      else if (daysOutstanding <= 60) bucket31to60 += c.balanceDue;
      else bucketOver60 += c.balanceDue;

      return {
        id: c.id,
        billNumber: c.billNumber,
        dailyCode: c.dailyCode,
        uhid: c.uhid,
        patientName: `${c.patient.prefix || 'Mr.'} ${c.patient.fullName}`,
        mobile: c.patient.mobile,
        doctorName: c.doctor.name,
        netPayable: c.netPayable,
        paidAmount: c.paidAmount,
        balanceDue: c.balanceDue,
        daysOutstanding,
        registeredAt: c.createdAt
      };
    });

    const totalOutstanding = bucket0to7 + bucket8to30 + bucket31to60 + bucketOver60;

    return {
      totalOutstanding,
      totalDueCases: cases.length,
      buckets: {
        bucket0to7,
        bucket8to30,
        bucket31to60,
        bucketOver60
      },
      debtors: debtorsList.sort((a, b) => b.balanceDue - a.balanceDue)
    };
  }

  static async waiveDue(caseId: string, reason: string, waivedBy: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: { patient: true }
    });
    if (!caseRecord) throw new NotFoundError('Case record not found');

    if (caseRecord.balanceDue <= 0) {
      throw new BadRequestError('Case has no outstanding balance due to waive');
    }

    const waivedAmount = caseRecord.balanceDue;

    return prisma.$transaction(async (tx) => {
      const updatedCase = await tx.case.update({
        where: { id: caseId },
        data: {
          balanceDue: 0,
          paymentStatus: 'Paid',
          notes: `${caseRecord.notes || ''} [Due balance of ₹${waivedAmount} waived by ${waivedBy}. Reason: ${reason || 'Bad debt write-off'}]`.trim()
        },
        include: { patient: true, doctor: true }
      });

      const actorUser = await tx.user.findFirst({ where: { OR: [{ username: waivedBy }, { role: 'SUPER_ADMIN' }] } }) || await tx.user.findFirst();
      if (actorUser) {
        await tx.auditLog.create({
          data: {
            action: 'DUE_BALANCE_WAIVED',
            entityType: 'Case',
            entityId: caseId,
            actorId: actorUser.id,
            actorName: waivedBy,
            changes: JSON.stringify({
              waivedAmount,
              reason: reason || 'Bad debt write-off',
              billNumber: caseRecord.billNumber,
              patientName: caseRecord.patient.fullName
            })
          }
        });
      }

      return updatedCase;
    });
  }

  static async listExpenses(query?: { category?: string; startDate?: string; endDate?: string }) {
    const where: any = { isVoid: false };

    if (query?.category && query.category !== 'ALL') {
      where.category = query.category;
    }

    if (query?.startDate || query?.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const expenses = await prisma.expenseVoucher.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Grouping by category
    const categoryTotals: Record<string, number> = {};
    for (const e of expenses) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }

    return {
      totalAmount,
      totalVouchers: expenses.length,
      categoryTotals,
      expenses
    };
  }

  static async createExpense(data: {
    category: string;
    name?: string;
    amount: number;
    paymentMode?: string;
    vendor?: string;
    invoiceNo?: string;
    notes?: string;
    cashierName?: string;
    date?: string;
  }) {
    if (!data.amount || data.amount <= 0) {
      throw new BadRequestError('Expense voucher amount must be greater than zero');
    }
    if (!data.category) {
      throw new BadRequestError('Expense category is required');
    }

    const count = await prisma.expenseVoucher.count();
    const voucherNumber = `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.expenseVoucher.create({
      data: {
        voucherNumber,
        category: data.category,
        name: data.name || data.category,
        vendor: data.vendor || null,
        invoiceNo: data.invoiceNo || null,
        description: data.notes || data.name || data.category,
        amount: data.amount,
        paymentMode: data.paymentMode || 'Cash',
        cashierName: data.cashierName || 'Accountant Desk',
        date: data.date ? new Date(data.date) : new Date()
      }
    });
  }

  static async deleteExpense(id: string) {
    const expense = await prisma.expenseVoucher.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundError('Expense voucher not found');
    }
    await prisma.expenseVoucher.delete({ where: { id } });
    return { success: true, message: 'Expense deleted successfully', id };
  }

  /**
   * Doctor Referral Commission Statements
   */
  static async getReferralStatements(query?: { doctorId?: string; startDate?: string; endDate?: string }) {
    const doctorWhere: any = { isActive: true };
    if (query?.doctorId && query.doctorId !== 'ALL') {
      doctorWhere.id = query.doctorId;
    }

    const doctors = await prisma.doctor.findMany({
      where: doctorWhere,
      include: {
        cases: {
          where: { reportStatus: { not: 'Cancelled' } },
          include: { items: true }
        },
        payouts: true
      }
    });

    const statements = doctors.map(doc => {
      let totalBilled = 0;
      let totalCommissionAccrued = 0;

      for (const c of doc.cases) {
        totalBilled += c.grossAmount;
        // Modality-specific commission calculation
        let commRate = doc.defaultCommissionPct;
        const modUpper = c.modality.toUpperCase();
        if (modUpper.includes('LAB') || modUpper.includes('PATHOLOGY')) {
          commRate = doc.pathologyCommission;
        } else if (modUpper.includes('USG')) {
          commRate = doc.usgCommission;
        } else if (modUpper.includes('XRAY') || modUpper.includes('X-RAY')) {
          commRate = doc.xrayCommission;
        } else if (modUpper.includes('CT')) {
          commRate = doc.ctCommission;
        }
        totalCommissionAccrued += (c.grossAmount * commRate) / 100;
      }

      const totalPaidOut = doc.payouts.reduce((sum, p) => sum + p.paidAmount, 0);
      const balancePayable = Math.max(0, totalCommissionAccrued - totalPaidOut);

      return {
        doctorId: doc.id,
        doctorName: doc.name,
        specialty: doc.specialty,
        mobile: doc.mobile,
        totalCasesReferred: doc.cases.length,
        totalBilledGross: totalBilled,
        commissionRates: {
          defaultPct: doc.defaultCommissionPct,
          pathologyPct: doc.pathologyCommission,
          usgPct: doc.usgCommission,
          xrayPct: doc.xrayCommission
        },
        totalCommissionAccrued: Math.round(totalCommissionAccrued * 100) / 100,
        totalPaidOut,
        balancePayable: Math.round(balancePayable * 100) / 100,
        payoutsHistory: doc.payouts
      };
    });

    return statements;
  }

  /**
   * Settle Doctor Commission Payout
   */
  static async settleDoctorPayout(
    doctorId: string,
    data: {
      amount: number;
      paymentMode: string;
      transactionRef?: string;
      periodStart?: string;
      periodEnd?: string;
    },
    settledBy: string
  ) {
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundError('Doctor record not found');

    if (!data.amount || data.amount <= 0) {
      throw new BadRequestError('Payout disbursement amount must be greater than zero');
    }

    const count = await prisma.doctorPayout.count();
    const payoutNumber = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const payout = await prisma.doctorPayout.create({
      data: {
        payoutNumber,
        doctorId,
        periodStart: data.periodStart ? new Date(data.periodStart) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        periodEnd: data.periodEnd ? new Date(data.periodEnd) : new Date(),
        totalCommission: data.amount,
        paidAmount: data.amount,
        paymentMode: data.paymentMode || 'Bank Transfer',
        transactionRef: data.transactionRef || `REF-${Date.now().toString().slice(-6)}`
      }
    });

    // Also record an Expense voucher under Doctor Commission category
    await prisma.expenseVoucher.create({
      data: {
        voucherNumber: `EXP-COMM-${payoutNumber}`,
        name: `Commission Settlement for ${doctor.name}`,
        category: 'Doctor Referral Commission',
        vendor: doctor.name,
        amount: data.amount,
        paymentMode: data.paymentMode || 'Bank Transfer',
        cashierName: settledBy,
        description: `Payout voucher ${payoutNumber} disbursed via ${data.paymentMode}. Ref: ${data.transactionRef || 'N/A'}`
      }
    });

    return payout;
  }

  static async listActivities() {
    const [recentCases, recentPayments] = await Promise.all([
      prisma.case.findMany({
        take: 15,
        orderBy: { updatedAt: 'desc' },
        include: { patient: true }
      }),
      prisma.paymentTransaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { case: { include: { patient: true } } }
      })
    ]);

    const events: any[] = [];

    recentCases.forEach(c => {
      events.push({
        id: `case-${c.id}`,
        timestamp: c.updatedAt,
        type: 'CASE_WORKFLOW',
        actor: 'Staff Operator',
        description: `Case ${c.billNumber} (${c.patient.fullName}) transitioned to ${c.reportStatus}`,
        severity: 'info'
      });
    });

    recentPayments.forEach(p => {
      events.push({
        id: `pay-${p.id}`,
        timestamp: p.createdAt,
        type: 'FINANCIAL_TRANSACTION',
        actor: p.receivedBy,
        description: `Payment of ₹${p.amount} received for ${p.case.billNumber} via ${p.mode} (${p.receiptNumber})`,
        severity: 'success'
      });
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static async exportData(type: string, fromDate?: string, toDate?: string) {
    const dateFilter: any = {};
    if (fromDate || toDate) {
      if (fromDate) dateFilter.gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }
    }

    if (type === 'patients') {
      const where: any = {};
      if (fromDate || toDate) where.createdAt = dateFilter;
      const patients = await prisma.patient.findMany({ where, orderBy: { createdAt: 'desc' } });
      const rows = ['UHID,Full Name,Gender,Age,Mobile,Email,Total Visits,Last Visit,Registered Date'];
      patients.forEach(p => {
        rows.push(`"${p.uhid}","${p.fullName}","${p.gender}","${p.age || p.ageYears || ''}","${p.mobile}","${p.email || ''}",${p.totalVisits},"${p.lastVisitDate ? p.lastVisitDate.toLocaleDateString() : ''}","${p.createdAt.toLocaleDateString()}"`);
      });
      return rows.join('\n');
    }

    if (type === 'expenses') {
      const where: any = {};
      if (fromDate || toDate) where.date = dateFilter;
      const expenses = await prisma.expenseVoucher.findMany({ where, orderBy: { date: 'desc' } });
      const rows = ['Voucher Number,Date,Category,Name,Vendor,Amount,Payment Mode,Cashier'];
      expenses.forEach(e => {
        rows.push(`"${e.voucherNumber}","${e.date.toLocaleDateString()} ${e.date.toLocaleTimeString()}","${e.category}","${e.name}","${e.vendor || ''}",${e.amount},"${e.paymentMode}","${e.cashierName}"`);
      });
      return rows.join('\n');
    }

    if (type === 'transactions') {
      const where: any = {};
      if (fromDate || toDate) where.createdAt = dateFilter;
      const txs = await prisma.paymentTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { case: { include: { patient: true } } }
      });
      const rows = ['Receipt Number,Bill Number,UHID,Patient Name,Amount (Rs),Payment Mode,Received By,Date,Time,Note'];
      txs.forEach(t => {
        const dt = new Date(t.createdAt);
        rows.push(`"${t.receiptNumber}","${t.case?.billNumber || ''}","${t.case?.uhid || ''}","${t.case?.patient?.fullName || ''}",${t.amount},"${t.mode}","${t.receivedBy}","${dt.toLocaleDateString()}","${dt.toLocaleTimeString()}","${t.note || ''}"`);
      });
      return rows.join('\n');
    }

    if (type === 'doctors' || type === 'referrers') {
      const doctors = await prisma.doctor.findMany({ orderBy: { name: 'asc' } });
      const rows = ['Doctor ID,Doctor Name,Degree,Specialty,Mobile,Email,Clinic Address,Commission Rate %'];
      doctors.forEach(d => {
        rows.push(`"${d.id}","${d.name}","${d.degree || ''}","${d.specialty || ''}","${d.mobile || ''}","${d.email || ''}","${d.address || ''}",${d.commissionPct}`);
      });
      return rows.join('\n');
    }

    if (type === 'tests' || type === 'ratelist') {
      const tests = await prisma.investigation.findMany({ orderBy: { name: 'asc' } });
      const rows = ['Test Code,Investigation Name,Department,Specimen,Container,Rate (Rs),Test Type'];
      tests.forEach(t => {
        rows.push(`"${t.code}","${t.name}","${t.department}","${t.specimen}","${t.container}",${t.rate},"${t.testType || ''}"`);
      });
      return rows.join('\n');
    }

    if (type === 'results') {
      const where: any = {};
      if (fromDate || toDate) where.createdAt = dateFilter;
      const results = await prisma.clinicalResult.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: {
          case: {
            include: {
              patient: true,
              doctor: true
            }
          }
        }
      });
      const rows = ['Bill Number,UHID,Patient Name,Doctor,Parameter Code,Parameter Name,Value,Unit,Flag,Reference Interval,Authorized By,Authorized Date'];
      results.forEach(r => {
        if (r.parameterValues) {
          try {
            const params = JSON.parse(r.parameterValues);
            params.forEach((p: any) => {
              rows.push(`"${r.case.billNumber}","${r.case.uhid}","${r.case.patient.fullName}","${r.case.doctor.name}","${p.code || ''}","${p.name || ''}","${p.value || ''}","${p.unit || ''}","${p.flag || 'NORMAL'}","${p.referenceInterval || ''}","${r.authorizedBy || ''}","${r.authorizedAt ? r.authorizedAt.toLocaleDateString() : ''}"`);
            });
          } catch {}
        }
      });
      return rows.join('\n');
    }

    // Default: cases / bills
    const where: any = {};
    if (fromDate || toDate) where.createdAt = dateFilter;
    const cases = await prisma.case.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { patient: true, doctor: true }
    });
    const rows = ['Bill Number,Daily Code,UHID,Patient Name,Modality,Doctor,Gross (Rs),Discount (Rs),Net Payable (Rs),Paid (Rs),Due (Rs),Report Status,Payment Status,Date'];
    cases.forEach(c => {
      rows.push(`"${c.billNumber}","${c.dailyCode || ''}","${c.uhid}","${c.patient.fullName}","${c.modality}","${c.doctor.name}",${c.grossAmount},${c.discountAmount},${c.netPayable},${c.paidAmount},${c.balanceDue},"${c.reportStatus}","${c.paymentStatus}","${c.createdAt.toLocaleDateString()}"`);
    });
    return rows.join('\n');
  }
}
