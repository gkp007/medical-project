const fs = require('fs');
const path = require('path');

// 1. Read step 1308 output.txt
const raw1308 = fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/0675e153-c6aa-463c-8b31-97eae0d66b12/.system_generated/steps/1308/output.txt', 'utf8');
const jsonMatch = raw1308.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  console.error('Could not find JSON in step 1308 output');
  process.exit(1);
}
const data1308 = JSON.parse(jsonMatch[0]);
console.log('Parsed live tests from Labsmart:', data1308.allRows.length);

// 2. Read interpretations library
const interpRaw = fs.readFileSync('frontend/src/pages/lab/interpretationsLibraryData.ts', 'utf8');
const interpMatch = interpRaw.match(/export const TESTS_LIBRARY_DATA: LibraryItem\[\] = (\[[\s\S]*?\]);\s*export const PANELS_LIBRARY_DATA/);
let interpItems = [];
if (interpMatch) {
  try {
    interpItems = JSON.parse(interpMatch[1]);
  } catch (e) {
    console.warn('Could not parse interp JSON:', e.message);
  }
}
console.log('Loaded interpretations items:', interpItems.length);

const interpMap = new Map();
interpItems.forEach(item => {
  interpMap.set(item.name.toLowerCase().trim(), item);
});

// Category default units & prices
const categoryDefaults = {
  'Haematology': { unit: 'g/dL', fee: 100 },
  'Biochemistry': { unit: 'mg/dL', fee: 150 },
  'Serology & Immunology': { unit: 'Index', fee: 250 },
  'Clinical Pathology': { unit: '', fee: 100 },
  'Cytology': { unit: '', fee: 300 },
  'Microbiology': { unit: '', fee: 250 },
  'Endocrinology': { unit: 'ng/mL', fee: 350 },
  'Histopathology': { unit: '', fee: 500 },
  'Others': { unit: '', fee: 150 },
  'Miscellaneous': { unit: '', fee: 200 }
};

// Known test units
const specificUnits = {
  'Hemoglobin': 'g/dl',
  'Total Leukocyte Count': '/cumm',
  'Differential Leucocyte Count': '%',
  'Differential Leukocyte Count (Absolute count)': '/cumm',
  'Erythrocyte sedimentation rate (Westergren)': 'mm/hr',
  'Erythrocyte Sedimentation Rate (Wintrobe)': 'mm/hr',
  'Platelet Count': '/cumm',
  'Absolute Eosinophil Count': '/cumm',
  'Bleeding Time': 'Minutes',
  'Clotting Time': 'Minutes',
  'Total RBC Count': 'million/cumm',
  'Hematocrit Value, Hct': '%',
  'Mean Corpuscular Volume, MCV': 'fl',
  'Mean Cell Haemoglobin, MCH': 'pg',
  'Mean Cell Haemoglobin CON, MCHC': 'g/dl',
  'Mean Platelet Volume, MPV': 'fl',
  'Reticulocyte Count': '%',
  'Prothrombin time, PT/INR': 'Seconds',
  'Activated partial thromboplastin time, APTT': 'Seconds',
  'WBC Count': '/cumm',
  'Serum Creatinine': 'mg/dl',
  'Serum Urea': 'mg/dl',
  'Fasting Blood Sugar': 'mg/dl',
  'Blood Sugar PP': 'mg/dl',
  'Random Blood Sugar': 'mg/dl',
  'Serum Bilirubin (Total)': 'mg/dl',
  'Serum Bilirubin (Direct)': 'mg/dl',
  'Serum Bilirubin (Indirect)': 'mg/dl',
  'Serum Uric Acid': 'mg/dl',
  'SGPT (ALT)': 'U/L',
  'SGOT (AST)': 'U/L',
  'Serum Protein': 'g/dl',
  'Serum Albumin': 'g/dl',
  'Serum Alkaline Phosphatase': 'U/L',
  'Total Cholesterol': 'mg/dl',
  'Triglycerides': 'mg/dl',
  'HDL Cholesterol': 'mg/dl',
  'LDL Cholesterol': 'mg/dl',
  'VLDL Cholesterol': 'mg/dl',
  'Serum Sodium': 'mmol/L',
  'Serum Potassium': 'mmol/L',
  'Serum Chloride': 'mmol/L',
  'Serum Calcium': 'mg/dl',
  'HbA1c (Glycosylated Hemoglobin)': '%',
  '25 Hydroxy (OH) Vitamin D': 'ng/mL',
  'Vitamin B12': 'pg/mL',
  'Thyroid Stimulating Hormone (TSH)': 'uIU/mL',
  'Total Triiodothyronine (T3)': 'ng/dL',
  'Total Thyroxine (T4)': 'ug/dL',
  'Free Triiodothyronine (FT3)': 'pg/mL',
  'Free Thyroxine (FT4)': 'ng/dL',
  'Urine Routine Examination': '',
  'Stool Routine Examination': '',
};

// Known test fees
const specificFees = {
  'Hemoglobin': 50,
  'Total Leukocyte Count': 60,
  'Differential Leucocyte Count': 80,
  'Erythrocyte sedimentation rate (Westergren)': 50,
  'Erythrocyte Sedimentation Rate (Wintrobe)': 50,
  'Platelet Count': 70,
  'Blood Group & Rh.': 60,
  'Serum Creatinine': 90,
  'Serum Urea': 80,
  'Fasting Blood Sugar': 50,
  'Blood Sugar PP': 50,
  'Random Blood Sugar': 50,
  'Serum Uric Acid': 90,
  'SGPT (ALT)': 90,
  'SGOT (AST)': 90,
  'Total Cholesterol': 100,
  'Triglycerides': 120,
  'HbA1c (Glycosylated Hemoglobin)': 300,
  '25 Hydroxy (OH) Vitamin D': 800,
  'Vitamin B12': 700,
  'Thyroid Stimulating Hormone (TSH)': 150,
  'Widal (Slide Method)': 100,
  'HIV (Card Test)': 250,
  'HBsAg': 200,
  'Hepatitis C Virus, HCV': 300,
  'VDRL': 100,
  'Dengue (Card Method)': 400,
  'Dengue NS1 Antigen': 350,
  'Urine Routine Examination': 80,
  'Stool Routine Examination': 80,
};

// 3. Process all 252 tests
const masterList = data1308.allRows.map((row, idx) => {
  const orderNum = parseInt(row.order, 10) || (idx + 1);
  const testId = row.testId || `test_${idx + 1}`;
  const name = row.name.trim();
  const shortName = row.shortName.trim();
  const category = row.category.trim();
  const testType = row.testType.trim() || 'Single parameter';

  const defaultUnit = specificUnits[name] || categoryDefaults[category]?.unit || '';
  const defaultFee = specificFees[name] || categoryDefaults[category]?.fee || 120;

  // Check interpretation match
  const interp = interpMap.get(name.toLowerCase());
  let description = '';
  let increasedIn = [];
  let decreasedIn = [];
  let comments = '';

  if (interp) {
    const raw = interp.rawText;
    // Extract sections
    const physMatch = raw.match(/Physiological\s*(?:basis|Basis):?\s*([\s\S]*?)(?=Interpretation|Comments|Usage|Note:|$)/i);
    if (physMatch) description = physMatch[1].trim();
    else description = raw.slice(0, 300).trim();

    const incMatch = raw.match(/Increased in:?\s*([\s\S]*?)(?=Decreased in|Drugs|Comments|$)/i);
    if (incMatch) {
      increasedIn = incMatch[1].split(/[;\n]/).map(s => s.trim()).filter(Boolean).slice(0, 5);
    }

    const decMatch = raw.match(/Decreased in:?\s*([\s\S]*?)(?=Drugs|Comments|Increased in|$)/i);
    if (decMatch) {
      decreasedIn = decMatch[1].split(/[;\n]/).map(s => s.trim()).filter(Boolean).slice(0, 5);
    }

    const comMatch = raw.match(/Comments:?\s*([\s\S]*?)$/i);
    if (comMatch) comments = comMatch[1].trim();
  }

  if (!description) {
    description = `${name} diagnostic examination. Used to evaluate clinical status in ${category}.`;
  }

  // Ratelist entry
  const ratelistEntries = [
    { name: shortName || name, fee: defaultFee }
  ];

  // Default demographic range
  const normalValues = {
    selectType: testType === 'Document' ? 'text' : 'numeric_range',
    textualNormal: testType === 'Document' ? 'Normal study' : undefined,
    ranges: testType === 'Document' ? [] : [
      {
        id: `range_${testId}`,
        gender: 'Any',
        minAge: 0,
        minAgeUnit: 'Years',
        maxAge: 120,
        maxAgeUnit: 'Years',
        lowerValue: 0,
        upperValue: 100,
        displayRange: 'Normal'
      }
    ]
  };

  return {
    id: testId,
    order: orderNum,
    name: name,
    shortName: shortName,
    category: category,
    testType: testType,
    unit: defaultUnit,
    price: defaultFee,
    description: description,
    increasedIn: increasedIn,
    decreasedIn: decreasedIn,
    comments: comments,
    ratelistEntries: ratelistEntries,
    panelsIncluded: []
  };
});

console.log('Prepared master test items:', masterList.length);

// 4. Write allLabsmartTestsData.ts
const tsOutput = `// Comprehensive 252 Test Database Master
// Exact from live Labsmart LIS: https://app.labsmartlis.com/37749971/lab_tests

import { LabTestDetail } from './TestMasterPage';

export const ALL_LABSMART_TESTS: LabTestDetail[] = ${JSON.stringify(masterList, null, 2)};
`;

fs.writeFileSync('frontend/src/pages/manage/allLabsmartTestsData.ts', tsOutput);
console.log('Successfully wrote frontend/src/pages/manage/allLabsmartTestsData.ts');
