import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export class DoctorService {
  static async listDoctors(query: { search?: string; activeOnly?: boolean }) {
    const where: any = {};
    if (query.activeOnly !== false) {
      where.isActive = true;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { mobile: { contains: query.search } },
        { specialty: { contains: query.search } }
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        cases: {
          select: {
            id: true,
            grossAmount: true,
            netPayable: true,
            paidAmount: true,
            createdAt: true
          }
        },
        payouts: {
          select: {
            paidAmount: true
          }
        }
      }
    });

    return doctors.map(doc => {
      const totalCases = doc.cases.length;
      const totalBusiness = doc.cases.reduce((sum, c) => sum + c.netPayable, 0);
      const totalCommissionEarned = (totalBusiness * doc.commissionPct) / 100;
      const totalCommissionPaid = doc.payouts.reduce((sum, p) => sum + p.paidAmount, 0);
      const commissionDue = Math.max(0, totalCommissionEarned - totalCommissionPaid);

      return {
        id: doc.id,
        name: doc.name,
        degree: doc.degree,
        specialty: doc.specialty,
        mobile: doc.mobile,
        email: doc.email,
        commissionPct: doc.commissionPct,
        isActive: doc.isActive,
        hasPortalAccess: doc.hasPortalAccess,
        totalCases,
        totalBusiness,
        totalCommissionEarned,
        totalCommissionPaid,
        commissionDue
      };
    });
  }

  static async createDoctor(data: any) {
    return prisma.doctor.create({
      data: {
        name: data.name,
        degree: data.degree || null,
        specialty: data.specialty,
        mobile: data.mobile,
        email: data.email || null,
        commissionPct: data.commissionPct || 0.0,
        isActive: true
      }
    });
  }

  static async updateDoctor(id: string, data: any) {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundError('Doctor not found');

    return prisma.doctor.update({
      where: { id },
      data
    });
  }

  static async toggleDoctorStatus(id: string) {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundError('Doctor not found');

    return prisma.doctor.update({
      where: { id },
      data: { isActive: !doctor.isActive }
    });
  }

  static async togglePortalAccess(id: string) {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundError('Doctor not found');

    return prisma.doctor.update({
      where: { id },
      data: { hasPortalAccess: !doctor.hasPortalAccess }
    });
  }

  static async recordPayout(data: any) {
    const count = await prisma.doctorPayout.count();
    const payoutNumber = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.doctorPayout.create({
      data: {
        payoutNumber,
        doctorId: data.doctorId,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        totalCommission: data.totalCommission,
        paidAmount: data.paidAmount,
        paymentMode: data.paymentMode,
        transactionRef: data.transactionRef || null
      }
    });
  }
}
