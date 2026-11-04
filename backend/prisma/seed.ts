import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Comprehensive Diagnostic LIS Database Seeding...');

  // 1. Create Default Clinic Settings
  await prisma.clinicSetting.upsert({
    where: { id: 'clinic_default' },
    update: {},
    create: {
      id: 'clinic_default',
      clinicName: 'Apex Diagnostic Centre & Imaging Network',
      tagline: 'NABL & ISO 15189 Accredited Automated Clinical Laboratory',
      phone: '+91 98765 43210',
      email: 'reports@apexdiagnostics.com',
      address: '42, Medical Enclave, Health City, New Delhi - 110029',
      registrationNo: 'DL-GGM-LAB-98102',
      nablAccreditationNo: 'MC-4921-ISO15189',
      gstin: '07AAAAA0000A1Z5',
      headerMarginMm: 35,
      footerMarginMm: 25,
      leftMarginMm: 15,
      rightMarginMm: 15,
      watermarkEnabled: true,
      qrCodeEnabled: true,
      smsSenderId: 'LABSMT',
      dltPrincipalId: '1101489102830',
      allowedIp: '182.74.22.105',
      ipLockdownEnabled: false,
      monthlyTarget: 500000.0
    }
  });

  // 2. Create Users Across Different Roles with Permissions Matrix
  const defaultPasswordHash = await bcrypt.hash('LabSmart@2026', 10);

  const users = [
    {
      username: 'admin',
      fullName: 'Dr. Sameer Verma, MD',
      email: 'admin@apexdiagnostics.com',
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
      email: 'ananya.roy@apexdiagnostics.com',
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
      email: 'sk.verma@apexdiagnostics.com',
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
      fullName: 'Gopalkrishna Pattanaik',
      email: 'reception@apexdiagnostics.com',
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
      canViewLedger: false,
      canManageExpenses: false,
      canIssueRefunds: true
    },
    {
      username: 'technician',
      fullName: 'Sunil Kumar (DMLT)',
      email: 'labtech@apexdiagnostics.com',
      mobile: '9810055667',
      role: 'LAB_TECHNICIAN',
      isOwner: false,
      canBilling: false,
      canResultsEntry: true,
      canAuthorize: false,
      canDoctorPayouts: false,
      canAuditMaster: false,
      canEditRates: false,
      canDeleteBills: false,
      canSignOffReports: false,
      canViewLedger: false,
      canManageExpenses: false,
      canIssueRefunds: false
    }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        ...u,
        passwordHash: defaultPasswordHash
      }
    });
  }

  // 3. Create Referring Doctors with Department Commission Matrix
  const doctorsData = [
    {
      id: 'doc-sharma',
      name: 'Dr. Rajesh Sharma',
      degree: 'MBBS, MD (Medicine)',
      specialty: 'Internal Medicine',
      mobile: '9811223344',
      email: 'dr.sharma@healthclinic.org',
      address: 'Shop 4, Market Complex, Sector 14, Gurugram',
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
      address: 'Gupta Maternity Nursing Home, Model Town',
      commissionPct: 20.0,
      pathologyCommission: 20.0,
      usgCommission: 30.0,
      xrayCommission: 20.0,
      ctCommission: 15.0,
      outsourceCommission: 10.0,
      isActive: true,
      hasPortalAccess: true
    },
    {
      id: 'doc-bansal',
      name: 'Dr. Sunil Bansal',
      degree: 'MS (Orthopaedics)',
      specialty: 'Orthopaedics',
      mobile: '9833445566',
      email: 'dr.bansal@orthocare.org',
      address: 'Bansal Bone & Joint Center',
      commissionPct: 25.0,
      pathologyCommission: 15.0,
      usgCommission: 20.0,
      xrayCommission: 35.0,
      ctCommission: 20.0,
      outsourceCommission: 10.0,
      isActive: true,
      hasPortalAccess: false
    },
    {
      id: 'doc-self',
      name: 'Self / Walk-in Patient',
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
    }
  ];

  for (const d of doctorsData) {
    await prisma.doctor.upsert({
      where: { id: d.id },
      update: {},
      create: d
    });
  }

  // 4. Create Collection Agents (Phlebotomy Runners)
  const agents = [
    {
      id: 'agent-1',
      name: 'Ramesh Kumar (North Zone)',
      phone: '9871100221',
      zone: 'North Zone',
      vehicleNo: 'DL-01-AB-1234',
      feePerCollection: 100.0,
      activeCasesCount: 3,
      totalCollected: 12500.0,
      isActive: true
    },
    {
      id: 'agent-2',
      name: 'Suresh Verma (Central Phlebotomy)',
      phone: '9872200332',
      zone: 'Central Zone',
      vehicleNo: 'DL-02-CD-5678',
      feePerCollection: 120.0,
      activeCasesCount: 5,
      totalCollected: 21800.0,
      isActive: true
    }
  ];

  for (const a of agents) {
    await prisma.collectionAgent.upsert({
      where: { id: a.id },
      update: {},
      create: a
    });
  }

  // 5. Create Test Categories
  const categories = [
    { name: 'Haematology', code: 'HAEM', department: 'Hematology', description: 'Complete Blood Counts, Coagulation, ESR' },
    { name: 'Biochemistry', code: 'BIOCHEM', department: 'Biochemistry', description: 'Liver, Renal, Lipid, Diabetic Profiles' },
    { name: 'Serology & Immunology', code: 'SERO', department: 'Serology', description: 'Typhoid Widal, Dengue Duo, HIV, HBsAg' },
    { name: 'Clinical Pathology', code: 'CLINPATH', department: 'Clinical Pathology', description: 'Urine Routine & Microscopic, Stool' },
    { name: 'Radiology & Imaging', code: 'RADIO', department: 'Radiology', description: 'Digital X-Ray & Ultrasound Examinations' }
  ];

  for (const c of categories) {
    await prisma.testCategory.upsert({
      where: { name: c.name },
      update: {},
      create: { ...c, testCount: 5 }
    });
  }

  // 6. Create Diagnostic Investigations, Parameters & Biological Ranges
  // A. CBC
  const cbc = await prisma.investigation.upsert({
    where: { code: 'CBC' },
    update: {},
    create: {
      code: 'CBC',
      name: 'Complete Blood Count (CBC with Automated Differential)',
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
    { code: 'HB', name: 'Hemoglobin', unit: 'g/dL', method: 'Cyanmethemoglobin / Photometric', lower: 13.0, upper: 17.0, panicLower: 6.0, panicUpper: 20.0, sortOrder: 1 },
    { code: 'RBC', name: 'Total RBC Count', unit: 'million/cumm', method: 'Electrical Impedance', lower: 4.5, upper: 5.5, sortOrder: 2 },
    { code: 'PCV', name: 'Packed Cell Volume (Hematocrit)', unit: '%', method: 'Calculated', lower: 40.0, upper: 50.0, sortOrder: 3 },
    { code: 'MCV', name: 'Mean Corpuscular Volume (MCV)', unit: 'fL', method: 'Calculated', lower: 83.0, upper: 101.0, formula: '(PCV * 10) / RBC', isCalculated: true, sortOrder: 4 },
    { code: 'MCH', name: 'Mean Corpuscular Hemoglobin (MCH)', unit: 'pg', method: 'Calculated', lower: 27.0, upper: 32.0, formula: '(HB * 10) / RBC', isCalculated: true, sortOrder: 5 },
    { code: 'MCHC', name: 'MCHC', unit: 'g/dL', method: 'Calculated', lower: 31.5, upper: 34.5, formula: '(HB * 100) / PCV', isCalculated: true, sortOrder: 6 },
    { code: 'WBC', name: 'Total Leukocyte Count (TLC)', unit: 'cumm', method: 'Flow Cytometry', lower: 4000.0, upper: 11000.0, panicLower: 2000.0, panicUpper: 30000.0, sortOrder: 7 },
    { code: 'NEUTROPHILS', name: 'Neutrophils', unit: '%', method: 'DLC', lower: 40.0, upper: 80.0, isOptional: true, sortOrder: 8 },
    { code: 'LYMPHOCYTES', name: 'Lymphocytes', unit: '%', method: 'DLC', lower: 20.0, upper: 40.0, isOptional: true, sortOrder: 9 },
    { code: 'EOSINOPHILS', name: 'Eosinophils', unit: '%', method: 'DLC', lower: 1.0, upper: 6.0, isOptional: true, sortOrder: 10 },
    { code: 'MONOCYTES', name: 'Monocytes', unit: '%', method: 'DLC', lower: 2.0, upper: 10.0, isOptional: true, sortOrder: 11 },
    { code: 'BASOPHILS', name: 'Basophils', unit: '%', method: 'DLC', lower: 0.0, upper: 2.0, isOptional: true, sortOrder: 12 },
    { code: 'PLATELETS', name: 'Platelet Count', unit: 'lakhs/cumm', method: 'Electrical Impedance', lower: 1.5, upper: 4.1, panicLower: 0.2, panicUpper: 10.0, sortOrder: 13 }
  ];

  for (const p of cbcParams) {
    const existing = await prisma.testParameter.findFirst({
      where: { investigationId: cbc.id, code: p.code }
    });
    if (!existing) {
      await prisma.testParameter.create({
        data: {
          investigationId: cbc.id,
          code: p.code,
          name: p.name,
          unit: p.unit,
          method: p.method,
          formula: p.formula,
          isCalculated: p.isCalculated || false,
          isOptional: p.isOptional || false,
          sortOrder: p.sortOrder,
          ranges: {
            create: {
              gender: 'All',
              minAge: 0,
              maxAge: 120,
              lowerBound: p.lower,
              upperBound: p.upper,
              panicLower: p.panicLower,
              panicUpper: p.panicUpper
            }
          }
        }
      });
    }
  }

  // B. LFT
  const lft = await prisma.investigation.upsert({
    where: { code: 'LFT' },
    update: {},
    create: {
      code: 'LFT',
      name: 'Liver Function Test (LFT Profile)',
      department: 'Biochemistry',
      testType: 'Multi parameter',
      specimen: 'Serum',
      container: 'Yellow Top (Gel Clot Activator)',
      rate: 800.0,
      b2bRate: 400.0,
      tatHours: 4
    }
  });

  const lftParams = [
    { code: 'BILIRUBIN_TOTAL', name: 'Bilirubin Total', unit: 'mg/dL', lower: 0.2, upper: 1.2, sortOrder: 1 },
    { code: 'BILIRUBIN_DIRECT', name: 'Bilirubin Direct (Conjugated)', unit: 'mg/dL', lower: 0.0, upper: 0.3, sortOrder: 2 },
    { code: 'SGOT', name: 'AST / SGOT', unit: 'U/L', lower: 5.0, upper: 40.0, sortOrder: 3 },
    { code: 'SGPT', name: 'ALT / SGPT', unit: 'U/L', lower: 5.0, upper: 45.0, sortOrder: 4 },
    { code: 'ALP', name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', lower: 30.0, upper: 120.0, sortOrder: 5 },
    { code: 'TOTAL_PROTEIN', name: 'Total Protein', unit: 'g/dL', lower: 6.4, upper: 8.3, sortOrder: 6 },
    { code: 'ALBUMIN', name: 'Serum Albumin', unit: 'g/dL', lower: 3.5, upper: 5.0, sortOrder: 7 },
    { code: 'GLOBULIN', name: 'Serum Globulin', unit: 'g/dL', lower: 2.0, upper: 3.5, formula: 'TOTAL_PROTEIN - ALBUMIN', isCalculated: true, sortOrder: 8 },
    { code: 'AG_RATIO', name: 'A/G Ratio', unit: 'ratio', lower: 1.2, upper: 2.2, formula: 'ALBUMIN / GLOBULIN', isCalculated: true, sortOrder: 9 }
  ];

  for (const p of lftParams) {
    const existing = await prisma.testParameter.findFirst({
      where: { investigationId: lft.id, code: p.code }
    });
    if (!existing) {
      await prisma.testParameter.create({
        data: {
          investigationId: lft.id,
          code: p.code,
          name: p.name,
          unit: p.unit,
          formula: p.formula,
          isCalculated: p.isCalculated || false,
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
  }

  // C. USG Whole Abdomen
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

  // D. Digital Chest X-Ray
  await prisma.investigation.upsert({
    where: { code: 'XRAY-CHEST' },
    update: {},
    create: {
      code: 'XRAY-CHEST',
      name: 'Digital Radiography (X-Ray) Chest PA View',
      department: 'Radiology',
      testType: 'Document',
      specimen: 'Digital Radiograph',
      container: 'DR Detector Plate 14x17',
      rate: 500.0,
      b2bRate: 250.0,
      tatHours: 1
    }
  });

  // 7. Create Test Panels
  await prisma.testPanel.upsert({
    where: { name: 'Complete Blood Count (CBC)' },
    update: {},
    create: {
      name: 'Complete Blood Count (CBC)',
      code: 'PANEL-CBC',
      department: 'Hematology',
      category: 'Haematology',
      testCount: 13,
      testIds: JSON.stringify(['CBC']),
      subheadings: JSON.stringify(['Differential Leukocyte Count', 'Red Blood Cell Indices']),
      panelPrice: 400.0
    }
  });

  // 8. Create Health Packages
  await prisma.healthPackage.upsert({
    where: { code: 'HP-EXECUTIVE' },
    update: {},
    create: {
      code: 'HP-EXECUTIVE',
      name: 'Executive Full Body Health Checkup',
      category: 'Preventive Health',
      description: 'Comprehensive screening package including CBC, LFT, and Renal profiles',
      testsIncluded: JSON.stringify(['CBC', 'LFT']),
      retailPrice: 1200.0,
      packagePrice: 999.0,
      discountPct: 16.7,
      fastingNotes: '10 to 12 hours overnight fasting mandatory',
      isActive: true
    }
  });

  // 9. Create Clinical Interpretations
  await prisma.clinicalInterpretation.upsert({
    where: { id: 'interp-cbc-normal' },
    update: {},
    create: {
      id: 'interp-cbc-normal',
      title: 'Normal Hemogram Morphological Impression',
      testCode: 'CBC',
      department: 'Hematology',
      content: 'Peripheral smear examination reveals normocytic normochromic red cells with normal white blood cell morphology and adequate platelets. No abnormal or immature cells seen.'
    }
  });

  // 10. Create Radiology Templates
  await prisma.radiologyTemplate.upsert({
    where: { id: 'tpl-xray-chest-normal' },
    update: {},
    create: {
      id: 'tpl-xray-chest-normal',
      title: 'Normal Chest PA View Radiograph',
      modality: 'X-RAY',
      organType: 'Chest & Thorax',
      content: 'Posteroanterior radiograph of chest reveals clear lung parenchyma bilaterally. Cardiothoracic ratio within normal limits (<0.50). Bilateral diaphragmatic domes and costophrenic angles are clear. Visualized thoracic cage is unremarkable.',
      isNormal: true
    }
  });

  // 11. Create Digital Signatures
  await prisma.digitalSignature.upsert({
    where: { id: 'sig-pathology-default' },
    update: {},
    create: {
      id: 'sig-pathology-default',
      doctorName: 'Dr. Ananya Roy',
      designation: 'Consultant Pathologist',
      degree: 'MBBS, MD (Pathology)',
      registrationNo: 'DMC-P-89210',
      isDefault: true,
      modality: 'PATHOLOGY'
    }
  });

  await prisma.digitalSignature.upsert({
    where: { id: 'sig-radiology-default' },
    update: {},
    create: {
      id: 'sig-radiology-default',
      doctorName: 'Dr. S. K. Verma',
      designation: 'Consultant Radiologist & RSO',
      degree: 'MBBS, MD (Radiodiagnosis)',
      registrationNo: 'DMC-R-49102',
      isDefault: true,
      modality: 'RADIOLOGY'
    }
  });

  // 12. Create Sample Patients & Cases
  const samplePatient = await prisma.patient.upsert({
    where: { uhid: '35375569' },
    update: {},
    create: {
      uhid: '35375569',
      prefix: 'Mr.',
      firstName: 'Rahul',
      lastName: 'Sharma',
      fullName: 'Rahul Sharma',
      gender: 'Male',
      ageYears: 32,
      ageUnit: 'Years',
      mobile: '9876543210',
      email: 'rahul.sharma@gmail.com',
      address: 'Flat 402, Green Glen Layout, New Delhi',
      bloodGroup: 'O Positive',
      totalVisits: 2
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
      reportStatus: 'Signed Off',
      paymentStatus: 'Paid',
      grossAmount: 400.0,
      discountType: 'fixed',
      discountValue: 0.0,
      discountAmount: 0.0,
      netPayable: 400.0,
      paidAmount: 400.0,
      balanceDue: 0.0,
      paymentMode: 'Cash',
      items: {
        create: [
          {
            testId: cbc.id,
            testCode: cbc.code,
            testName: cbc.name,
            department: cbc.department,
            specimen: cbc.specimen,
            rate: 400.0,
            discount: 0.0,
            netAmount: 400.0
          }
        ]
      },
      payments: {
        create: {
          receiptNumber: 'REC-2026-1001',
          amount: 400.0,
          mode: 'Cash',
          receivedBy: 'Gopalkrishna Pattanaik',
          counterDesk: 'Counter 1'
        }
      },
      clinicalResult: {
        create: {
          parameterValues: JSON.stringify([
            { code: 'HB', value: '14.5', flag: 'NORMAL' },
            { code: 'WBC', value: '7800', flag: 'NORMAL' },
            { code: 'PLATELETS', value: '2.5', flag: 'NORMAL' }
          ]),
          interpretation: 'Normal hemogram with normocytic normochromic red cell morphology.',
          isAuthorized: true,
          authorizedBy: 'Dr. Ananya Roy, MD (Pathology)',
          authorizedAt: new Date()
        }
      }
    }
  });

  // 13. Create Sample Operational Expense Voucher
  await prisma.expenseVoucher.upsert({
    where: { voucherNumber: 'EXP-2026-0001' },
    update: {},
    create: {
      voucherNumber: 'EXP-2026-0001',
      name: 'Sysmex Cellpack Reagent 20L',
      amount: 2500.0,
      category: 'Lab Reagents & Consumables',
      paymentMode: 'UPI',
      vendor: 'Transasia Bio-Medicals Ltd',
      invoiceNo: 'INV-89102',
      description: 'Emergency dilution buffer pack for automated 5-part hematology analyzer',
      cashierName: 'Admin'
    }
  });

  console.log(`✅ Successfully seeded comprehensive enterprise database:
  - Clinic Settings created
  - 5 Staff User Accounts created (admin, pathologist, radiologist, receptionist, technician)
  - 4 Referring Doctors created with department commission rates
  - 2 Phlebotomy Collection Agents created
  - 5 Test Categories & Panels created
  - Diagnostic Tests with Biological Ranges created (CBC, LFT, USG, X-Ray)
  - Clinical Interpretations & Radiology Templates created
  - Digital Signatures for Pathologist and Radiologist created
  - Sample Patient (UHID: 35375569) and Case BL-2026-1001 created
  - Operational Expense Voucher EXP-2026-0001 created`);
}

main()
  .catch((e) => {
    console.error('❌ Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
