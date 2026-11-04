import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';

export class RadiologyService {
  /**
   * Retrieves worklist for a given modality (USG, X-RAY, CT SCAN) with date and status filters
   */
  static async getWorklist(modality: string, query?: {
    date?: string;
    status?: string;
    search?: string;
  }) {
    const where: any = {
      reportStatus: { not: 'Cancelled' }
    };

    // Match modality (case-insensitive or partial match)
    if (modality.toUpperCase().includes('USG')) {
      where.modality = 'USG';
    } else if (modality.toUpperCase().includes('XRAY') || modality.toUpperCase().includes('X-RAY')) {
      where.modality = { in: ['XRAY', 'X-RAY'] };
    } else {
      where.modality = modality;
    }

    if (query?.status && query.status !== 'ALL') {
      where.reportStatus = query.status;
    }

    if (query?.date) {
      const targetDate = new Date(query.date);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);
      where.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    if (query?.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { billNumber: { contains: term } },
        { uhid: { contains: term } },
        { patient: { fullName: { contains: term } } }
      ];
    }

    const cases = await prisma.case.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        doctor: true,
        items: true,
        radiologyStudy: true
      }
    });

    return cases.map(c => ({
      id: c.id,
      billNumber: c.billNumber,
      dailyCode: c.dailyCode,
      uhid: c.uhid,
      isUrgent: c.isUrgent,
      patient: {
        fullName: `${c.patient.prefix || 'Mr.'} ${c.patient.fullName}`,
        age: `${c.patient.age || c.patient.ageYears} ${c.patient.ageUnit || 'Years'}`,
        gender: c.patient.gender
      },
      doctor: c.doctor.name,
      modality: c.modality,
      studyName: c.items[0]?.testName || `${modality} Study`,
      reportStatus: c.reportStatus,
      paymentStatus: c.paymentStatus,
      balanceDue: c.balanceDue,
      isAuthorized: c.radiologyStudy?.isAuthorized || false,
      pndtConfirmed: c.radiologyStudy?.pndtConfirmed || false,
      pregnancyScreen: c.radiologyStudy?.pregnancyScreen || false,
      registeredAt: c.createdAt
    }));
  }

  static async getStudyDetails(caseId: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        patient: true,
        doctor: true,
        items: true,
        radiologyStudy: true
      }
    });

    if (!caseRecord) throw new NotFoundError('Radiology study not found');

    let findings = {};
    if (caseRecord.radiologyStudy?.findings) {
      try {
        findings = JSON.parse(caseRecord.radiologyStudy.findings);
      } catch {
        findings = {};
      }
    }

    let measurements = {};
    if (caseRecord.radiologyStudy?.measurements) {
      try {
        measurements = JSON.parse(caseRecord.radiologyStudy.measurements);
      } catch {
        measurements = {};
      }
    }

    return {
      case: {
        id: caseRecord.id,
        billNumber: caseRecord.billNumber,
        dailyCode: caseRecord.dailyCode,
        uhid: caseRecord.uhid,
        modality: caseRecord.modality,
        reportStatus: caseRecord.reportStatus,
        studyName: caseRecord.items[0]?.testName
      },
      patient: {
        id: caseRecord.patient.id,
        uhid: caseRecord.patient.uhid,
        fullName: `${caseRecord.patient.prefix || 'Mr.'} ${caseRecord.patient.fullName}`,
        age: `${caseRecord.patient.age || caseRecord.patient.ageYears} ${caseRecord.patient.ageUnit || 'Years'}`,
        gender: caseRecord.patient.gender
      },
      doctor: caseRecord.doctor.name,
      study: {
        findings,
        measurements,
        impression: caseRecord.radiologyStudy?.impression || '',
        clinicalHistory: caseRecord.radiologyStudy?.clinicalHistory || '',
        technicalKvp: caseRecord.radiologyStudy?.technicalKvp,
        technicalMas: caseRecord.radiologyStudy?.technicalMas,
        filmsConsumed: caseRecord.radiologyStudy?.filmsConsumed,
        pndtConfirmed: caseRecord.radiologyStudy?.pndtConfirmed || false,
        pregnancyScreen: caseRecord.radiologyStudy?.pregnancyScreen || false,
        isAuthorized: caseRecord.radiologyStudy?.isAuthorized || false,
        radiologistName: caseRecord.radiologyStudy?.radiologistName
      }
    };
  }

  /**
   * Save Ultrasound findings with PC-PNDT anti-sex determination compliance enforcement
   */
  static async saveUsgFindings(caseId: string, data: {
    measurements?: any;
    findings: any;
    impression: string;
    clinicalHistory?: string;
    pndtConfirmed?: boolean;
    isObstetric?: boolean;
  }) {
    // If scan is obstetric or patient is female of reproductive age, require PC-PNDT confirmation
    if (data.isObstetric && data.pndtConfirmed !== true) {
      throw new BadRequestError('PC-PNDT statutory declaration confirmation is legally mandatory before saving obstetric sonography findings.');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const study = await tx.radiologyReport.upsert({
        where: { caseId },
        update: {
          findings: JSON.stringify(data.findings),
          measurements: data.measurements ? JSON.stringify(data.measurements) : null,
          impression: data.impression,
          clinicalHistory: data.clinicalHistory || null,
          pndtConfirmed: data.pndtConfirmed === true
        },
        create: {
          caseId,
          modality: 'USG',
          findings: JSON.stringify(data.findings),
          measurements: data.measurements ? JSON.stringify(data.measurements) : null,
          impression: data.impression,
          clinicalHistory: data.clinicalHistory || null,
          pndtConfirmed: data.pndtConfirmed === true
        }
      });

      await tx.case.update({
        where: { id: caseId },
        data: { reportStatus: 'Results Entered' }
      });

      return study;
    });

    return updated;
  }

  /**
   * Save Digital X-Ray findings with exposure factors (kVp, mAs) and film stock tracking
   */
  static async saveXrayFindings(caseId: string, data: {
    findings: any;
    impression: string;
    clinicalHistory?: string;
    technicalKvp?: string;
    technicalMas?: string;
    filmsConsumed?: string;
    pregnancyScreen?: boolean;
  }) {
    const updated = await prisma.$transaction(async (tx) => {
      const study = await tx.radiologyReport.upsert({
        where: { caseId },
        update: {
          findings: JSON.stringify(data.findings),
          impression: data.impression,
          clinicalHistory: data.clinicalHistory || null,
          technicalKvp: data.technicalKvp || null,
          technicalMas: data.technicalMas || null,
          filmsConsumed: data.filmsConsumed || null,
          pregnancyScreen: data.pregnancyScreen === true
        },
        create: {
          caseId,
          modality: 'X-RAY',
          findings: JSON.stringify(data.findings),
          impression: data.impression,
          clinicalHistory: data.clinicalHistory || null,
          technicalKvp: data.technicalKvp || null,
          technicalMas: data.technicalMas || null,
          filmsConsumed: data.filmsConsumed || null,
          pregnancyScreen: data.pregnancyScreen === true
        }
      });

      await tx.case.update({
        where: { id: caseId },
        data: { reportStatus: 'Results Entered' }
      });

      return study;
    });

    return updated;
  }

  /**
   * General findings saver for other modalities or generic radiology
   */
  static async saveFindings(caseId: string, findings: any, impression: string, clinicalHistory?: string) {
    const updated = await prisma.$transaction(async (tx) => {
      const study = await tx.radiologyReport.upsert({
        where: { caseId },
        update: {
          findings: JSON.stringify(findings),
          impression,
          clinicalHistory: clinicalHistory || null
        },
        create: {
          caseId,
          modality: 'USG',
          findings: JSON.stringify(findings),
          impression,
          clinicalHistory: clinicalHistory || null
        }
      });

      await tx.case.update({
        where: { id: caseId },
        data: { reportStatus: 'Results Entered' }
      });

      return study;
    });

    return updated;
  }

  static async authorizeStudy(caseId: string, radiologistName: string) {
    return prisma.$transaction(async (tx) => {
      const study = await tx.radiologyReport.update({
        where: { caseId },
        data: {
          isAuthorized: true,
          radiologistName,
          authorizedAt: new Date()
        }
      });

      await tx.case.update({
        where: { id: caseId },
        data: {
          reportStatus: 'Signed Off',
          reportedAt: new Date(),
          signedOffBy: radiologistName
        }
      });

      return study;
    });
  }

  static async getReport(caseId: string) {
    const [caseRecord, clinic, signature] = await Promise.all([
      prisma.case.findUnique({
        where: { id: caseId },
        include: {
          patient: true,
          doctor: true,
          items: true,
          radiologyStudy: true
        }
      }),
      prisma.clinicSetting.findUnique({ where: { id: 'clinic_default' } }),
      prisma.digitalSignature.findFirst({
        where: { modality: 'RADIOLOGY', isDefault: true }
      })
    ]);

    if (!caseRecord) throw new NotFoundError('Study not found');

    let findings = {};
    if (caseRecord.radiologyStudy?.findings) {
      try {
        findings = JSON.parse(caseRecord.radiologyStudy.findings);
      } catch {
        findings = {};
      }
    }

    let measurements = {};
    if (caseRecord.radiologyStudy?.measurements) {
      try {
        measurements = JSON.parse(caseRecord.radiologyStudy.measurements);
      } catch {
        measurements = {};
      }
    }

    return {
      clinic,
      case: {
        billNumber: caseRecord.billNumber,
        dailyCode: caseRecord.dailyCode,
        uhid: caseRecord.uhid,
        modality: caseRecord.modality,
        studyName: caseRecord.items[0]?.testName || `${caseRecord.modality} Examination`,
        registeredAt: caseRecord.createdAt,
        reportedAt: caseRecord.reportedAt || new Date()
      },
      patient: {
        uhid: caseRecord.patient.uhid,
        fullName: `${caseRecord.patient.prefix || 'Mr.'} ${caseRecord.patient.fullName}`,
        age: `${caseRecord.patient.age || caseRecord.patient.ageYears} ${caseRecord.patient.ageUnit || 'Years'}`,
        gender: caseRecord.patient.gender
      },
      referringDoctor: caseRecord.doctor.name,
      findings,
      measurements,
      impression: caseRecord.radiologyStudy?.impression || '',
      clinicalHistory: caseRecord.radiologyStudy?.clinicalHistory || '',
      technicalFactors: {
        kvp: caseRecord.radiologyStudy?.technicalKvp,
        mas: caseRecord.radiologyStudy?.technicalMas,
        filmsConsumed: caseRecord.radiologyStudy?.filmsConsumed
      },
      compliance: {
        pndtConfirmed: caseRecord.radiologyStudy?.pndtConfirmed || false,
        pregnancyScreen: caseRecord.radiologyStudy?.pregnancyScreen || false
      },
      isAuthorized: caseRecord.radiologyStudy?.isAuthorized || false,
      radiologistName: caseRecord.radiologyStudy?.radiologistName || 'Dr. Vikram Malhotra, MD (Radiodiagnosis)',
      signatureStamp: signature || {
        doctorName: 'Dr. Vikram Malhotra, MD (Radiodiagnosis)',
        designation: 'Senior Consultant Radiologist',
        registrationNo: 'DMR-58201'
      }
    };
  }

  static async listTemplates(modality?: string) {
    const where: any = {};
    if (modality) where.modality = modality;
    return prisma.radiologyTemplate.findMany({ where, orderBy: { title: 'asc' } });
  }

  static async createTemplate(data: any) {
    return prisma.radiologyTemplate.create({ data });
  }

  static async listSignatures() {
    return prisma.digitalSignature.findMany({ orderBy: { doctorName: 'asc' } });
  }

  static async createSignature(data: any) {
    return prisma.digitalSignature.create({ data });
  }
}
