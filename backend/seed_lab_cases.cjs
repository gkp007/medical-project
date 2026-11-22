const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Investigations and Cases...');

  // 1. Doctors
  const doctorsData = [
    { name: 'Dr. Anil Verma', degree: 'MBBS, MD', specialty: 'General Medicine', mobile: '9876543210' },
    { name: 'Dr. Priya Sharma', degree: 'MS', specialty: 'Gynecology', mobile: '9822334455' },
    { name: 'Self Referral / Walk-in', degree: '', specialty: 'General', mobile: '9800000000' },
    { name: 'Dr. Drx. Pramod Ku.Pradhani (Pharmacist)', degree: 'B.Pharm', specialty: 'Pharmacist', mobile: '9833445566' },
    { name: 'Dr. SUBHENDU KUMAR MEHER ((o&g))', degree: 'MBBS, MS (O&G)', specialty: 'Obstetrics & Gynecology', mobile: '9844556677' }
  ];

  const docMap = {};
  for (const d of doctorsData) {
    let doc = await prisma.doctor.findFirst({ where: { name: d.name } });
    if (!doc) {
      doc = await prisma.doctor.create({ data: d });
    }
    docMap[d.name] = doc.id;
  }

  // 2. Patients
  const patientsData = [
    {
      uhid: '35375569',
      fullName: 'Rahul Sharma',
      ageYears: 32,
      gender: 'Male',
      mobile: '9876543210',
      address: 'Indore'
    },
    {
      uhid: '35375560',
      fullName: 'Sunita Rao',
      ageYears: 58,
      gender: 'Female',
      mobile: '9822334455',
      address: 'Indore'
    },
    {
      uhid: '35375545',
      fullName: 'Anil Saxena',
      ageYears: 44,
      gender: 'Male',
      mobile: '9811002233',
      address: 'Indore'
    },
    {
      uhid: '35375530',
      fullName: 'Vikas Malhotra',
      ageYears: 38,
      gender: 'Male',
      mobile: '9944556677',
      address: 'Indore'
    },
    {
      uhid: '35373656',
      fullName: 'Mrs. Khiramati Patel',
      ageYears: 28,
      gender: 'Female',
      mobile: '9855667788',
      address: 'Main Town'
    },
    {
      uhid: '35373660',
      fullName: 'Gouri Kumbhar',
      ageYears: 39,
      gender: 'Female',
      mobile: '9866778899',
      address: 'Main Town'
    }
  ];

  const patientMap = {};
  for (const p of patientsData) {
    let pat = await prisma.patient.findFirst({ where: { uhid: p.uhid } });
    if (!pat) {
      pat = await prisma.patient.create({ data: p });
    }
    patientMap[p.uhid] = pat.id;
  }

  // 3. Investigations & Test Parameters
  const investigationsData = [
    {
      code: 'CBC_01',
      name: 'Complete Blood Count (CBC with Automated Differential)',
      department: 'Haematology',
      testType: 'Multi parameter',
      specimen: 'Whole Blood EDTA',
      container: 'Lavender top (EDTA)',
      rate: 200,
      parameters: [
        { code: 'HB', name: 'Hemoglobin', unit: 'g/dl', sortOrder: 1, lower: 12.0, upper: 15.0, displayRange: '12 - 15' },
        { code: 'TLC', name: 'Total Leukocyte Count', unit: 'cumm', sortOrder: 2, lower: 4000, upper: 11000, displayRange: '4,000 - 11,000' },
        { code: 'NEUT', name: 'Neutrophils', unit: '%', sortOrder: 3, lower: 40, upper: 70, displayRange: '40 - 70' },
        { code: 'LYMPH', name: 'Lymphocyte', unit: '%', sortOrder: 4, lower: 20, upper: 40, displayRange: '20 - 40' },
        { code: 'EOS', name: 'Eosinophils', unit: '%', sortOrder: 5, lower: 1, upper: 6, displayRange: '1 - 6' },
        { code: 'MONO', name: 'Monocytes', unit: '%', sortOrder: 6, lower: 2, upper: 8, displayRange: '2 - 8' },
        { code: 'BASO', name: 'Basophils', unit: '%', sortOrder: 7, lower: 0, upper: 1, displayRange: '0 - 1' },
        { code: 'PLT', name: 'Platelet Count', unit: 'cumm', sortOrder: 8, lower: 150000, upper: 450000, displayRange: '150,000 - 450,000' },
        { code: 'RBC', name: 'Total RBC Count', unit: 'mill/cumm', sortOrder: 9, lower: 3.8, upper: 5.2, displayRange: '3.8 - 5.2' },
        { code: 'HCT', name: 'Hematocrit Value, Hct', unit: '%', sortOrder: 10, lower: 36, upper: 46, displayRange: '36.0 - 46.0' },
        { code: 'MCV', name: 'Mean Corpuscular Volume, MCV', unit: 'fL', sortOrder: 11, lower: 80, upper: 100, displayRange: '80 - 100' },
        { code: 'MCH', name: 'Mean Cell Haemoglobin, MCH', unit: 'pg', sortOrder: 12, lower: 27, upper: 32, displayRange: '27 - 32' },
        { code: 'MCHC', name: 'Mean Cell Haemoglobin CON, MCHC', unit: 'g/dl', sortOrder: 13, lower: 31.5, upper: 34.5, displayRange: '31.5 - 34.5' },
        { code: 'RDW', name: 'R.D.W. - CV', unit: '%', sortOrder: 14, lower: 11.5, upper: 14.5, displayRange: '11.5 - 14.5' }
      ]
    },
    {
      code: 'LIPID_01',
      name: 'Lipid Profile Standard',
      department: 'Biochemistry',
      testType: 'Multi parameter',
      specimen: 'Serum (Fasting 12h)',
      container: 'SST Gold top',
      rate: 450,
      parameters: [
        { code: 'CHOL', name: 'Total Cholesterol', unit: 'mg/dL', sortOrder: 1, lower: 0, upper: 200, displayRange: '< 200' },
        { code: 'TRIG', name: 'Triglycerides', unit: 'mg/dL', sortOrder: 2, lower: 0, upper: 150, displayRange: '< 150' },
        { code: 'HDL', name: 'HDL Cholesterol', unit: 'mg/dL', sortOrder: 3, lower: 40, upper: 60, displayRange: '> 40' },
        { code: 'LDL', name: 'LDL Cholesterol', unit: 'mg/dL', sortOrder: 4, lower: 0, upper: 100, displayRange: '< 100' },
        { code: 'VLDL', name: 'VLDL Cholesterol', unit: 'mg/dL', sortOrder: 5, lower: 5, upper: 30, displayRange: '5 - 30' },
        { code: 'CHOL_HDL', name: 'Total Cholesterol / HDL', unit: 'ratio', sortOrder: 6, lower: 0, upper: 4.5, displayRange: '< 4.5' }
      ]
    },
    {
      code: 'LFT_01',
      name: 'Liver Function Test (LFT)',
      department: 'Biochemistry',
      testType: 'Multi parameter',
      specimen: 'Serum',
      container: 'SST Gold top',
      rate: 450,
      parameters: [
        { code: 'TBIL', name: 'Bilirubin Total', unit: 'mg/dL', sortOrder: 1, lower: 0.2, upper: 1.2, displayRange: '0.2 - 1.2' },
        { code: 'DBIL', name: 'Bilirubin Direct', unit: 'mg/dL', sortOrder: 2, lower: 0.0, upper: 0.3, displayRange: '0.0 - 0.3' },
        { code: 'IBIL', name: 'Bilirubin Indirect', unit: 'mg/dL', sortOrder: 3, lower: 0.2, upper: 0.9, displayRange: '0.2 - 0.9' },
        { code: 'SGOT', name: 'SGOT / AST', unit: 'U/L', sortOrder: 4, lower: 5, upper: 40, displayRange: '5 - 40' },
        { code: 'SGPT', name: 'SGPT / ALT', unit: 'U/L', sortOrder: 5, lower: 7, upper: 56, displayRange: '7 - 56' },
        { code: 'ALP', name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', sortOrder: 6, lower: 44, upper: 147, displayRange: '44 - 147' },
        { code: 'TP', name: 'Total Protein', unit: 'g/dL', sortOrder: 7, lower: 6.0, upper: 8.3, displayRange: '6.0 - 8.3' },
        { code: 'ALB', name: 'Albumin', unit: 'g/dL', sortOrder: 8, lower: 3.5, upper: 5.0, displayRange: '3.5 - 5.0' },
        { code: 'GLOB', name: 'Globulin', unit: 'g/dL', sortOrder: 9, lower: 2.0, upper: 3.5, displayRange: '2.0 - 3.5' },
        { code: 'AG_RATIO', name: 'A/G Ratio', unit: 'ratio', sortOrder: 10, lower: 1.2, upper: 2.2, displayRange: '1.2 - 2.2' }
      ]
    },
    {
      code: 'KFT_01',
      name: 'Kidney Function Test (KFT)',
      department: 'Biochemistry',
      testType: 'Multi parameter',
      specimen: 'Serum',
      container: 'SST Gold top',
      rate: 400,
      parameters: [
        { code: 'UREA', name: 'Blood Urea', unit: 'mg/dL', sortOrder: 1, lower: 15, upper: 45, displayRange: '15 - 45' },
        { code: 'BUN', name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', sortOrder: 2, lower: 7, upper: 20, displayRange: '7 - 20' },
        { code: 'CREAT', name: 'Serum Creatinine', unit: 'mg/dL', sortOrder: 3, lower: 0.7, upper: 1.3, displayRange: '0.7 - 1.3' },
        { code: 'URIC', name: 'Uric Acid', unit: 'mg/dL', sortOrder: 4, lower: 3.5, upper: 7.2, displayRange: '3.5 - 7.2' },
        { code: 'CALC', name: 'Serum Calcium', unit: 'mg/dL', sortOrder: 5, lower: 8.5, upper: 10.5, displayRange: '8.5 - 10.5' },
        { code: 'PHOS', name: 'Phosphorus', unit: 'mg/dL', sortOrder: 6, lower: 2.5, upper: 4.5, displayRange: '2.5 - 4.5' },
        { code: 'SOD', name: 'Sodium', unit: 'mEq/L', sortOrder: 7, lower: 135, upper: 145, displayRange: '135 - 145' },
        { code: 'POT', name: 'Potassium', unit: 'mEq/L', sortOrder: 8, lower: 3.5, upper: 5.1, displayRange: '3.5 - 5.1' }
      ]
    },
    {
      code: 'URINE_01',
      name: 'Urine Routine Examination',
      department: 'Clinical Pathology',
      testType: 'Multi parameter',
      specimen: 'Random Midstream Urine',
      container: 'Sterile Urine Container',
      rate: 100,
      parameters: [
        { code: 'U_QTY', name: 'QUANTITY', unit: 'ml', sortOrder: 1, lower: 0, upper: 0, displayRange: '-' },
        { code: 'U_COL', name: 'COLOUR', unit: '', sortOrder: 2, lower: 0, upper: 0, displayRange: 'Pale Yellow' },
        { code: 'U_TRAN', name: 'TRANSPARENCY', unit: '', sortOrder: 3, lower: 0, upper: 0, displayRange: 'Clear' },
        { code: 'U_SG', name: 'SPECIFIC GRAVITY', unit: '', sortOrder: 4, lower: 1.005, upper: 1.03, displayRange: '1.005 - 1.03' },
        { code: 'U_PH', name: 'PH', unit: '', sortOrder: 5, lower: 5, upper: 7, displayRange: '5 - 7' },
        { code: 'U_LEUK', name: 'LEUKOCYTES', unit: '', sortOrder: 6, lower: 0, upper: 0, displayRange: 'Absent' },
        { code: 'U_BLD', name: 'BLOOD', unit: '', sortOrder: 7, lower: 0, upper: 0, displayRange: 'Absent' },
        { code: 'U_PROT', name: 'PROTEIN / ALBUMIN', unit: '', sortOrder: 8, lower: 0, upper: 0, displayRange: 'Absent' },
        { code: 'U_SUG', name: 'SUGAR / GLUCOSE', unit: '', sortOrder: 9, lower: 0, upper: 0, displayRange: 'Absent' },
        { code: 'U_KET', name: 'KETONE BODIES', unit: '', sortOrder: 10, lower: 0, upper: 0, displayRange: 'Absent' },
        { code: 'U_PUS', name: 'PUS CELLS', unit: '/HPF', sortOrder: 11, lower: 0, upper: 5, displayRange: '0 - 5' },
        { code: 'U_EPI', name: 'EPITHELIAL CELLS', unit: '/HPF', sortOrder: 12, lower: 0, upper: 5, displayRange: '0 - 5' },
        { code: 'U_RBC', name: 'R.B.C', unit: '/HPF', sortOrder: 13, lower: 0, upper: 0, displayRange: 'Nil' }
      ]
    },
    {
      code: 'HBA1C_01',
      name: 'HbA1c Glycated Hemoglobin',
      department: 'Biochemistry',
      testType: 'Multi parameter',
      specimen: 'Whole Blood EDTA',
      container: 'Lavender top (EDTA)',
      rate: 350,
      parameters: [
        { code: 'HBA1C', name: 'HbA1c Glycated Hemoglobin', unit: '%', sortOrder: 1, lower: 4.0, upper: 5.6, displayRange: '4.0 - 5.6' },
        { code: 'EAG', name: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', sortOrder: 2, lower: 70, upper: 120, displayRange: '70 - 120' }
      ]
    },
    {
      code: 'FBS_01',
      name: 'Fasting Blood Sugar',
      department: 'Biochemistry',
      testType: 'Single parameter',
      specimen: 'Fluoride Plasma',
      container: 'Grey top (Sodium Fluoride)',
      rate: 60,
      parameters: [
        { code: 'FBS', name: 'Fasting Blood Sugar', unit: 'mg/dL', sortOrder: 1, lower: 70, upper: 99, displayRange: '70 - 99' }
      ]
    }
  ];

  const invMap = {};
  for (const invData of investigationsData) {
    let inv = await prisma.investigation.findFirst({ where: { OR: [{ code: invData.code }, { name: invData.name }] } });
    if (!inv) {
      inv = await prisma.investigation.create({
        data: {
          code: invData.code,
          name: invData.name,
          department: invData.department,
          testType: invData.testType,
          specimen: invData.specimen,
          container: invData.container,
          rate: invData.rate
        }
      });
    } else {
      await prisma.investigation.update({
        where: { id: inv.id },
        data: {
          name: invData.name,
          department: invData.department,
          testType: invData.testType,
          rate: invData.rate
        }
      });
    }
    invMap[invData.code] = inv.id;

    // Parameters
    for (const p of invData.parameters) {
      let param = await prisma.testParameter.findFirst({
        where: { investigationId: inv.id, code: p.code }
      });
      if (!param) {
        param = await prisma.testParameter.create({
          data: {
            investigationId: inv.id,
            code: p.code,
            name: p.name,
            unit: p.unit,
            sortOrder: p.sortOrder
          }
        });
      } else {
        await prisma.testParameter.update({
          where: { id: param.id },
          data: { name: p.name, unit: p.unit, sortOrder: p.sortOrder }
        });
      }

      // Range
      let range = await prisma.parameterRange.findFirst({
        where: { parameterId: param.id }
      });
      if (!range) {
        await prisma.parameterRange.create({
          data: {
            parameterId: param.id,
            gender: 'All',
            minAge: 0,
            maxAge: 120,
            lowerBound: p.lower,
            upperBound: p.upper,
            textualNormal: JSON.stringify({
              displayRange: p.displayRange,
              textualNormal: p.displayRange
            })
          }
        });
      } else {
        await prisma.parameterRange.update({
          where: { id: range.id },
          data: {
            lowerBound: p.lower,
            upperBound: p.upper,
            textualNormal: JSON.stringify({
              displayRange: p.displayRange,
              textualNormal: p.displayRange
            })
          }
        });
      }
    }
  }

  // 4. Upsert Cases
  const casesToSeed = [
    {
      id: 'case-1001',
      billNumber: '1001',
      dailyCode: 'L1',
      uhid: '35375569',
      docName: 'Dr. Anil Verma',
      reportStatus: 'Signed Off',
      modality: 'LAB',
      grossAmount: 200,
      netPayable: 200,
      paidAmount: 200,
      balanceDue: 0,
      investigationCodes: ['CBC_01'],
      results: [
        { code: 'HB', name: 'Hemoglobin', value: '14.2', unit: 'g/dl' },
        { code: 'TLC', name: 'Total Leukocyte Count', value: '7,500', unit: 'cumm' },
        { code: 'NEUT', name: 'Neutrophils', value: '62', unit: '%' },
        { code: 'LYMPH', name: 'Lymphocyte', value: '30', unit: '%' },
        { code: 'EOS', name: 'Eosinophils', value: '4', unit: '%' },
        { code: 'MONO', name: 'Monocytes', value: '3', unit: '%' },
        { code: 'BASO', name: 'Basophils', value: '1', unit: '%' },
        { code: 'PLT', name: 'Platelet Count', value: '280,000', unit: 'cumm' },
        { code: 'RBC', name: 'Total RBC Count', value: '4.8', unit: 'mill/cumm' },
        { code: 'HCT', name: 'Hematocrit Value, Hct', value: '42.5', unit: '%' },
        { code: 'MCV', name: 'Mean Corpuscular Volume, MCV', value: '88.5', unit: 'fL' },
        { code: 'MCH', name: 'Mean Cell Haemoglobin, MCH', value: '29.6', unit: 'pg' },
        { code: 'MCHC', name: 'Mean Cell Haemoglobin CON, MCHC', value: '33.4', unit: 'g/dl' },
        { code: 'RDW', name: 'R.D.W. - CV', value: '13.2', unit: '%' }
      ]
    },
    {
      id: 'case-1000',
      billNumber: '1000',
      dailyCode: 'L1',
      uhid: '35375560',
      docName: 'Dr. Priya Sharma',
      reportStatus: 'Signed Off',
      modality: 'LAB',
      grossAmount: 410,
      netPayable: 410,
      paidAmount: 410,
      balanceDue: 0,
      investigationCodes: ['HBA1C_01', 'FBS_01'],
      results: [
        { code: 'HBA1C', name: 'HbA1c Glycated Hemoglobin', value: '6.8', unit: '%', isAbnormal: true },
        { code: 'EAG', name: 'Estimated Average Glucose (eAG)', value: '148', unit: 'mg/dL', isAbnormal: true },
        { code: 'FBS', name: 'Fasting Blood Sugar', value: '132', unit: 'mg/dL', isAbnormal: true }
      ]
    },
    {
      id: 'case-995',
      billNumber: '995',
      dailyCode: 'L2',
      uhid: '35375545',
      docName: 'Self Referral / Walk-in',
      reportStatus: 'In Process',
      modality: 'LAB',
      grossAmount: 900,
      netPayable: 900,
      paidAmount: 900,
      balanceDue: 0,
      investigationCodes: ['LIPID_01', 'LFT_01'],
      results: [
        { code: 'CHOL', name: 'Total Cholesterol', value: '224', unit: 'mg/dL', isAbnormal: true },
        { code: 'TRIG', name: 'Triglycerides', value: '185', unit: 'mg/dL', isAbnormal: true },
        { code: 'HDL', name: 'HDL Cholesterol', value: '38', unit: 'mg/dL', isAbnormal: true },
        { code: 'LDL', name: 'LDL Cholesterol', value: '149', unit: 'mg/dL', isAbnormal: true },
        { code: 'VLDL', name: 'VLDL Cholesterol', value: '37', unit: 'mg/dL', isAbnormal: true },
        { code: 'CHOL_HDL', name: 'Total Cholesterol / HDL', value: '5.9', unit: 'ratio', isAbnormal: true },
        { code: 'TBIL', name: 'Bilirubin Total', value: '0.9', unit: 'mg/dL' },
        { code: 'DBIL', name: 'Bilirubin Direct', value: '0.2', unit: 'mg/dL' },
        { code: 'IBIL', name: 'Bilirubin Indirect', value: '0.7', unit: 'mg/dL' },
        { code: 'SGOT', name: 'SGOT / AST', value: '32', unit: 'U/L' },
        { code: 'SGPT', name: 'SGPT / ALT', value: '45', unit: 'U/L' },
        { code: 'ALP', name: 'Alkaline Phosphatase (ALP)', value: '98', unit: 'U/L' },
        { code: 'TP', name: 'Total Protein', value: '7.2', unit: 'g/dL' },
        { code: 'ALB', name: 'Albumin', value: '4.1', unit: 'g/dL' },
        { code: 'GLOB', name: 'Globulin', value: '3.1', unit: 'g/dL' },
        { code: 'AG_RATIO', name: 'A/G Ratio', value: '1.3', unit: 'ratio' }
      ]
    },
    {
      id: 'case-988',
      billNumber: '988',
      dailyCode: 'L1',
      uhid: '35375530',
      docName: 'Dr. Anil Verma',
      reportStatus: 'Finalized',
      modality: 'LAB',
      grossAmount: 500,
      netPayable: 500,
      paidAmount: 500,
      balanceDue: 0,
      investigationCodes: ['KFT_01', 'URINE_01'],
      results: [
        { code: 'UREA', name: 'Blood Urea', value: '28', unit: 'mg/dL' },
        { code: 'BUN', name: 'Blood Urea Nitrogen (BUN)', value: '13', unit: 'mg/dL' },
        { code: 'CREAT', name: 'Serum Creatinine', value: '1.0', unit: 'mg/dL' },
        { code: 'URIC', name: 'Uric Acid', value: '5.4', unit: 'mg/dL' },
        { code: 'CALC', name: 'Serum Calcium', value: '9.4', unit: 'mg/dL' },
        { code: 'PHOS', name: 'Phosphorus', value: '3.6', unit: 'mg/dL' },
        { code: 'SOD', name: 'Sodium', value: '140', unit: 'mEq/L' },
        { code: 'POT', name: 'Potassium', value: '4.2', unit: 'mEq/L' },
        { code: 'U_QTY', name: 'QUANTITY', value: '30', unit: 'ml' },
        { code: 'U_COL', name: 'COLOUR', value: 'Pale Yellow', unit: '' },
        { code: 'U_TRAN', name: 'TRANSPARENCY', value: 'Clear', unit: '' },
        { code: 'U_SG', name: 'SPECIFIC GRAVITY', value: '1.015', unit: '' },
        { code: 'U_PH', name: 'PH', value: '6.0', unit: '' },
        { code: 'U_LEUK', name: 'LEUKOCYTES', value: 'Negative', unit: '' },
        { code: 'U_BLD', name: 'BLOOD', value: 'Negative', unit: '' },
        { code: 'U_PROT', name: 'PROTEIN / ALBUMIN', value: 'Nil', unit: '' },
        { code: 'U_SUG', name: 'SUGAR / GLUCOSE', value: 'Nil', unit: '' },
        { code: 'U_KET', name: 'KETONE BODIES', value: 'Negative', unit: '' },
        { code: 'U_PUS', name: 'PUS CELLS', value: '1-2', unit: '/HPF' },
        { code: 'U_EPI', name: 'EPITHELIAL CELLS', value: '2-3', unit: '/HPF' },
        { code: 'U_RBC', name: 'R.B.C', value: 'Nil', unit: '/HPF' }
      ]
    },
    {
      id: 'case-3656',
      billNumber: '3656',
      dailyCode: 'L8',
      uhid: '35373656',
      docName: 'Dr. Drx. Pramod Ku.Pradhani (Pharmacist)',
      reportStatus: 'Signed Off',
      modality: 'LAB',
      grossAmount: 100,
      netPayable: 100,
      paidAmount: 100,
      balanceDue: 0,
      investigationCodes: ['URINE_01'],
      results: [
        { code: 'U_QTY', name: 'QUANTITY', value: '10', unit: 'ml' },
        { code: 'U_COL', name: 'COLOUR', value: 'Yellow', unit: '' },
        { code: 'U_TRAN', name: 'TRANSPARENCY', value: 'Turbid', unit: '' },
        { code: 'U_SG', name: 'SPECIFIC GRAVITY', value: '1.01', unit: '' },
        { code: 'U_PH', name: 'PH', value: '7.5', unit: '', isAbnormal: true },
        { code: 'U_LEUK', name: 'LEUKOCYTES', value: 'Present (+++)', unit: '', isAbnormal: true },
        { code: 'U_BLD', name: 'BLOOD', value: 'Present (++)', unit: '', isAbnormal: true },
        { code: 'U_PROT', name: 'PROTEIN / ALBUMIN', value: 'Present (++)', unit: '', isAbnormal: true },
        { code: 'U_SUG', name: 'SUGAR / GLUCOSE', value: 'Absent', unit: '' },
        { code: 'U_KET', name: 'KETONE BODIES', value: 'Absent', unit: '' },
        { code: 'U_PUS', name: 'PUS CELLS', value: '20-25', unit: '/HPF', isAbnormal: true },
        { code: 'U_EPI', name: 'EPITHELIAL CELLS', value: '8-10', unit: '/HPF', isAbnormal: true },
        { code: 'U_RBC', name: 'R.B.C', value: '10-12', unit: '/HPF', isAbnormal: true }
      ]
    },
    {
      id: 'case-3660',
      billNumber: '3660',
      dailyCode: 'L1',
      uhid: '35373660',
      docName: 'Dr. SUBHENDU KUMAR MEHER ((o&g))',
      reportStatus: 'Finalized',
      modality: 'LAB',
      grossAmount: 200,
      netPayable: 200,
      paidAmount: 200,
      balanceDue: 0,
      investigationCodes: ['CBC_01'],
      results: [
        { code: 'HB', name: 'Hemoglobin', value: '8.4', unit: 'g/dl', isAbnormal: true },
        { code: 'TLC', name: 'Total Leukocyte Count', value: '12,900', unit: 'cumm', isAbnormal: true },
        { code: 'NEUT', name: 'Neutrophils', value: '71', unit: '%', isAbnormal: true },
        { code: 'LYMPH', name: 'Lymphocyte', value: '22', unit: '%' },
        { code: 'EOS', name: 'Eosinophils', value: '06', unit: '%' },
        { code: 'MONO', name: 'Monocytes', value: '1', unit: '%' },
        { code: 'BASO', name: 'Basophils', value: '0', unit: '%' },
        { code: 'PLT', name: 'Platelet Count', value: '240,000', unit: 'cumm' },
        { code: 'RBC', name: 'Total RBC Count', value: '3.6', unit: 'mill/cumm', isAbnormal: true },
        { code: 'HCT', name: 'Hematocrit Value, Hct', value: '28.0', unit: '%', isAbnormal: true },
        { code: 'MCV', name: 'Mean Corpuscular Volume, MCV', value: '77.8', unit: 'fL', isAbnormal: true },
        { code: 'MCH', name: 'Mean Cell Haemoglobin, MCH', value: '23.3', unit: 'pg', isAbnormal: true },
        { code: 'MCHC', name: 'Mean Cell Haemoglobin CON, MCHC', value: '30.0', unit: 'g/dl', isAbnormal: true },
        { code: 'RDW', name: 'R.D.W. - CV', value: '15.8', unit: '%', isAbnormal: true }
      ]
    }
  ];

  for (const c of casesToSeed) {
    const patientId = patientMap[c.uhid];
    const doctorId = docMap[c.docName];

    let existingCase = await prisma.case.findFirst({
      where: { OR: [{ id: c.id }, { billNumber: c.billNumber }] }
    });

    if (!existingCase) {
      existingCase = await prisma.case.create({
        data: {
          id: c.id,
          billNumber: c.billNumber,
          dailyCode: c.dailyCode,
          uhid: c.uhid,
          patientId,
          doctorId,
          reportStatus: c.reportStatus,
          modality: c.modality,
          grossAmount: c.grossAmount,
          netPayable: c.netPayable,
          paidAmount: c.paidAmount,
          balanceDue: c.balanceDue
        }
      });
    } else {
      await prisma.case.update({
        where: { id: existingCase.id },
        data: {
          dailyCode: c.dailyCode,
          uhid: c.uhid,
          patientId,
          doctorId,
          reportStatus: c.reportStatus,
          modality: c.modality
        }
      });
    }

    // Connect case items (investigations)
    await prisma.caseItem.deleteMany({ where: { caseId: existingCase.id } });
    for (const code of c.investigationCodes) {
      const inv = await prisma.investigation.findFirst({ where: { OR: [{ code: code }, { id: invMap[code] }] } });
      if (inv) {
        await prisma.caseItem.create({
          data: {
            caseId: existingCase.id,
            testId: inv.id,
            testCode: inv.code,
            testName: inv.name,
            department: inv.department,
            specimen: inv.specimen || 'Blood/Urine',
            rate: inv.rate || 100,
            netAmount: inv.rate || 100
          }
        });
      }
    }

    // Connect clinical result
    await prisma.clinicalResult.deleteMany({ where: { caseId: existingCase.id } });
    await prisma.clinicalResult.create({
      data: {
        caseId: existingCase.id,
        parameterValues: JSON.stringify(c.results),
        isAuthorized: c.reportStatus === 'Signed Off',
        authorizedBy: c.reportStatus === 'Signed Off' ? 'Dr. Sameer Verma (Consultant Pathologist)' : null,
        authorizedAt: c.reportStatus === 'Signed Off' ? new Date() : null
      }
    });

    console.log(`Synced Case: ${c.billNumber} (${c.dailyCode}) for ${c.uhid} with ${c.investigationCodes.length} tests`);
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch(e => {
  console.error('Error seeding cases:', e);
  process.exit(1);
});
