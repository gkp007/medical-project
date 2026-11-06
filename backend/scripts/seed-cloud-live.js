// Script to seed doctors and investigations into live backend
async function run() {
  const loginRes = await fetch('https://medicalproject-backend.onrender.com/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'gkp007', password: 'LabSmart@2026' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.data?.token) {
    console.error('Failed to login:', loginData);
    process.exit(1);
  }
  const token = loginData.data.token;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  };

  console.log('Logged in successfully as gkp007.');

  // 1. Seed Doctors
  const doctors = [
    { name: 'Self / Direct Walk-in', specialty: 'General', degree: 'MBBS', mobile: '9999999999', commissionPct: 0 },
    { name: 'Dr. Rajesh Gupta', specialty: 'General Medicine', degree: 'MD (Med)', mobile: '9822012345', commissionPct: 10 },
    { name: 'Dr. Sunita Deshmukh', specialty: 'Gynecology & Obstetrics', degree: 'MBBS, DGO', mobile: '9822054321', commissionPct: 15 },
    { name: 'Dr. A. K. Sharma', specialty: 'Pathologist', degree: 'MD (Pathology)', mobile: '9811098765', commissionPct: 0 },
    { name: 'Dr. Pradeep Verma', specialty: 'Consultant Radiologist', degree: 'MD, DMRD', mobile: '9811012345', commissionPct: 0 }
  ];

  for (const doc of doctors) {
    const res = await fetch('https://medicalproject-backend.onrender.com/api/v1/doctors', {
      method: 'POST',
      headers,
      body: JSON.stringify(doc)
    });
    const d = await res.json();
    console.log(`Doctor [${doc.name}]:`, d.success ? 'Created (' + d.data.id + ')' : d.error?.message || d.message);
  }

  // 2. Seed Investigations
  const tests = [
    { code: 'CBC', name: 'Complete Blood Count (CBC / Hemogram)', department: 'Pathology', specimen: 'EDTA Whole Blood', rate: 350, tatHours: 4 },
    { code: 'LFT', name: 'Liver Function Test (LFT)', department: 'Biochemistry', specimen: 'Serum', rate: 650, tatHours: 6 },
    { code: 'KFT', name: 'Kidney Function Test (KFT / RFT)', department: 'Biochemistry', specimen: 'Serum', rate: 700, tatHours: 6 },
    { code: 'LIPID', name: 'Lipid Profile Screen', department: 'Biochemistry', specimen: 'Serum (Fasting)', rate: 600, tatHours: 6 },
    { code: 'BS-F', name: 'Blood Sugar Fasting', department: 'Biochemistry', specimen: 'Fluoride Plasma', rate: 100, tatHours: 2 },
    { code: 'BS-PP', name: 'Blood Sugar Post Prandial', department: 'Biochemistry', specimen: 'Fluoride Plasma', rate: 100, tatHours: 2 },
    { code: 'HBA1C', name: 'HbA1c (Glycosylated Hemoglobin)', department: 'Biochemistry', specimen: 'EDTA Whole Blood', rate: 450, tatHours: 4 },
    { code: 'THYROID', name: 'Thyroid Profile Total (T3, T4, TSH)', department: 'Biochemistry', specimen: 'Serum', rate: 500, tatHours: 6 },
    { code: 'URINE-RE', name: 'Urine Routine & Microscopic Examination', department: 'Clinical Pathology', specimen: 'Spot Urine', rate: 150, tatHours: 2 },
    { code: 'WIDAL', name: 'Widal Slide Agglutination Test', department: 'Serology', specimen: 'Serum', rate: 200, tatHours: 3 },
    { code: 'USG-ABD', name: 'Ultrasound Whole Abdomen & Pelvis', department: 'Radiology', specimen: 'Diagnostic Scan', rate: 1200, tatHours: 1 },
    { code: 'USG-PELVIS', name: 'Ultrasound Pelvis / Lower Abdomen', department: 'Radiology', specimen: 'Diagnostic Scan', rate: 1000, tatHours: 1 },
    { code: 'XRAY-CHEST', name: 'Digital X-Ray Chest PA View', department: 'Radiology', specimen: 'Digital Radiography', rate: 400, tatHours: 1 },
    { code: 'CT-BRAIN', name: 'CT Brain (Plain / Non-Contrast)', department: 'Radiology', specimen: 'CT Imaging', rate: 2500, tatHours: 2 },
    { code: 'CT-CHEST', name: 'CT High Resolution Chest (HRCT)', department: 'Radiology', specimen: 'CT Imaging', rate: 3500, tatHours: 2 },
    { code: 'BIOPSY-IHC', name: 'Skin Biopsy Histopathology & IHC', department: 'Histopathology', specimen: 'Tissue Biopsy', rate: 1800, tatHours: 48 },
    { code: 'HLA-B27', name: 'HLA B27 PCR DNA Testing', department: 'Molecular Biology', specimen: 'EDTA Whole Blood', rate: 2200, tatHours: 24 }
  ];

  for (const t of tests) {
    const res = await fetch('https://medicalproject-backend.onrender.com/api/v1/masters/tests', {
      method: 'POST',
      headers,
      body: JSON.stringify(t)
    });
    const d = await res.json();
    console.log(`Test [${t.code} - ${t.name}]:`, d.success ? 'Created (' + d.data.id + ')' : d.error?.message || d.message);
  }

  console.log('Seeding finished successfully!');
}

run().catch(console.error);
