import bcrypt from 'bcryptjs';
import { prisma } from './prisma.client.js';
import { logger } from '../logger/logger.js';

export const seedAdminAndMastersIfNeeded = async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      logger.info('No staff users found in database. Initializing default admin & diagnostic masters...');

      // 1. Create Default Clinic Settings
      await prisma.clinicSetting.upsert({
        where: { id: 'clinic_default' },
        update: {},
        create: {
          id: 'clinic_default',
          clinicName: 'Aastha Polyclinic & Diagnostic Centre',
          tagline: 'NABL & ISO 15189 Accredited Automated Clinical Laboratory',
          phone: '+91 98765 43210',
          email: 'contact@aasthapolyclinic.com',
          address: 'Main Road, Health Care Complex',
          registrationNo: 'DL-GGM-LAB-98102',
          nablAccreditationNo: 'MC-4921-ISO15189',
          gstin: '07AAAAA0000A1Z5',
          headerMarginMm: 35,
          footerMarginMm: 25,
          leftMarginMm: 15,
          rightMarginMm: 15,
          watermarkEnabled: true,
          qrCodeEnabled: true,
          smsSenderId: 'AASTHA',
          dltPrincipalId: '1101489102830',
          monthlyTarget: 500000.0
        }
      });

      // 2. Default Password Hash: LabSmart@2026
      const defaultPasswordHash = await bcrypt.hash('LabSmart@2026', 10);

      // Create Super Admin (admin / LabSmart@2026)
      await prisma.user.create({
        data: {
          username: 'admin',
          fullName: 'Dr. Sameer Verma, MD',
          email: 'admin@aasthapolyclinic.com',
          mobile: '9810011223',
          passwordHash: defaultPasswordHash,
          role: 'SUPER_ADMIN',
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
          canIssueRefunds: true
        }
      });

      // Create Pathologist
      await prisma.user.create({
        data: {
          username: 'pathologist',
          fullName: 'Dr. Ananya Roy, MD (Pathology)',
          email: 'ananya.roy@aasthapolyclinic.com',
          mobile: '9810022334',
          passwordHash: defaultPasswordHash,
          role: 'PATHOLOGIST',
          isOwner: false,
          canBilling: false,
          canResultsEntry: true,
          canAuthorize: true,
          canDoctorPayouts: false,
          canAuditMaster: false,
          canEditRates: false,
          canDeleteBills: false,
          canSignOffReports: true,
          canViewLedger: false,
          canManageExpenses: false,
          canIssueRefunds: false
        }
      });

      // Create Radiologist
      await prisma.user.create({
        data: {
          username: 'radiologist',
          fullName: 'Dr. S. K. Verma, MD (Radiodiagnosis)',
          email: 'sk.verma@aasthapolyclinic.com',
          mobile: '9810033445',
          passwordHash: defaultPasswordHash,
          role: 'RADIOLOGIST',
          isOwner: false,
          canBilling: false,
          canResultsEntry: true,
          canAuthorize: true,
          canDoctorPayouts: false,
          canAuditMaster: false,
          canEditRates: false,
          canDeleteBills: false,
          canSignOffReports: true,
          canViewLedger: false,
          canManageExpenses: false,
          canIssueRefunds: false
        }
      });

      // Create Receptionist
      await prisma.user.create({
        data: {
          username: 'receptionist',
          fullName: 'Gopalkrishna Pattanaik',
          email: 'reception@aasthapolyclinic.com',
          mobile: '9810044556',
          passwordHash: defaultPasswordHash,
          role: 'RECEPTIONIST',
          isOwner: false,
          canBilling: true,
          canResultsEntry: false,
          canAuthorize: false,
          canDoctorPayouts: false,
          canAuditMaster: false,
          canEditRates: false,
          canDeleteBills: false,
          canSignOffReports: false,
          canViewLedger: true,
          canManageExpenses: false,
          canIssueRefunds: false
        }
      });

      // 3. Create Default Referring Doctors
      await prisma.doctor.upsert({
        where: { id: 'doc-self' },
        update: {},
        create: {
          id: 'doc-self',
          name: 'Self Referral / Walk-in Patient',
          degree: 'General Walk-in',
          specialty: 'General Consultation',
          mobile: '9999999999',
          commissionPct: 0.0,
          defaultCommissionPct: 0.0
        }
      });

      await prisma.doctor.upsert({
        where: { id: 'doc-sharma' },
        update: {},
        create: {
          id: 'doc-sharma',
          name: 'Dr. Rajesh Sharma',
          degree: 'MBBS, MD (Medicine)',
          specialty: 'Internal Medicine',
          mobile: '9810055667',
          commissionPct: 15.0,
          defaultCommissionPct: 15.0
        }
      });

      logger.info('Default staff users & doctors seeded successfully.');
    }
  } catch (err: any) {
    logger.error({ error: err.message }, 'Failed during default user seed check');
  }
};
