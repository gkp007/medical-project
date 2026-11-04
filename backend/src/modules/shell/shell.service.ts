import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError } from '../../core/errors/AppError.js';
import { EmailService } from '../../shared/email/email.service.js';

export class ShellService {
  /**
   * Retrieves active shell context: user, branch, credits, alerts
   */
  static async getContext(userId: string, requestedBranchId?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        mobile: true,
        role: true,
        isOwner: true,
        canBilling: true,
        canResultsEntry: true,
        canAuthorize: true,
        canDoctorPayouts: true,
        canAuditMaster: true,
        canEditRates: true,
        canDeleteBills: true,
        canSignOffReports: true,
        canViewLedger: true,
        canManageExpenses: true,
        canIssueRefunds: true,
        allowedBranches: true
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const clinic = await prisma.clinicSetting.findUnique({
      where: { id: 'clinic_default' }
    });

    const activeBranchId = requestedBranchId || 'main';

    const availableBranches = [
      { id: 'main', name: 'Main Laboratory Branch' },
      { id: 'ag102', name: 'City Care Collection Center (AG-102)' },
      { id: 'ag105', name: 'Sector 56 Phlebotomy Point (AG-105)' }
    ];

    // Unread alerts count (cases with pending panic results or urgent STAT cases)
    const unreadAlertsCount = await prisma.case.count({
      where: {
        isUrgent: true,
        reportStatus: { not: 'Signed Off' }
      }
    });

    return {
      user,
      clinic: {
        id: clinic?.id || 'clinic_default',
        name: clinic?.clinicName || 'Apex Diagnostic Centre',
        tagline: clinic?.tagline || 'NABL Accredited Laboratory',
        activeBranch: availableBranches.find((b) => b.id === activeBranchId) || availableBranches[0],
        availableBranches
      },
      credits: {
        smsBalance: 240,
        whatsappBalance: 180
      },
      unreadAlertsCount
    };
  }

  /**
   * Omnisearch across Patients, Cases, Investigations and Doctors
   */
  static async omnisearch(query: string, limit = 10) {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { patients: [], cases: [], tests: [], doctors: [] };
    }

    const [patients, cases, tests, doctors] = await Promise.all([
      prisma.patient.findMany({
        where: {
          OR: [
            { fullName: { contains: cleanQuery } },
            { mobile: { contains: cleanQuery } },
            { uhid: { contains: cleanQuery } }
          ]
        },
        take: limit,
        select: {
          id: true,
          uhid: true,
          fullName: true,
          gender: true,
          ageYears: true,
          ageUnit: true,
          mobile: true
        }
      }),
      prisma.case.findMany({
        where: {
          OR: [
            { billNumber: { contains: cleanQuery } },
            { dailyCode: { contains: cleanQuery } },
            { patient: { fullName: { contains: cleanQuery } } }
          ]
        },
        take: limit,
        select: {
          id: true,
          billNumber: true,
          dailyCode: true,
          uhid: true,
          modality: true,
          reportStatus: true,
          paymentStatus: true,
          grossAmount: true,
          netPayable: true,
          balanceDue: true,
          patient: {
            select: { fullName: true, mobile: true }
          },
          createdAt: true
        }
      }),
      prisma.investigation.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery } },
            { code: { contains: cleanQuery } },
            { department: { contains: cleanQuery } }
          ],
          isDeleted: false
        },
        take: limit,
        select: {
          id: true,
          code: true,
          name: true,
          department: true,
          rate: true,
          specimen: true
        }
      }),
      prisma.doctor.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery } },
            { specialty: { contains: cleanQuery } }
          ],
          isActive: true
        },
        take: limit,
        select: {
          id: true,
          name: true,
          degree: true,
          specialty: true,
          mobile: true
        }
      })
    ]);

    return { patients, cases, tests, doctors };
  }

  /**
   * Logs a technical support ticket
   */
  static async createSupportTicket(actorId: string, ticketData: {
    category: string;
    subject: string;
    severity?: string;
    description: string;
    callbackPhone?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: actorId } });
    const count = await prisma.supportTicket.count();
    const ticketId = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const created = await prisma.supportTicket.create({
      data: {
        ticketNo: ticketId,
        category: ticketData.category,
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.severity?.toUpperCase() || 'NORMAL',
        userId: user?.id,
        userEmail: user?.email
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'SUPPORT_TICKET_RAISED',
        entityType: 'SystemSupport',
        entityId: ticketId,
        actorId,
        actorName: user?.fullName || 'Staff User',
        changes: JSON.stringify(ticketData)
      }
    });

    // Send email alert to user and support desk
    await EmailService.sendSupportTicketAlert({
      ticketNo: ticketId,
      category: ticketData.category,
      subject: ticketData.subject,
      description: ticketData.description,
      userEmail: user?.email
    });

    return {
      ticketId,
      status: created.status,
      category: created.category,
      createdAt: created.createdAt.toISOString()
    };
  }


  /**
   * Recharge SMS & WhatsApp credits
   */
  static async rechargeCredits(actorId: string, packDetails: {
    packageType: string;
    credits: number;
    amountPaid: number;
    paymentRef?: string;
  }) {
    await prisma.auditLog.create({
      data: {
        action: 'SMS_CREDITS_RECHARGED',
        entityType: 'BillingCredits',
        entityId: packDetails.packageType,
        actorId,
        actorName: 'Admin',
        changes: JSON.stringify(packDetails)
      }
    });

    return {
      success: true,
      newBalance: 240 + packDetails.credits,
      creditsAdded: packDetails.credits,
      transactionTime: new Date().toISOString()
    };
  }
}
