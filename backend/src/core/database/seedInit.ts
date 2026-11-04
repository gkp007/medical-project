import bcrypt from 'bcryptjs';
import { prisma } from './prisma.client.js';
import { logger } from '../logger/logger.js';

export const seedAdminAndMastersIfNeeded = async () => {
  try {
    const userCount = await prisma.user.count();
    const investigationCount = await prisma.investigation.count();

    // 1. Clinic Settings
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

    // 2. Core Users (admin, pathologist, radiologist, receptionist)
    if (userCount === 0) {
      logger.info('No staff users found. Seeding core users with password LabSmart@2026...');
      const defaultPasswordHash = await bcrypt.hash('LabSmart@2026', 10);

      const users = [
        {
          username: 'admin',
          fullName: 'Gopalkrishna Pattanaik',
          email: 'admin@aasthapolyclinic.com',
          mobile: '9810011223',
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
        },
        {
          username: 'pathologist',
          fullName: 'Dr. Ananya Roy, MD (Pathology)',
          email: 'ananya.roy@aasthapolyclinic.com',
          mobile: '9810022334',
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
        },
        {
          username: 'radiologist',
          fullName: 'Dr. S. K. Verma, MD (Radiodiagnosis)',
          email: 'sk.verma@aasthapolyclinic.com',
          mobile: '9810033445',
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
        },
        {
          username: 'receptionist',
          fullName: 'Reception Desk',
          email: 'reception@aasthapolyclinic.com',
          mobile: '9810044556',
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
      ];

      for (const u of users) {
        await prisma.user.upsert({
          where: { username: u.username },
          update: {},
          create: { ...u, passwordHash: defaultPasswordHash }
        });
      }
    }

    // 3. Referring Doctors
    const doctorsData = [
      {
        id: 'doc-self',
        name: 'Self Referral / Walk-in Patient',
        degree: '',
        specialty: 'General Walk-in',
        mobile: '0000000000',
        commissionPct: 0.0,
        pathologyCommission: 0.0,
        usgCommission: 0.0,
        xrayCommission: 0.0,
        ctCommission: 0.0,
        outsourceCommission: 0.0,
        isActive: true,
        hasPortalAccess: false
      },
      {
        id: 'doc-sharma',
        name: 'Dr. Rajesh Sharma',
        degree: 'MBBS, MD (Medicine)',
        specialty: 'Internal Medicine',
        mobile: '9811223344',
        email: 'dr.sharma@healthclinic.org',
        commissionPct: 15.0,
        pathologyCommission: 20.0,
        usgCommission: 25.0,
        xrayCommission: 30.0,
        ctCommission: 15.0,
        outsourceCommission: 10.0,
        isActive: true,
        hasPortalAccess: true
      },
      {
        id: 'doc-gupta',
        name: 'Dr. Priya Gupta',
        degree: 'MBBS, MS (Obs & Gyn)',
        specialty: 'Obstetrics & Gynecology',
        mobile: '9822334455',
        email: 'dr.priya@guptahospital.com',
        commissionPct: 20.0,
        pathologyCommission: 20.0,
        usgCommission: 30.0,
        xrayCommission: 20.0,
        ctCommission: 15.0,
        outsourceCommission: 10.0,
        isActive: true,
        hasPortalAccess: true
      }
    ];

    for (const d of doctorsData) {
      await prisma.doctor.upsert({
        where: { id: d.id },
        update: {},
        create: d
      });
    }

    // 4. Diagnostic Investigations (CBC, LFT, USG, X-Ray) if empty
    if (investigationCount === 0) {
      logger.info('No investigations found. Seeding standard test catalog...');

      // Categories
      const categories = [
        { name: 'Haematology', code: 'HAEM', department: 'Hematology', description: 'Complete Blood Counts, ESR' },
        { name: 'Biochemistry', code: 'BIOCHEM', department: 'Biochemistry', description: 'Liver, Renal, Lipid Profiles' },
        { name: 'Radiology & Imaging', code: 'RADIO', department: 'Radiology', description: 'Digital X-Ray & Ultrasound' }
      ];

      for (const c of categories) {
        await prisma.testCategory.upsert({
          where: { name: c.name },
          update: {},
          create: { ...c, testCount: 5 }
        });
      }

      // CBC
      const cbc = await prisma.investigation.upsert({
        where: { code: 'CBC' },
        update: {},
        create: {
          code: 'CBC',
          name: 'Complete Blood Count (CBC)',
          department: 'Hematology',
          testType: 'Multi parameter',
          specimen: 'EDTA Whole Blood',
          container: 'Lavender Top (K2-EDTA)',
          rate: 400.0,
          b2bRate: 200.0,
          tatHours: 2
        }
      });

      const cbcParams = [
        { code: 'HB', name: 'Hemoglobin', unit: 'g/dL', lower: 13.0, upper: 17.0, sortOrder: 1 },
        { code: 'RBC', name: 'Total RBC Count', unit: 'million/cumm', lower: 4.5, upper: 5.5, sortOrder: 2 },
        { code: 'PCV', name: 'Packed Cell Volume', unit: '%', lower: 40.0, upper: 50.0, sortOrder: 3 },
        { code: 'MCV', name: 'Mean Corpuscular Volume', unit: 'fL', lower: 83.0, upper: 101.0, sortOrder: 4 },
        { code: 'MCH', name: 'Mean Corpuscular Hemoglobin', unit: 'pg', lower: 27.0, upper: 32.0, sortOrder: 5 },
        { code: 'WBC', name: 'Total Leukocyte Count (TLC)', unit: 'cumm', lower: 4000.0, upper: 11000.0, sortOrder: 6 },
        { code: 'PLATELETS', name: 'Platelet Count', unit: 'lakhs/cumm', lower: 1.5, upper: 4.1, sortOrder: 7 }
      ];

      for (const p of cbcParams) {
        await prisma.testParameter.create({
          data: {
            investigationId: cbc.id,
            code: p.code,
            name: p.name,
            unit: p.unit,
            sortOrder: p.sortOrder,
            ranges: {
              create: {
                gender: 'All',
                minAge: 0,
                maxAge: 120,
                lowerBound: p.lower,
                upperBound: p.upper
              }
            }
          }
        });
      }

      // LFT
      await prisma.investigation.upsert({
        where: { code: 'LFT' },
        update: {},
        create: {
          code: 'LFT',
          name: 'Liver Function Test (LFT)',
          department: 'Biochemistry',
          testType: 'Multi parameter',
          specimen: 'Serum',
          container: 'Yellow Top',
          rate: 800.0,
          b2bRate: 400.0,
          tatHours: 4
        }
      });

      // USG
      await prisma.investigation.upsert({
        where: { code: 'USG-ABD' },
        update: {},
        create: {
          code: 'USG-ABD',
          name: 'USG Whole Abdomen & Pelvis',
          department: 'Radiology',
          testType: 'Document',
          specimen: 'Sonography Scan',
          container: 'High Resolution Convex Probe',
          rate: 1200.0,
          b2bRate: 700.0,
          tatHours: 1
        }
      });

      // X-Ray
      await prisma.investigation.upsert({
        where: { code: 'XRAY-CHEST' },
        update: {},
        create: {
          code: 'XRAY-CHEST',
          name: 'Digital X-Ray Chest PA View',
          department: 'Radiology',
          testType: 'Document',
          specimen: 'Digital Radiograph',
          container: 'DR Detector Plate',
          rate: 500.0,
          b2bRate: 250.0,
          tatHours: 1
        }
      });

      // 5. Initial Sample Patient & Transactions so Recent Transactions has live records
      const samplePatient = await prisma.patient.upsert({
        where: { uhid: 'UHID-2026-0001' },
        update: {},
        create: {
          uhid: 'UHID-2026-0001',
          prefix: 'Mr.',
          firstName: 'Rahul',
          lastName: 'Sharma',
          fullName: 'Rahul Sharma',
          gender: 'Male',
          ageYears: 34,
          ageUnit: 'Years',
          mobile: '9876543210',
          email: 'rahul.sharma@example.com',
          address: '42 Marine Drive, Mumbai',
          totalVisits: 1
        }
      });

      const sampleCase = await prisma.case.upsert({
        where: { billNumber: 'BL-2026-1001' },
        update: {},
        create: {
          billNumber: 'BL-2026-1001',
          dailyCode: 'L1',
          uhid: samplePatient.uhid,
          patientId: samplePatient.id,
          doctorId: 'doc-sharma',
          modality: 'LAB',
          reportStatus: 'Registered',
          grossAmount: 400.0,
          discountAmount: 0.0,
          netPayable: 400.0,
          paidAmount: 400.0,
          balanceDue: 0.0,
          paymentStatus: 'Paid'
        }
      });

      // Create Initial Transaction
      await prisma.paymentTransaction.upsert({
        where: { receiptNumber: 'REC-2026-0001' },
        update: {},
        create: {
          receiptNumber: 'REC-2026-0001',
          caseId: sampleCase.id,
          amount: 400.0,
          mode: 'Cash',
          receivedBy: 'Receptionist',
          createdAt: new Date()
        }
      });

      logger.info('Database diagnostic master catalog and sample transactions initialized successfully.');
    }
  } catch (err: any) {
    logger.error({ error: err.message }, 'Failed during seedAdminAndMastersIfNeeded execution');
  }
};
