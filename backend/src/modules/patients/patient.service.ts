import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export class PatientService {
  /**
   * Generates next sequence UHID: e.g. UHID-2026-0002
   */
  static async generateUHID(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.patient.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `UHID-${year}-${sequence}`;
  }

  static async listPatients(query: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { isArchived: false };

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { fullName: { contains: term } },
        { mobile: { contains: term } },
        { uhid: { contains: term } }
      ];
    }

    const [total, patients] = await Promise.all([
      prisma.patient.count({ where }),
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastVisitDate: 'desc' },
        include: {
          cases: {
            select: {
              id: true,
              billNumber: true,
              grossAmount: true,
              paidAmount: true,
              balanceDue: true,
              reportStatus: true,
              createdAt: true
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      patients
    };
  }

  static async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        cases: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
            payments: true,
            doctor: { select: { id: true, name: true, specialty: true } }
          }
        }
      }
    });

    if (!patient) throw new NotFoundError('Patient profile not found');
    return patient;
  }

  static async createPatient(data: any) {
    // Check if patient with same mobile and exact name already exists
    const existing = await prisma.patient.findFirst({
      where: {
        mobile: data.mobile,
        fullName: { equals: data.fullName }
      }
    });

    if (existing) {
      return existing;
    }

    const uhid = await this.generateUHID();

    return prisma.patient.create({
      data: {
        uhid,
        prefix: data.prefix,
        fullName: data.fullName,
        age: data.age,
        ageUnit: data.ageUnit || 'Years',
        gender: data.gender,
        mobile: data.mobile,
        email: data.email || null,
        address: data.address || null,
        bloodGroup: data.bloodGroup || null,
        totalVisits: 1,
        lastVisitDate: new Date()
      }
    });
  }

  static async updatePatient(id: string, data: any) {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundError('Patient not found');

    return prisma.patient.update({
      where: { id },
      data
    });
  }

  static async archivePatient(id: string) {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundError('Patient not found');

    return prisma.patient.update({
      where: { id },
      data: { isArchived: true }
    });
  }

  static async getMedicalHistory(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        cases: {
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: true,
            items: true,
            clinicalResult: true,
            radiologyStudy: true,
            payments: true
          }
        }
      }
    });

    if (!patient) throw new NotFoundError('Patient not found');

    const totalSpent = patient.cases.reduce((sum, c) => sum + c.paidAmount, 0);
    const totalDue = patient.cases.reduce((sum, c) => sum + c.balanceDue, 0);

    return {
      patient: {
        id: patient.id,
        uhid: patient.uhid,
        fullName: `${patient.prefix} ${patient.fullName}`,
        age: `${patient.age} ${patient.ageUnit}`,
        gender: patient.gender,
        mobile: patient.mobile,
        bloodGroup: patient.bloodGroup || 'Not Recorded',
        totalVisits: patient.cases.length,
        totalSpent,
        totalDue
      },
      visits: patient.cases.map(c => ({
        billNumber: c.billNumber,
        date: c.createdAt,
        modality: c.modality,
        doctor: c.doctor.name,
        investigations: c.items.map(i => i.testName),
        gross: c.grossAmount,
        paid: c.paidAmount,
        balanceDue: c.balanceDue,
        reportStatus: c.reportStatus,
        paymentStatus: c.paymentStatus
      }))
    };
  }
}
