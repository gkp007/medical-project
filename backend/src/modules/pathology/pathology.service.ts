import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { BiologicalRangeEvaluator } from '../../shared/clinical/rangeEvaluator.js';
import { ClinicalFormulaEngine } from '../../shared/clinical/formulaEngine.js';
import { EmailService } from '../../shared/email/email.service.js';
import { QrCodeService } from '../../shared/clinical/qrCodeService.js';
import { BarcodeService } from '../../shared/clinical/barcodeService.js';

export class PathologyService {
  /**
   * Real-time bench reports queue for selected date with statistics summary
   */
  static async getTodayWorklist(query: {
    date?: string;
    status?: string;
    department?: string;
    search?: string;
  }) {
    const targetDate = query.date ? new Date(query.date) : new Date();
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

    const where: any = {
      modality: 'LAB',
      reportStatus: { not: 'Cancelled' },
      createdAt: { gte: startOfDay, lte: endOfDay }
    };

    if (query.status && query.status !== 'ALL') {
      where.reportStatus = query.status;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { billNumber: { contains: term } },
        { uhid: { contains: term } },
        { patient: { fullName: { contains: term } } }
      ];
    }

    const [cases, allDayCases] = await Promise.all([
      prisma.case.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: true,
          doctor: true,
          items: true,
          clinicalResult: true
        }
      }),
      prisma.case.findMany({
        where: {
          modality: 'LAB',
          reportStatus: { not: 'Cancelled' },
          createdAt: { gte: startOfDay, lte: endOfDay }
        },
        select: {
          sampleStatus: true,
          reportStatus: true,
          isUrgent: true
        }
      })
    ]);

    // Compute stats
    let totalCases = allDayCases.length;
    let pendingSample = 0;
    let inProcess = 0;
    let resultsEntered = 0;
    let signedOff = 0;
    let urgentStat = 0;

    for (const c of allDayCases) {
      if (c.isUrgent) urgentStat++;
      if (c.sampleStatus === 'Pending') pendingSample++;
      if (c.reportStatus === 'In Process' || c.reportStatus === 'Sample Collected') inProcess++;
      else if (c.reportStatus === 'Results Entered') resultsEntered++;
      else if (c.reportStatus === 'Signed Off') signedOff++;
    }

    const formattedCases = cases.map(c => ({
      id: c.id,
      billNumber: c.billNumber,
      dailyCode: c.dailyCode,
      uhid: c.uhid,
      isUrgent: c.isUrgent,
      registeredAt: c.createdAt,
      patient: {
        fullName: `${c.patient.prefix || 'Mr.'} ${c.patient.fullName}`,
        age: `${c.patient.age || c.patient.ageYears} ${c.patient.ageUnit || 'Years'}`,
        gender: c.patient.gender,
        mobile: c.patient.mobile
      },
      doctor: {
        name: c.doctor.name,
        degree: c.doctor.degree
      },
      testsCount: c.items.length,
      tests: c.items.map(i => i.testName),
      sampleStatus: c.sampleStatus,
      reportStatus: c.reportStatus,
      paymentStatus: c.paymentStatus,
      balanceDue: c.balanceDue
    }));

    return {
      selectedDate: startOfDay.toISOString().split('T')[0],
      stats: {
        totalCases,
        pendingSample,
        inProcess,
        resultsEntered,
        signedOff,
        urgentStat
      },
      cases: formattedCases
    };
  }

  static async updateSampleStatus(caseId: string, status: string, rejectionReason?: string) {
    const caseRecord = await prisma.case.findUnique({ where: { id: caseId } });
    if (!caseRecord) throw new NotFoundError('Case not found');

    const updateData: any = { sampleStatus: status };
    if (status === 'Collected') {
      updateData.collectedAt = new Date();
      if (caseRecord.reportStatus === 'Registered') {
        updateData.reportStatus = 'Sample Collected';
      }
    } else if (status === 'Received') {
      updateData.reportStatus = 'In Process';
    } else if (status === 'Rejected') {
      updateData.notes = rejectionReason ? `Sample Rejected: ${rejectionReason}` : 'Sample Rejected - Redraw requested';
    }

    return prisma.case.update({
      where: { id: caseId },
      data: updateData
    });
  }

  static async getResultsWorksheet(caseId: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        patient: true,
        doctor: true,
        items: {
          include: {
            test: {
              include: {
                parameters: {
                  include: { ranges: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          }
        },
        clinicalResult: true
      }
    });

    if (!caseRecord) throw new NotFoundError('Case not found');

    // Existing saved parameters map
    let savedParams: any[] = [];
    if (caseRecord.clinicalResult?.parameterValues) {
      try {
        savedParams = JSON.parse(caseRecord.clinicalResult.parameterValues);
      } catch {
        savedParams = [];
      }
    }

    // Historical results within 90 days for Delta Check
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const previousCases = await prisma.case.findMany({
      where: {
        uhid: caseRecord.uhid,
        id: { not: caseId },
        reportStatus: 'Signed Off',
        createdAt: { gte: ninetyDaysAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: { clinicalResult: true }
    });

    let previousValuesMap: Record<string, { value: any; date: Date }> = {};
    if (previousCases[0]?.clinicalResult?.parameterValues) {
      try {
        const prevList = JSON.parse(previousCases[0].clinicalResult.parameterValues);
        prevList.forEach((p: any) => {
          previousValuesMap[p.code] = {
            value: p.value,
            date: previousCases[0].createdAt
          };
        });
      } catch {
        previousValuesMap = {};
      }
    }

    const patientAge = caseRecord.patient.age || caseRecord.patient.ageYears || 30;
    const patientGender = caseRecord.patient.gender || 'Male';
    const patientAgeUnit = caseRecord.patient.ageUnit || 'Years';

    // Structure tests with parameters, ranges and 90-day delta check
    const structuredTests = caseRecord.items.map(item => {
      const params = item.test.parameters.map(param => {
        const saved = savedParams.find(p => p.parameterId === param.id || p.code === param.code);
        const currentValue = saved ? saved.value : '';
        const prevEntry = previousValuesMap[param.code];
        const prevValue = prevEntry ? prevEntry.value : null;

        let deltaPercentage: number | null = null;
        let deltaAlert = false;

        if (currentValue && prevValue) {
          const curNum = parseFloat(currentValue);
          const prevNum = parseFloat(prevValue);
          if (!isNaN(curNum) && !isNaN(prevNum) && prevNum > 0) {
            deltaPercentage = Math.round((Math.abs(curNum - prevNum) / prevNum) * 10000) / 100;
            if (deltaPercentage > 25) {
              deltaAlert = true;
            }
          }
        }

        // Map demographic ranges & extract JSON metadata
        const mappedRanges = param.ranges.map(r => {
          let displayRange: string | undefined;
          let minAgeUnit: string | undefined;
          let maxAgeUnit: string | undefined;
          let selectType: string | undefined;
          let rawTextual = r.textualNormal;
          if (r.textualNormal && r.textualNormal.startsWith('{')) {
            try {
              const meta = JSON.parse(r.textualNormal);
              displayRange = meta.displayRange;
              minAgeUnit = meta.minAgeUnit;
              maxAgeUnit = meta.maxAgeUnit;
              selectType = meta.selectType;
              rawTextual = meta.textualNormal;
            } catch {}
          }
          return {
            id: r.id,
            minAge: r.minAge,
            minAgeUnit,
            maxAge: r.maxAge,
            maxAgeUnit,
            gender: r.gender,
            lowerBound: r.lowerBound,
            upperBound: r.upperBound,
            displayRange,
            criticalLow: r.panicLower || undefined,
            criticalHigh: r.panicUpper || undefined,
            textualNormal: rawTextual || undefined,
            selectType
          };
        });

        // Find reference interval for patient demographics
        const evalResult = BiologicalRangeEvaluator.evaluate(
          currentValue,
          mappedRanges,
          patientAge,
          patientGender,
          patientAgeUnit
        );

        return {
          id: param.id,
          code: param.code,
          name: param.name,
          unit: param.unit,
          method: param.method,
          formula: param.formula,
          isCalculated: param.isCalculated,
          value: currentValue,
          previousValue: prevValue,
          previousDate: prevEntry?.date || null,
          deltaPercentage,
          deltaAlert,
          flag: evalResult.flag,
          displayRange: evalResult.referenceIntervalText,
          referenceInterval: evalResult.referenceIntervalText,
          selectType: mappedRanges[0]?.selectType || 'numeric_range',
          ranges: mappedRanges
        };
      });

      return {
        testId: item.test.id,
        testCode: item.test.code,
        testName: item.test.name,
        department: item.test.department,
        specimen: item.test.specimen,
        parameters: params
      };
    });

    return {
      case: {
        id: caseRecord.id,
        billNumber: caseRecord.billNumber,
        dailyCode: caseRecord.dailyCode,
        uhid: caseRecord.uhid,
        registeredAt: caseRecord.createdAt,
        reportStatus: caseRecord.reportStatus,
        isAuthorized: caseRecord.clinicalResult?.isAuthorized || false,
        authorizedBy: caseRecord.clinicalResult?.authorizedBy,
        authorizedAt: caseRecord.clinicalResult?.authorizedAt,
        interpretation: caseRecord.clinicalResult?.interpretation || ''
      },
      patient: {
        id: caseRecord.patient.id,
        uhid: caseRecord.patient.uhid,
        fullName: `${caseRecord.patient.prefix || 'Mr.'} ${caseRecord.patient.fullName}`,
        age: patientAge,
        ageUnit: caseRecord.patient.ageUnit || 'Years',
        gender: patientGender
      },
      doctor: caseRecord.doctor.name,
      tests: structuredTests
    };
  }

  static async saveResults(caseId: string, inputParameters: any[], interpretation?: string) {
    const worksheet = await this.getResultsWorksheet(caseId);

    if (worksheet.case.isAuthorized) {
      throw new BadRequestError('Cannot modify results for a report that has already been signed off by a pathologist.');
    }

    // Build formula evaluation context
    const formulaContext: Record<string, number> = {};
    inputParameters.forEach(p => {
      const num = parseFloat(p.value);
      if (!isNaN(num)) {
        formulaContext[p.code] = num;
      }
    });

    // Flatten all parameters from worksheet tests for dependency resolution
    const allWorksheetParams: any[] = [];
    worksheet.tests.forEach(test => {
      test.parameters.forEach(p => {
        allWorksheetParams.push({ ...p, testId: test.testId, testName: test.testName });
      });
    });

    // Topological sort of parameters to ensure formula dependencies are satisfied
    const sortedParams = ClinicalFormulaEngine.resolveEvaluationOrder(allWorksheetParams as any);

    // Evaluate parameters in topological dependency order
    const evaluatedParametersMap = new Map<string, any>();

    sortedParams.forEach((param: any) => {
      const userInput = inputParameters.find(p => p.parameterId === param.id || p.code === param.code);
      let finalValue = userInput ? userInput.value : '';

      // Auto-calculate formula if applicable
      if (param.isCalculated && param.formula) {
        const calculated = ClinicalFormulaEngine.calculate(param.formula, formulaContext);
        if (calculated !== null) {
          finalValue = calculated;
          formulaContext[param.code] = calculated; // allow chained formulas
        }
      }

      // Delta check evaluation against 90-day history on save
      let deltaPercentage: number | null = null;
      let deltaAlert = false;
      const prevValue = param.previousValue;
      if (finalValue && prevValue) {
        const curNum = parseFloat(finalValue);
        const prevNum = parseFloat(prevValue);
        if (!isNaN(curNum) && !isNaN(prevNum) && prevNum > 0) {
          deltaPercentage = Math.round((Math.abs(curNum - prevNum) / prevNum) * 10000) / 100;
          if (deltaPercentage > 25) {
            deltaAlert = true;
          }
        }
      }

      const mappedRanges = (param.ranges || []).map((r: any) => {
        let displayRange = r.displayRange;
        let minAgeUnit = r.minAgeUnit;
        let maxAgeUnit = r.maxAgeUnit;
        let selectType = r.selectType;
        let rawTextual = r.textualNormal;
        if (r.textualNormal && typeof r.textualNormal === 'string' && r.textualNormal.startsWith('{')) {
          try {
            const meta = JSON.parse(r.textualNormal);
            displayRange = meta.displayRange || displayRange;
            minAgeUnit = meta.minAgeUnit || minAgeUnit;
            maxAgeUnit = meta.maxAgeUnit || maxAgeUnit;
            selectType = meta.selectType || selectType;
            rawTextual = meta.textualNormal || rawTextual;
          } catch {}
        }
        return {
          minAge: r.minAge,
          minAgeUnit,
          maxAge: r.maxAge,
          maxAgeUnit,
          gender: r.gender,
          lowerBound: r.lowerBound,
          upperBound: r.upperBound,
          displayRange,
          criticalLow: r.panicLower || r.criticalLow || undefined,
          criticalHigh: r.panicUpper || r.criticalHigh || undefined,
          textualNormal: rawTextual || undefined,
          selectType
        };
      });

      const evalResult = BiologicalRangeEvaluator.evaluate(
        finalValue,
        mappedRanges,
        worksheet.patient.age,
        worksheet.patient.gender,
        worksheet.patient.ageUnit || 'Years'
      );

      evaluatedParametersMap.set(param.id, {
        parameterId: param.id,
        code: param.code,
        name: param.name,
        unit: param.unit,
        method: param.method,
        value: finalValue,
        previousValue: prevValue || null,
        previousDate: param.previousDate || null,
        deltaPercentage,
        deltaAlert,
        deltaWarning: deltaAlert ? `Delta alert: ${deltaPercentage}% variance from previous result within 90 days. Please verify specimen integrity.` : null,
        flag: evalResult.flag,
        referenceInterval: evalResult.referenceIntervalText,
        displayRange: evalResult.referenceIntervalText,
        isAbnormal: evalResult.isAbnormal,
        isPanicCritical: evalResult.isPanicCritical
      });
    });

    // Reconstruct evaluatedParameters in presentation order (grouped by tests)
    const evaluatedParameters: any[] = [];
    worksheet.tests.forEach(test => {
      test.parameters.forEach(p => {
        const evaluated = evaluatedParametersMap.get(p.id);
        if (evaluated) {
          evaluatedParameters.push(evaluated);
        }
      });
    });

    // Update ClinicalResult and Case status
    await prisma.$transaction(async (tx) => {
      await tx.clinicalResult.upsert({
        where: { caseId },
        update: {
          parameterValues: JSON.stringify(evaluatedParameters),
          interpretation: interpretation || null
        },
        create: {
          caseId,
          parameterValues: JSON.stringify(evaluatedParameters),
          interpretation: interpretation || null
        }
      });

      await tx.case.update({
        where: { id: caseId },
        data: {
          reportStatus: 'Results Entered'
        }
      });
    });

    return {
      success: true,
      parameters: evaluatedParameters
    };
  }

  static async authorizeReport(caseId: string, authorizedBy: string, pathologistNotes?: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        clinicalResult: true,
        patient: true,
        doctor: true
      }
    });

    if (!caseRecord) throw new NotFoundError('Case not found');

    const qrVerificationId = `QR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Check for critical panic values
    let hasCriticalPanic = false;
    let panicDetails: string[] = [];
    if (caseRecord.clinicalResult?.parameterValues) {
      try {
        const params = JSON.parse(caseRecord.clinicalResult.parameterValues);
        params.forEach((p: any) => {
          if (p.isPanicCritical || p.flag === 'CRITICAL_LOW' || p.flag === 'CRITICAL_HIGH') {
            hasCriticalPanic = true;
            panicDetails.push(`${p.name} = ${p.value} ${p.unit || ''}`);
          }
        });
      } catch {}
    }

    await prisma.$transaction(async (tx) => {
      await tx.clinicalResult.update({
        where: { caseId },
        data: {
          isAuthorized: true,
          authorizedBy,
          authorizedAt: new Date(),
          pathologistNotes: pathologistNotes || null,
          qrVerificationId
        }
      });

      await tx.case.update({
        where: { id: caseId },
        data: {
          reportStatus: 'Signed Off',
          reportedAt: new Date(),
          signedOffBy: authorizedBy
        }
      });

      // Log critical panic alert in audit log if triggered and dispatch SMS / WhatsApp alerts
      if (hasCriticalPanic) {
        const actorUser = await tx.user.findFirst({ where: { role: 'SUPER_ADMIN' } }) || await tx.user.findFirst();
        if (actorUser) {
          await tx.auditLog.create({
            data: {
              action: 'CRITICAL_PANIC_ALERT',
              entityType: 'Case',
              entityId: caseId,
              actorId: actorUser.id,
              actorName: authorizedBy,
              changes: JSON.stringify({
                alert: `STAT CRITICAL VALUE ALERT for patient ${caseRecord.patient.fullName}: ${panicDetails.join(', ')}`,
                doctorToNotify: caseRecord.doctor.name,
                doctorMobile: caseRecord.doctor.mobile
              })
            }
          });
        }

        const alertMessage = `STAT CRITICAL PANIC ALERT: Patient ${caseRecord.patient.fullName} (UHID: ${caseRecord.uhid}, Bill: ${caseRecord.billNumber}) has critical panic values: ${panicDetails.join(', ')}. Please review immediately. Authorized by: ${authorizedBy}.`;

        if (caseRecord.doctor.mobile) {
          // Record SMS notification dispatch
          await tx.notificationLog.create({
            data: {
              channel: 'SMS',
              recipient: caseRecord.doctor.mobile,
              subject: 'STAT Panic Range Alert',
              content: alertMessage,
              status: 'SENT',
              metadata: JSON.stringify({ caseId, patientId: caseRecord.patientId, doctorId: caseRecord.doctorId, panicDetails })
            }
          });

          // Record WhatsApp notification dispatch
          await tx.notificationLog.create({
            data: {
              channel: 'WHATSAPP',
              recipient: caseRecord.doctor.mobile,
              subject: 'STAT Panic Range Alert',
              content: alertMessage,
              status: 'SENT',
              metadata: JSON.stringify({ caseId, patientId: caseRecord.patientId, doctorId: caseRecord.doctorId, panicDetails })
            }
          });
        }
      }
    });

    return {
      success: true,
      message: `Report successfully authorized and digitally signed off by ${authorizedBy}`,
      authorizedAt: new Date(),
      qrVerificationId,
      hasCriticalPanic,
      panicAlertDispatched: hasCriticalPanic ? `Dispatched STAT alert to Dr. ${caseRecord.doctor.name} (${caseRecord.doctor.mobile})` : null
    };
  }

  static async getNablReport(caseId: string) {
    const [caseRecord, clinic, signature] = await Promise.all([
      prisma.case.findUnique({
        where: { id: caseId },
        include: {
          patient: true,
          doctor: true,
          items: true,
          clinicalResult: true
        }
      }),
      prisma.clinicSetting.findUnique({ where: { id: 'clinic_default' } }),
      prisma.digitalSignature.findFirst({
        where: { modality: 'PATHOLOGY', isDefault: true }
      })
    ]);

    if (!caseRecord) throw new NotFoundError('Case not found');

    let parameters: any[] = [];
    if (caseRecord.clinicalResult?.parameterValues) {
      try {
        parameters = JSON.parse(caseRecord.clinicalResult.parameterValues);
      } catch {
        parameters = [];
      }
    }

    const patientAge = caseRecord.patient.age || caseRecord.patient.ageYears || 30;
    const verifyUrl = caseRecord.clinicalResult?.qrVerificationId
      ? `https://reports.metropolisdiagnostics.com/verify/${caseRecord.clinicalResult.qrVerificationId}`
      : `https://reports.metropolisdiagnostics.com/verify/BL-${caseRecord.billNumber}`;

    let qrCodeDataUrl: string | null = null;
    try {
      qrCodeDataUrl = await QrCodeService.generateQrCodeDataUrl(verifyUrl);
    } catch {
      qrCodeDataUrl = null;
    }

    return {
      clinic,
      case: {
        billNumber: caseRecord.billNumber,
        dailyCode: caseRecord.dailyCode,
        uhid: caseRecord.uhid,
        registeredAt: caseRecord.createdAt,
        reportedAt: caseRecord.reportedAt || new Date(),
        reportStatus: caseRecord.reportStatus,
        modality: caseRecord.modality
      },
      patient: {
        uhid: caseRecord.patient.uhid,
        fullName: `${caseRecord.patient.prefix || 'Mr.'} ${caseRecord.patient.fullName}`,
        age: `${patientAge} ${caseRecord.patient.ageUnit || 'Years'}`,
        gender: caseRecord.patient.gender,
        mobile: caseRecord.patient.mobile
      },
      referringDoctor: caseRecord.doctor.name,
      investigations: caseRecord.items.map(i => ({
        testName: i.testName,
        department: i.department,
        specimen: i.specimen
      })),
      results: parameters,
      interpretation: caseRecord.clinicalResult?.interpretation || null,
      pathologistNotes: caseRecord.clinicalResult?.pathologistNotes || null,
      isAuthorized: caseRecord.clinicalResult?.isAuthorized || false,
      authorizedBy: caseRecord.clinicalResult?.authorizedBy || 'Dr. Ananya Roy, MD (Pathology)',
      authorizedAt: caseRecord.clinicalResult?.authorizedAt,
      qrVerificationId: caseRecord.clinicalResult?.qrVerificationId || null,
      qrVerificationUrl: verifyUrl,
      qrCodeDataUrl,
      signatureStamp: signature || {
        doctorName: 'Dr. Ananya Roy, MD (Pathology)',
        designation: 'Senior Consultant Pathologist & Lab Director',
        registrationNo: 'MCI-REG-48201'
      }
    };
  }

  /**
   * Generates specimen barcode sticker data URI for vacutainer tube labeling
   */
  static async getSpecimenBarcode(caseId: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: { patient: true, items: true }
    });

    if (!caseRecord) throw new NotFoundError('Case not found');

    const barcodeBase64 = await BarcodeService.generateBarcodeBase64(
      caseRecord.billNumber,
      `${caseRecord.uhid} | ${caseRecord.billNumber}`
    );

    return {
      caseId: caseRecord.id,
      billNumber: caseRecord.billNumber,
      dailyCode: caseRecord.dailyCode,
      uhid: caseRecord.uhid,
      patientName: caseRecord.patient.fullName,
      gender: caseRecord.patient.gender,
      age: caseRecord.patient.age || caseRecord.patient.ageYears,
      registeredAt: caseRecord.createdAt,
      barcodeBase64,
      tubes: caseRecord.items.map(item => ({
        testName: item.testName,
        department: item.department,
        specimen: item.specimen
      }))
    };
  }

  static async getInterpretations(query?: { search?: string; department?: string; testCode?: string }) {
    const where: any = {};
    if (query?.testCode) where.testCode = query.testCode;
    if (query?.department) where.department = query.department;
    if (query?.search && query.search.trim()) {
      where.OR = [
        { title: { contains: query.search.trim() } },
        { content: { contains: query.search.trim() } },
        { testCode: { contains: query.search.trim() } }
      ];
    }
    return prisma.clinicalInterpretation.findMany({
      where,
      orderBy: { title: 'asc' }
    });
  }

  static async createInterpretation(data: {
    title: string;
    testCode: string;
    department: string;
    content: string;
  }) {
    if (!data.title || !data.testCode || !data.content) {
      throw new BadRequestError('Title, testCode, and content are required for clinical interpretation template');
    }

    return prisma.clinicalInterpretation.create({
      data: {
        title: data.title,
        testCode: data.testCode,
        department: data.department || 'Biochemistry',
        content: data.content
      }
    });
  }

  static async updateInterpretation(id: string, data: any) {
    const existing = await prisma.clinicalInterpretation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Clinical interpretation template not found');

    return prisma.clinicalInterpretation.update({
      where: { id },
      data
    });
  }

  static async deleteInterpretation(id: string) {
    const existing = await prisma.clinicalInterpretation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Clinical interpretation template not found');

    return prisma.clinicalInterpretation.delete({ where: { id } });
  }

  static async getTestCounts(query?: { startDate?: string; endDate?: string }) {
    const where: any = {};
    if (query?.startDate || query?.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const items = await prisma.caseItem.findMany({
      where,
      select: {
        testCode: true,
        testName: true,
        department: true
      }
    });

    const countsMap = new Map<string, { code: string; name: string; department: string; count: number }>();
    for (const item of items) {
      if (!countsMap.has(item.testCode)) {
        countsMap.set(item.testCode, {
          code: item.testCode,
          name: item.testName,
          department: item.department,
          count: 1
        });
      } else {
        countsMap.get(item.testCode)!.count++;
      }
    }

    return Array.from(countsMap.values()).sort((a, b) => b.count - a.count);
  }

  static async emailReport(caseId: string, customEmail?: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: { patient: true, items: true, clinicalResult: true }
    });

    if (!caseRecord) throw new NotFoundError('Case not found');
    const recipient = customEmail || caseRecord.patient.email;
    if (!recipient) throw new BadRequestError('No recipient email available for patient');

    const reportUrl = `http://localhost:5173/cases/${caseRecord.id}/report`;
    const testsSummary = caseRecord.items.map(i => i.testName).join(', ');

    await EmailService.sendReportEmail({
      toEmail: recipient,
      patientName: caseRecord.patient.fullName,
      billNumber: caseRecord.billNumber,
      reportUrl,
      testsSummary
    });

    return {
      success: true,
      message: `Diagnostic report for ${caseRecord.patient.fullName} emailed to ${recipient}`,
      recipient
    };
  }
}

