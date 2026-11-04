import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { PatientService } from '../patients/patient.service.js';
import { amountInWords } from '../../shared/financial/currencyInWords.js';
import { AuthUserPayload } from '../../core/middleware/authenticate.js';

export class CaseService {
  /**
   * Generates sequence Bill Number: e.g. BL-2026-0002
   */
  static async generateBillNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.case.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `BL-${year}-${sequence}`;
  }

  /**
   * Generates sequence Receipt Number: e.g. REC-2026-0002
   */
  static async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.paymentTransaction.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `REC-${year}-${sequence}`;
  }

  /**
   * Generates Daily Sequential Code (L1, U1, X1, etc.) per modality per day
   */
  static async generateDailyCode(modality: string): Promise<string> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    let prefix = 'L';
    const modUpper = (modality || '').toUpperCase();
    if (modUpper.includes('USG') || modUpper.includes('ULTRASOUND')) {
      prefix = 'U';
    } else if (modUpper.includes('XRAY') || modUpper.includes('X-RAY')) {
      prefix = 'X';
    } else if (modUpper.includes('CT')) {
      prefix = 'C';
    } else if (modUpper.includes('ECG')) {
      prefix = 'E';
    }

    const count = await prisma.case.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        dailyCode: { startsWith: prefix }
      }
    });

    return `${prefix}${count + 1}`;
  }

  static async createCase(data: any, receivedBy: string = 'Front Desk', currentUser?: AuthUserPayload) {
    // 1. Resolve or create Patient
    let patient;
    if (data.patient.id) {
      patient = await prisma.patient.findUnique({ where: { id: data.patient.id } });
      if (!patient) throw new NotFoundError('Selected patient ID not found');
      // Increment patient total visits
      await prisma.patient.update({
        where: { id: patient.id },
        data: {
          totalVisits: { increment: 1 },
          lastVisitDate: new Date()
        }
      });
    } else {
      patient = await PatientService.createPatient(data.patient);
    }

    // 2. Fetch Investigations to calculate gross and line items (by id or test code)
    const testIds = data.investigations.map((i: any) => i.testId);
    const tests = await prisma.investigation.findMany({
      where: {
        OR: [
          { id: { in: testIds } },
          { code: { in: testIds } }
        ]
      },
      include: { parameters: { include: { ranges: true } } }
    });

    if (tests.length === 0) {
      throw new BadRequestError('No valid investigations found for the provided test IDs');
    }

    let grossAmount = 0;
    const caseItemsData = tests.map(test => {
      const selectedInfo = data.investigations.find((i: any) => i.testId === test.id || i.testId === test.code);
      const discount = selectedInfo?.discount || 0;
      const netAmount = Math.max(0, test.rate - discount);
      grossAmount += test.rate;

      return {
        testId: test.id,
        testCode: test.code,
        testName: test.name,
        department: test.department,
        specimen: test.specimen,
        rate: test.rate,
        discount,
        netAmount,
        deliveryTime: new Date(Date.now() + test.tatHours * 60 * 60 * 1000)
      };
    });

    // 3. Resolve Doctor ID safely
    let doctorId = data.doctorId;
    if (doctorId === 'self' || doctorId === 'doc-self') {
      doctorId = 'doc-self';
    }
    const docExists = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!docExists) {
      const defaultDoc = await prisma.doctor.findFirst({ where: { isActive: true } });
      doctorId = defaultDoc?.id || 'doc-sharma';
    }

    // 4. Calculate Overall Discounts
    let discountAmount = 0;
    if (data.discountType === 'percentage') {
      discountAmount = (grossAmount * (data.discountValue || 0)) / 100;
    } else {
      discountAmount = data.discountValue || 0;
    }
    discountAmount = Math.min(grossAmount, Math.max(0, discountAmount));

    // Role-based discount cap validation: Receptionist discount capped at 15%
    if (discountAmount > 0 && currentUser) {
      const discountPct = grossAmount > 0 ? (discountAmount / grossAmount) * 100 : 0;
      const isPrivileged = currentUser.role === 'SUPER_ADMIN' || currentUser.isOwner || currentUser.role === 'ADMIN';
      if (!isPrivileged && currentUser.role === 'RECEPTIONIST' && discountPct > 15) {
        throw new BadRequestError(`Receptionist discount cannot exceed 15% (attempted: ${discountPct.toFixed(1)}%). Supervisor approval required.`);
      }
    }

    // Mandatory discount reason when discount is applied
    if (discountAmount > 0 && (!data.discountReason || !data.discountReason.trim())) {
      throw new BadRequestError('Discount reason is mandatory when applying a discount');
    }

    const netPayable = Math.max(0, grossAmount - discountAmount);
    const paidAmount = Math.min(netPayable, Math.max(0, data.paidAmount || 0));
    const balanceDue = Math.max(0, netPayable - paidAmount);

    // Explicit authorization required for outstanding dues
    if (balanceDue > 0 && !data.allowDue) {
      throw new BadRequestError('Outstanding due must be explicitly authorized. Set allowDue to true.');
    }

    let paymentStatus = 'Due';
    if (balanceDue === 0 && netPayable > 0) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0 && balanceDue > 0) {
      paymentStatus = 'Partial';
    } else if (netPayable === 0) {
      paymentStatus = 'Paid';
    }

    const [billNumber, dailyCode] = await Promise.all([
      this.generateBillNumber(),
      this.generateDailyCode(data.modality || 'LAB')
    ]);

    // 5. Create Case, Items, and initial payment in transaction
    const newCase = await prisma.$transaction(async (tx) => {
      const createdCase = await tx.case.create({
        data: {
          billNumber,
          dailyCode,
          uhid: patient.uhid,
          patientId: patient.id,
          doctorId,
          agentId: data.agentId || null,
          modality: data.modality || 'LAB',
          reportStatus: 'Registered',
          paymentStatus,
          sampleStatus: data.modality === 'LAB' ? 'Pending' : 'Collected',
          grossAmount,
          discountType: data.discountType || 'fixed',
          discountValue: data.discountValue || 0,
          discountAmount,
          discountReason: data.discountReason || null,
          netPayable,
          paidAmount,
          balanceDue,
          allowDue: Boolean(data.allowDue),
          paymentMode: data.paymentMode || 'Cash',
          notes: data.notes || null,
          items: {
            create: caseItemsData
          }
        },
        include: {
          items: true,
          patient: true,
          doctor: true
        }
      });

      // Record initial payment receipt if paidAmount > 0
      if (paidAmount > 0) {
        const receiptNumber = await this.generateReceiptNumber();
        await tx.paymentTransaction.create({
          data: {
            caseId: createdCase.id,
            receiptNumber,
            amount: paidAmount,
            mode: data.paymentMode || 'Cash',
            receivedBy,
            note: 'Initial billing settlement'
          }
        });
      }

      // Initialize empty ClinicalResult for Pathology
      if (data.modality === 'LAB') {
        const initialParameters: any[] = [];
        tests.forEach(test => {
          test.parameters.forEach(param => {
            initialParameters.push({
              testId: test.id,
              testName: test.name,
              parameterId: param.id,
              code: param.code,
              name: param.name,
              unit: param.unit,
              formula: param.formula,
              isCalculated: param.isCalculated,
              value: '',
              flag: 'NORMAL',
              referenceInterval: param.ranges[0] ? `${param.ranges[0].lowerBound} - ${param.ranges[0].upperBound}` : ''
            });
          });
        });

        await tx.clinicalResult.create({
          data: {
            caseId: createdCase.id,
            parameterValues: JSON.stringify(initialParameters)
          }
        });
      } else {
        // Initialize empty Radiology report
        await tx.radiologyReport.create({
          data: {
            caseId: createdCase.id,
            modality: data.modality,
            findings: JSON.stringify({}),
            impression: ''
          }
        });
      }

      return createdCase;
    });

    return newCase;
  }

  static async listCases(query: {
    search?: string;
    modality?: string;
    paymentStatus?: string;
    reportStatus?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.modality && query.modality !== 'ALL' && query.modality !== 'undefined') {
      where.modality = query.modality;
    }
    if (query.paymentStatus && query.paymentStatus !== 'ALL' && query.paymentStatus !== 'undefined') {
      where.paymentStatus = query.paymentStatus;
    }
    if (query.reportStatus && query.reportStatus !== 'ALL' && query.reportStatus !== 'undefined') {
      where.reportStatus = query.reportStatus;
    }

    if ((query.startDate && query.startDate !== 'undefined') || (query.endDate && query.endDate !== 'undefined')) {
      where.createdAt = {};
      if (query.startDate && query.startDate !== 'undefined') where.createdAt.gte = new Date(query.startDate);
      if (query.endDate && query.endDate !== 'undefined') {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (query.search && query.search.trim() && query.search !== 'undefined') {
      const term = query.search.trim();
      where.OR = [
        { billNumber: { contains: term } },
        { uhid: { contains: term } },
        { patient: { fullName: { contains: term } } },
        { patient: { mobile: { contains: term } } }
      ];
    }

    const [total, cases] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: true,
          doctor: true,
          items: true,
          payments: true
        }
      })
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      cases
    };
  }

  static async getCaseById(id: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        agent: true,
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
        clinicalResult: true,
        radiologyStudy: true
      }
    });

    if (!caseRecord) throw new NotFoundError('Case not found');
    return caseRecord;
  }

  static async collectDue(caseId: string, amount: number, mode: string, receivedBy: string, note?: string) {
    if (!amount || amount <= 0 || isNaN(amount)) {
      throw new BadRequestError('Payment amount must be greater than zero.');
    }

    const caseRecord = await prisma.case.findUnique({ where: { id: caseId } });
    if (!caseRecord) throw new NotFoundError('Case record not found');

    if (caseRecord.balanceDue <= 0) {
      throw new BadRequestError('Case is already fully settled. No due balance remaining.');
    }

    const payAmount = Math.min(amount, caseRecord.balanceDue);
    const newPaidAmount = caseRecord.paidAmount + payAmount;
    const newBalanceDue = Math.max(0, caseRecord.balanceDue - payAmount);
    const newPaymentStatus = newBalanceDue === 0 ? 'Paid' : 'Partial';

    const receiptNumber = await this.generateReceiptNumber();

    const updated = await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          caseId,
          receiptNumber,
          amount: payAmount,
          mode,
          receivedBy,
          note: note || 'Due balance collection'
        }
      });

      return tx.case.update({
        where: { id: caseId },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          paymentStatus: newPaymentStatus
        },
        include: {
          patient: true,
          payments: { orderBy: { createdAt: 'desc' } }
        }
      });
    });

    return updated;
  }

  /**
   * Update case details, patient demographics, or referring doctor
   */
  static async updateCase(id: string, data: any, updatedBy: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: { patient: true, doctor: true }
    });

    if (!caseRecord) {
      throw new NotFoundError('Case record not found');
    }

    if (caseRecord.reportStatus === 'Signed Off') {
      throw new BadRequestError('Cannot modify a case that has already been signed off');
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update patient demographic details if provided
      if (data.patient) {
        await tx.patient.update({
          where: { id: caseRecord.patientId },
          data: {
            prefix: data.patient.prefix !== undefined ? data.patient.prefix : undefined,
            fullName: data.patient.fullName !== undefined ? data.patient.fullName : undefined,
            gender: data.patient.gender !== undefined ? data.patient.gender : undefined,
            age: data.patient.age !== undefined ? Number(data.patient.age) : undefined,
            ageYears: data.patient.age !== undefined ? Number(data.patient.age) : undefined,
            ageUnit: data.patient.ageUnit !== undefined ? data.patient.ageUnit : undefined,
            mobile: data.patient.mobile !== undefined ? data.patient.mobile : undefined,
            email: data.patient.email !== undefined ? data.patient.email : undefined,
            address: data.patient.address !== undefined ? data.patient.address : undefined,
            bloodGroup: data.patient.bloodGroup !== undefined ? data.patient.bloodGroup : undefined,
          }
        });
      }

      // 2. Doctor update if provided
      if (data.doctorId && data.doctorId !== caseRecord.doctorId) {
        const doctorExists = await tx.doctor.findUnique({ where: { id: data.doctorId } });
        if (!doctorExists) {
          throw new NotFoundError(`Doctor with ID ${data.doctorId} not found`);
        }
      }

      // 3. Update Case fields
      const updatedCase = await tx.case.update({
        where: { id },
        data: {
          doctorId: data.doctorId || undefined,
          agentId: data.agentId !== undefined ? data.agentId : undefined,
          isUrgent: data.isUrgent !== undefined ? Boolean(data.isUrgent) : undefined,
          notes: data.notes !== undefined ? data.notes : undefined,
        },
        include: {
          patient: true,
          doctor: true,
          items: true,
          payments: true
        }
      });

      // 4. Audit Log
      const actorUser = await tx.user.findFirst({ where: { OR: [{ username: updatedBy }, { role: 'SUPER_ADMIN' }] } }) || await tx.user.findFirst();
      if (actorUser) {
        await tx.auditLog.create({
          data: {
            action: 'CASE_UPDATED',
            entityType: 'Case',
            entityId: id,
            actorId: actorUser.id,
            actorName: updatedBy,
            changes: JSON.stringify({
              updatedFields: Object.keys(data),
              billNumber: caseRecord.billNumber
            })
          }
        });
      }

      return updatedCase;
    });
  }

  /**
   * Update sample collection status (Pending -> Collected -> Rejected -> In Process)
   */
  static async updateSampleStatus(caseId: string, sampleStatus: string, rejectionReason?: string) {
    const caseRecord = await prisma.case.findUnique({ where: { id: caseId } });
    if (!caseRecord) throw new NotFoundError('Case not found');

    const validStatuses = ['Pending', 'Collected', 'Rejected', 'In Process'];
    if (!validStatuses.includes(sampleStatus)) {
      throw new BadRequestError(`Invalid sample status. Must be one of: ${validStatuses.join(', ')}`);
    }

    let reportStatus = caseRecord.reportStatus;
    if (sampleStatus === 'Collected' && caseRecord.reportStatus === 'Registered') {
      reportStatus = 'Sample Collected';
    } else if (sampleStatus === 'Rejected') {
      reportStatus = 'Sample Rejected';
    }

    return prisma.case.update({
      where: { id: caseId },
      data: {
        sampleStatus,
        reportStatus,
        collectedAt: sampleStatus === 'Collected' ? new Date() : caseRecord.collectedAt,
        notes: rejectionReason
          ? `${caseRecord.notes || ''} | [Sample Rejected: ${rejectionReason}]`.trim()
          : caseRecord.notes
      },
      include: { patient: true, doctor: true }
    });
  }

  static async cancelCase(caseId: string, reason: string, cancelledBy: string) {
    const caseRecord = await prisma.case.findUnique({ where: { id: caseId } });
    if (!caseRecord) throw new NotFoundError('Case not found');

    if (caseRecord.reportStatus === 'Signed Off') {
      throw new BadRequestError('Cannot cancel a case whose medical report has already been authorized and signed off.');
    }

    return prisma.$transaction(async (tx) => {
      // If payment was made, record a refund transaction
      if (caseRecord.paidAmount > 0) {
        const refundReceipt = await this.generateReceiptNumber();
        await tx.paymentTransaction.create({
          data: {
            caseId,
            receiptNumber: `REF-${refundReceipt}`,
            amount: -caseRecord.paidAmount,
            mode: caseRecord.paymentMode,
            receivedBy: cancelledBy,
            note: `Refund for cancellation: ${reason}`,
            isRefund: true,
            refundReason: reason
          }
        });
      }

      return tx.case.update({
        where: { id: caseId },
        data: {
          reportStatus: 'Cancelled',
          paymentStatus: 'Cancelled',
          balanceDue: 0,
          notes: `Cancelled by ${cancelledBy}. Reason: ${reason}`
        }
      });
    });
  }

  static async getPrintableBill(caseId: string, layout: string = 'A4') {
    const [caseRecord, clinic] = await Promise.all([
      this.getCaseById(caseId),
      prisma.clinicSetting.findUnique({ where: { id: 'clinic_default' } })
    ]);

    const itemsSummary = caseRecord.items.map(item => ({
      testCode: item.testCode,
      testName: item.testName,
      department: item.department,
      specimen: item.specimen,
      rate: item.rate,
      discount: item.discount,
      netAmount: item.netAmount
    }));

    return {
      clinic,
      layout, // 'A4' | 'A5' | 'thermal'
      case: caseRecord,
      items: itemsSummary,
      financialSummary: {
        grossAmount: caseRecord.grossAmount,
        discountType: caseRecord.discountType,
        discountValue: caseRecord.discountValue,
        discountAmount: caseRecord.discountAmount,
        discountReason: caseRecord.discountReason,
        netPayable: caseRecord.netPayable,
        paidAmount: caseRecord.paidAmount,
        balanceDue: caseRecord.balanceDue,
        paymentStatus: caseRecord.paymentStatus,
        paymentMode: caseRecord.paymentMode
      },
      amountInWords: amountInWords(caseRecord.paidAmount),
      balanceDueInWords: caseRecord.balanceDue > 0 ? amountInWords(caseRecord.balanceDue) : null,
      generatedAt: new Date().toISOString()
    };
  }

  static async getBarcodes(caseId: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        patient: true,
        items: {
          include: {
            test: true
          }
        }
      }
    });

    if (!caseRecord) throw new NotFoundError('Case not found');

    // Group items by specimen container
    const containerMap = new Map<string, {
      specimen: string;
      container: string;
      department: string;
      tests: string[];
    }>();

    for (const item of caseRecord.items) {
      const container = item.test?.container || 'Standard Vial';
      const specimen = item.specimen || 'Whole Blood';
      const key = `${specimen}__${container}`;

      if (!containerMap.has(key)) {
        containerMap.set(key, {
          specimen,
          container,
          department: item.department,
          tests: [item.testName]
        });
      } else {
        containerMap.get(key)!.tests.push(item.testName);
      }
    }

    // Generate sticker payloads
    let tubeIndex = 1;
    const barcodes = Array.from(containerMap.values()).map(c => {
      const barcodeValue = `${caseRecord.billNumber}-T${tubeIndex++}`;
      return {
        barcode: barcodeValue,
        billNumber: caseRecord.billNumber,
        dailyCode: caseRecord.dailyCode,
        uhid: caseRecord.patient.uhid,
        patientName: caseRecord.patient.fullName,
        patientAgeGender: `${caseRecord.patient.ageYears}Y / ${caseRecord.patient.gender}`,
        specimen: c.specimen,
        container: c.container,
        department: c.department,
        tests: c.tests,
        collectedAt: caseRecord.collectedAt || caseRecord.createdAt,
        tubeColor: c.container.toLowerCase().includes('edta') ? 'PURPLE' :
                   c.container.toLowerCase().includes('fluoride') ? 'GREY' :
                   c.container.toLowerCase().includes('citrate') ? 'BLUE' :
                   c.container.toLowerCase().includes('heparin') ? 'GREEN' :
                   c.container.toLowerCase().includes('serum') ? 'RED' : 'YELLOW'
      };
    });

    return {
      billNumber: caseRecord.billNumber,
      dailyCode: caseRecord.dailyCode,
      totalTubes: barcodes.length,
      barcodes
    };
  }
}
