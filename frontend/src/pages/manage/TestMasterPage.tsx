import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { mastersApi } from '../../services/api';
import {
  Plus,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Eye,
  Filter,
  ArrowLeft,
  Trash2,
  HelpCircle,
  Layers,
  FileText,
  Activity,
  ListOrdered,
  ChevronRight,
  Sparkles,
  Save,
  X,
} from 'lucide-react';

export type AgeUnit = 'Years' | 'Days' | 'Months';
export type RangeSex = 'Any' | 'Male' | 'Female' | 'Other';

export interface DemographicRange {
  id: string;
  gender: RangeSex;
  minAge: number;
  minAgeUnit: AgeUnit;
  maxAge: number;
  maxAgeUnit: AgeUnit;
  lowerValue: number;
  upperValue: number;
  displayRange: string;
}

export interface NormalValueConfig {
  selectType: 'numeric_range' | 'text';
  textualNormal?: string;
  ranges: DemographicRange[];
}

export interface TestSubParameter {
  id: string;
  order: number;
  name: string;
  unit: string;
  isOptional: boolean;
  inputType?: 'decimal' | 'string' | 'text';
  groupBy?: string;
  normalValues: NormalValueConfig;
}

export interface LabTestDetail {
  id: string;
  order: number;
  name: string;
  shortName: string;
  category: string;
  testType: 'Single parameter' | 'Multi parameter' | 'Multiple nested parameters' | 'Document' | 'Formula';
  unit?: string;
  price?: number;
  description?: string;
  increasedIn?: string[];
  decreasedIn?: string[];
  cellCauses?: Array<{ cell: string; increasedIn: string; decreasedIn: string }>;
  comments?: string;
  method?: string;
  instrument?: string;
  interpretation?: string;
  notes?: string;
  isAlwaysBold?: boolean;
  printLineAfter?: boolean;
  defaultResultText?: string;
  ratelistEntries?: Array<{ name: string; fee: number }>;
  panelsIncluded?: Array<{ name: string }>;
  parameters?: TestSubParameter[];
  normalValues?: NormalValueConfig;
}

const CATEGORIES = [
  'All',
  'Haematology',
  'Biochemistry',
  'Serology & Immunology',
  'Clinical Pathology',
  'Cytology',
  'Microbiology',
  'Endocrinology',
  'Histopathology',
  'Others',
  'Miscellaneous',
];

const INITIAL_TESTS: LabTestDetail[] = [
  {
    id: '6228737',
    order: 1,
    name: 'Hemoglobin',
    shortName: 'Hb',
    category: 'Haematology',
    testType: 'Single parameter',
    unit: 'g/dl',
    price: 50,
    description:
      'Hemoglobin is the major protein of erythrocytes that transports oxygen from the lungs to peripheral tissues. It is measured by spectrophotometry on automated instruments after lysis of red cells and conversion of all hemoglobin to cyanmethemoglobin.',
    increasedIn: [
      '1. Hemoconcentration (as in dehydration, Burns, vomiting)',
      '2. Polycythemia (erythrocytosis)',
      '3. Extreme physical exercise.',
    ],
    decreasedIn: [
      '1. Macrocytic anemia (liver disease, hypothyroidism, vitamin B 12 deficiency, folate deficiency, myelodysplasia)',
      '2. Normocytic anemia (early iron deficiency, anemia of chronic disease, hemolytic anemia, acute hemorrhage, bone marrow infiltration)',
      '3. Microcytic anemia (iron deficiency, thalassemia)',
      'Hemodilution',
    ],
    comments:
      'The cyanmethemoglobin technique is the method of choice selected by the International Committee for Standardization in Hematology. The method measures all hemoglobin derivatives except sulfhemoglobin by hemolyzing the specimen and adding a reducing agent. As such, this method does not distinguish between intracellular versus extracellular hemoglobin (hemolysis). Hypertriglyceridemia and very high white blood cell counts can cause false elevations of Hb.',
    ratelistEntries: [
      { name: 'Hb', fee: 50 },
      { name: 'HB, TLC, DLC', fee: 150 },
      { name: 'HB, TLC, DLC, ESR', fee: 230 },
      { name: 'Pregnancy Profile', fee: 100 },
    ],
    panelsIncluded: [
      { name: 'CBC with ESR' },
      { name: 'CBC (with absolute counts)' },
      { name: 'Complete Blood Count (CBC)' },
    ],
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: '6125428',
          gender: 'Any',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 21,
          maxAgeUnit: 'Days',
          lowerValue: 17,
          upperValue: 23,
          displayRange: '17 - 23',
        },
        {
          id: '6125429',
          gender: 'Any',
          minAge: 21,
          minAgeUnit: 'Days',
          maxAge: 10,
          maxAgeUnit: 'Years',
          lowerValue: 11.2,
          upperValue: 16.5,
          displayRange: '11.2 - 16.5',
        },
        {
          id: '6125431',
          gender: 'Female',
          minAge: 10,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 12,
          upperValue: 15,
          displayRange: '12 - 15',
        },
        {
          id: '6125430',
          gender: 'Male',
          minAge: 10,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 13,
          upperValue: 17,
          displayRange: '13 - 17',
        },
      ],
    },
  },
  {
    id: '6228738',
    order: 2,
    name: 'Total Leukocyte Count',
    shortName: 'TLC',
    category: 'Haematology',
    testType: 'Single parameter',
    unit: 'cumm',
    price: 50,
    description:
      'Total Leukocyte Count measures total circulating white blood cells responsible for immune response against infectious agents and inflammatory processes.',
    increasedIn: [
      '1. Bacterial and pyogenic infections, acute sepsis',
      '2. Inflammatory disorders, tissue necrosis, severe burns',
      '3. Leukemias, myeloproliferative disorders, leukemoid reactions',
    ],
    decreasedIn: [
      '1. Viral infections (influenza, dengue, typhoid, viral hepatitis)',
      '2. Bone marrow depression (chemotherapy, radiation, aplastic anemia)',
      '3. Autoimmune destruction and hypersplenism',
    ],
    comments:
      'Total count is enumerated by automated electrical impedance and light scattering. High nucleated red cells or unlysed platelets can trigger false elevations.',
    ratelistEntries: [
      { name: 'TLC', fee: 50 },
      { name: 'HB, TLC, DLC', fee: 150 },
      { name: 'HB, TLC, DLC, ESR', fee: 230 },
      { name: 'TLC DLC ESR', fee: 180 },
    ],
    panelsIncluded: [
      { name: 'CBC with ESR' },
      { name: 'CBC (with absolute counts)' },
      { name: 'Complete Blood Count (CBC)' },
    ],
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: '6125432',
          gender: 'Any',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 4000,
          upperValue: 11000,
          displayRange: '4,000 - 11,000',
        },
      ],
    },
  },
  {
    id: '6228739',
    order: 3,
    name: 'Differential Leucocyte Count',
    shortName: 'DLC',
    category: 'Haematology',
    testType: 'Multi parameter',
    price: 50,
    cellCauses: [
      {
        cell: 'Neutrophils',
        increasedIn:
          'Infection (bacterial or early viral), acute stress, acute and chronic inflammation, tumors, drugs (eg, G-CSF), diabetic ketoacidosis, leukemia (rare).',
        decreasedIn:
          'Aplastic anemia, drug-induced neutropenia, chemotherapy, folate or B12 deficiency, myelodysplasia, marrow infiltration, cyclic neutropenia, autoimmune or isoimmune neutropenia, Felty syndrome, hypersplenism, sepsis, viral marrow suppression, bone marrow failure syndromes.',
      },
      {
        cell: 'Lymphocytes',
        increasedIn:
          'Viral infection (especially infectious mononucleosis, pertussis), thyrotoxicosis, adrenal insufficiency, lymphoid leukemia/lymphoma, chronic infection, drug and allergic reactions, autoimmune diseases',
        decreasedIn: 'Immune deficiency syndromes (eg, HIV), idiopathic drugs.',
      },
      {
        cell: 'Monocytes',
        increasedIn:
          'Inflammation, infection, malignancy, tuberculosis, myeloproliferative disorders (eg, CMML)',
        decreasedIn: 'Depleted in overwhelming bacterial infection, hairy cell leukemia.',
      },
      {
        cell: 'Eosinophils',
        increasedIn:
          'Allergic states, asthma, drug sensitivity reactions, skin disorders, parasitic and certain fungal infections, Churg- Strauss syndrome, polyarteritis nodosa, response to malignancy (eg, Hodgkin disease, T-cell lymphoma, adenocarcinoma), eosinophilic pneumonia, hyper-eosinophilic syndrome, leukemia (eg, chronic eosinophilic leukemia), myeloid or lymphoid neoplasm with abnormalities of PDGF receptor (alpha or beta) or FGF receptor, mastocytosis',
        decreasedIn: 'Depleted in overwhelming bacterial infection, hairy cell leukemia',
      },
      {
        cell: 'Basophils',
        increasedIn:
          'Hypersensitivity reactions, drugs, myeloproliferative disorders (eg, CML), basophilic or mast cell variant of acute or chronic leukemia, inflammatory reaction, certain infections, hypothyroidism',
        decreasedIn: 'Not applicable.',
      },
    ],
    parameters: [
      {
        id: '9446441',
        order: 1,
        name: 'Neutrophils',
        unit: '%',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'r1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 40,
              upperValue: 70,
              displayRange: '40 - 70',
            },
          ],
        },
      },
      {
        id: '9446442',
        order: 2,
        name: 'Lymphocyte',
        unit: '%',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'r2',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 20,
              upperValue: 40,
              displayRange: '20 - 40',
            },
          ],
        },
      },
      {
        id: '9446443',
        order: 3,
        name: 'Eosinophils',
        unit: '%',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'r3',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 1,
              upperValue: 6,
              displayRange: '1 - 6',
            },
          ],
        },
      },
      {
        id: '9446444',
        order: 4,
        name: 'Monocytes',
        unit: '%',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'r4',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 1,
              upperValue: 4,
              displayRange: '1 - 4',
            },
          ],
        },
      },
      {
        id: '9446445',
        order: 5,
        name: 'Basophils',
        unit: '%',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'r5',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 0,
              upperValue: 2,
              displayRange: '< 2',
            },
          ],
        },
      },
    ],
    ratelistEntries: [
      { name: 'DLC', fee: 50 },
      { name: 'HB, TLC, DLC', fee: 150 },
      { name: 'HB, TLC, DLC, ESR', fee: 230 },
      { name: 'TLC DLC ESR', fee: 180 },
    ],
    panelsIncluded: [
      { name: 'CBC with Morphology' },
      { name: 'CBC with ESR' },
      { name: 'CBC (with absolute counts)' },
      { name: 'Complete Blood Count (CBC)' },
    ],
  },
  {
    id: '6228740',
    order: 4,
    name: 'Differential Leukocyte Count (Absolute count)',
    shortName: 'DLC (Abs)',
    category: 'Haematology',
    testType: 'Multi parameter',
    price: 80,
    parameters: [
      {
        id: 'p_anc',
        order: 1,
        name: 'Absolute Neutrophil Count (ANC)',
        unit: '/cumm',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'anc_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 2000,
              upperValue: 7000,
              displayRange: '2,000 - 7,000',
            },
          ],
        },
      },
      {
        id: 'p_alc',
        order: 2,
        name: 'Absolute Lymphocyte Count (ALC)',
        unit: '/cumm',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'alc_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 1000,
              upperValue: 3000,
              displayRange: '1,000 - 3,000',
            },
          ],
        },
      },
      {
        id: 'p_amc',
        order: 3,
        name: 'Absolute Monocyte Count',
        unit: '/cumm',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'amc_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 200,
              upperValue: 1000,
              displayRange: '200 - 1,000',
            },
          ],
        },
      },
      {
        id: 'p_aec',
        order: 4,
        name: 'Absolute Eosinophil Count',
        unit: '/cumm',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'aec_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 20,
              upperValue: 500,
              displayRange: '20 - 500',
            },
          ],
        },
      },
      {
        id: 'p_abc',
        order: 5,
        name: 'Absolute Basophil Count',
        unit: '/cumm',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'abc_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 0,
              upperValue: 100,
              displayRange: '0 - 100',
            },
          ],
        },
      },
    ],
    ratelistEntries: [{ name: 'CBC (with absolute counts)', fee: 250 }],
    panelsIncluded: [{ name: 'CBC (with absolute counts)' }],
  },
  {
    id: '6228741',
    order: 5,
    name: 'Erythrocyte sedimentation rate (Westergren)',
    shortName: 'ESR (Westergren)',
    category: 'Haematology',
    testType: 'Single parameter',
    unit: 'mm for 1st hour',
    price: 80,
    description:
      'The erythrocyte sedimentation rate (ESR) is a simple non-specific indicator of systemic inflammation, infection, autoimmune conditions, and tissue damage.',
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: 'esr_m1',
          gender: 'Male',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 50,
          maxAgeUnit: 'Years',
          lowerValue: 0,
          upperValue: 15,
          displayRange: '0 - 15',
        },
        {
          id: 'esr_m2',
          gender: 'Male',
          minAge: 50,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 0,
          upperValue: 20,
          displayRange: '0 - 20',
        },
        {
          id: 'esr_f1',
          gender: 'Female',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 50,
          maxAgeUnit: 'Years',
          lowerValue: 0,
          upperValue: 20,
          displayRange: '0 - 20',
        },
        {
          id: 'esr_f2',
          gender: 'Female',
          minAge: 50,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 0,
          upperValue: 30,
          displayRange: '0 - 30',
        },
      ],
    },
    ratelistEntries: [
      { name: 'ESR (Westergren)', fee: 80 },
      { name: 'CBC with ESR', fee: 280 },
      { name: 'HB, TLC, DLC, ESR', fee: 230 },
    ],
    panelsIncluded: [{ name: 'CBC with ESR' }],
  },
  {
    id: '6228746',
    order: 6,
    name: 'Platelet Count',
    shortName: 'PLT',
    category: 'Haematology',
    testType: 'Single parameter',
    unit: 'lakhs/cumm',
    price: 60,
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: 'plt_1',
          gender: 'Any',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 1.5,
          upperValue: 4.5,
          displayRange: '1,50,000 - 4,50,000',
        },
      ],
    },
    ratelistEntries: [{ name: 'Platelet Count', fee: 60 }],
    panelsIncluded: [{ name: 'Complete Blood Count (CBC)' }, { name: 'Dengue Comprehensive' }],
  },
  {
    id: '6228748',
    order: 7,
    name: 'Blood Group & Rh.',
    shortName: 'BG',
    category: 'Haematology',
    testType: 'Multi parameter',
    price: 50,
    description:
      'The ABO antigen and antibodies remain the most significant for transfusion practice. Routine ABO typing includes forward cell typing and reverse serum grouping.',
    parameters: [
      {
        id: '9446459',
        order: 1,
        name: 'ABO Group',
        unit: '',
        isOptional: false,
        normalValues: {
          selectType: 'text',
          textualNormal: 'A / B / AB / O Group',
          ranges: [],
        },
      },
      {
        id: '9446460',
        order: 2,
        name: 'Rh (ANTI -D)',
        unit: '',
        isOptional: false,
        normalValues: {
          selectType: 'text',
          textualNormal: 'Positive / Negative',
          ranges: [],
        },
      },
    ],
    ratelistEntries: [
      { name: 'Blood Group & Rh.', fee: 50 },
      { name: 'Pregnancy Profile', fee: 100 },
      { name: 'Preoperative Screening', fee: 250 },
    ],
    panelsIncluded: [{ name: 'Antenatal Profile' }, { name: 'Preoperative Profile' }],
  },
  {
    id: '6228751',
    order: 8,
    name: 'Peripheral Blood Smear',
    shortName: 'PBS / GBP',
    category: 'Haematology',
    testType: 'Document',
    price: 150,
    description:
      'Microscopic examination of Leishman-stained blood smear to assess red cell morphology, white cell differential, and platelet adequacy.',
    defaultResultText: `RBC MORPHOLOGY: Predominantly normocytic and normochromic. No significant anisopoikilocytosis.\nWBC MORPHOLOGY: Mature neutrophils, lymphocytes, and monocytes present in normal proportions. No blast cells or atypical mononuclear cells seen.\nPLATELETS: Adequate on smear with normal granularity and size.\nPARASITES: No malaria parasites or microfilariae identified in screened fields.\nIMPRESSION: Within normal biological limits.`,
    ratelistEntries: [{ name: 'Peripheral Blood Smear', fee: 150 }],
    panelsIncluded: [{ name: 'CBC with GBP' }],
  },
  {
    id: '6228774',
    order: 9,
    name: 'Fasting Blood Sugar',
    shortName: 'FBS',
    category: 'Biochemistry',
    testType: 'Single parameter',
    unit: 'mg/dl',
    price: 50,
    description:
      'Measures plasma glucose levels after an overnight fast (minimum 8-10 hours) for diagnosing diabetes mellitus and impaired fasting glycemia.',
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: 'fbs_1',
          gender: 'Any',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 70,
          upperValue: 100,
          displayRange: '70 - 100',
        },
      ],
    },
    ratelistEntries: [
      { name: 'Fasting Blood Sugar', fee: 50 },
      { name: 'Blood Sugar Fasting & PP', fee: 100 },
      { name: 'Diabetic package', fee: 100 },
    ],
    panelsIncluded: [{ name: 'Diabetic Profile' }, { name: 'Executive Health Checkup' }],
  },
  {
    id: '6228775',
    order: 10,
    name: 'Blood Sugar PP',
    shortName: 'PPBS',
    category: 'Biochemistry',
    testType: 'Single parameter',
    unit: 'mg/dl',
    price: 50,
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: 'ppbs_1',
          gender: 'Any',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 70,
          upperValue: 140,
          displayRange: '70 - 140',
        },
      ],
    },
    ratelistEntries: [
      { name: 'Blood Sugar PP', fee: 50 },
      { name: 'Blood Sugar Fasting & PP', fee: 100 },
    ],
    panelsIncluded: [{ name: 'Diabetic Profile' }],
  },
  {
    id: '6228778',
    order: 11,
    name: 'Serum Creatinine',
    shortName: 'CREAT',
    category: 'Biochemistry',
    testType: 'Single parameter',
    unit: 'mg/dl',
    price: 80,
    description:
      'Creatinine is a waste byproduct of muscle metabolism excreted by the kidneys. Critical marker for glomerular filtration and renal clearance assessment.',
    normalValues: {
      selectType: 'numeric_range',
      ranges: [
        {
          id: 'cr_m',
          gender: 'Male',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 0.7,
          upperValue: 1.3,
          displayRange: '0.7 - 1.3',
        },
        {
          id: 'cr_f',
          gender: 'Female',
          minAge: 0,
          minAgeUnit: 'Years',
          maxAge: 120,
          maxAgeUnit: 'Years',
          lowerValue: 0.5,
          upperValue: 1.1,
          displayRange: '0.5 - 1.1',
        },
      ],
    },
    ratelistEntries: [
      { name: 'Serum Creatinine', fee: 80 },
      { name: 'Kidney Function Test (KFT)', fee: 250 },
    ],
    panelsIncluded: [{ name: 'Kidney Function Test (KFT)' }, { name: 'Full Body Checkup' }],
  },
  {
    id: '6228780',
    order: 12,
    name: 'Urine Routine Examination',
    shortName: 'URINE-RE',
    category: 'Clinical Pathology',
    testType: 'Multiple nested parameters',
    price: 80,
    description:
      'Routine and microscopic urinalysis providing diagnostic information about renal function, metabolic status, urinary tract infection, and systemic disease.',
    parameters: [
      {
        id: 'u_color',
        order: 1,
        name: 'Color',
        unit: '',
        groupBy: 'Physical Examination',
        isOptional: false,
        normalValues: { selectType: 'text', textualNormal: 'Pale Yellow / Straw', ranges: [] },
      },
      {
        id: 'u_app',
        order: 2,
        name: 'Appearance',
        unit: '',
        groupBy: 'Physical Examination',
        isOptional: false,
        normalValues: { selectType: 'text', textualNormal: 'Clear', ranges: [] },
      },
      {
        id: 'u_sg',
        order: 3,
        name: 'Specific Gravity',
        unit: '',
        groupBy: 'Physical Examination',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'sg_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 1.005,
              upperValue: 1.03,
              displayRange: '1.005 - 1.030',
            },
          ],
        },
      },
      {
        id: 'u_ph',
        order: 4,
        name: 'Reaction (pH)',
        unit: '',
        groupBy: 'Chemical Examination',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'ph_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 4.5,
              upperValue: 8.0,
              displayRange: '4.5 - 8.0',
            },
          ],
        },
      },
      {
        id: 'u_alb',
        order: 5,
        name: 'Albumin / Protein',
        unit: '',
        groupBy: 'Chemical Examination',
        isOptional: false,
        normalValues: { selectType: 'text', textualNormal: 'Nil', ranges: [] },
      },
      {
        id: 'u_sug',
        order: 6,
        name: 'Sugar / Glucose',
        unit: '',
        groupBy: 'Chemical Examination',
        isOptional: false,
        normalValues: { selectType: 'text', textualNormal: 'Nil', ranges: [] },
      },
      {
        id: 'u_pus',
        order: 7,
        name: 'Pus Cells (WBCs)',
        unit: '/HPF',
        groupBy: 'Microscopic Examination',
        isOptional: false,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'pus_1',
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 0,
              upperValue: 5,
              displayRange: '0 - 5',
            },
          ],
        },
      },
      {
        id: 'u_rbc',
        order: 8,
        name: 'RBCs',
        unit: '/HPF',
        groupBy: 'Microscopic Examination',
        isOptional: false,
        normalValues: { selectType: 'text', textualNormal: 'Nil / HPF', ranges: [] },
      },
      {
        id: 'u_epi',
        order: 9,
        name: 'Epithelial Cells',
        unit: '/HPF',
        groupBy: 'Microscopic Examination',
        isOptional: false,
        normalValues: { selectType: 'text', textualNormal: '1 - 3 / HPF', ranges: [] },
      },
    ],
    ratelistEntries: [{ name: 'Urine Routine Examination', fee: 80 }],
    panelsIncluded: [{ name: 'Basic Urine Screen' }, { name: 'Full Body Checkup' }],
  },
];

export const TestMasterPage: React.FC = () => {
  const [tests, setTests] = useState<LabTestDetail[]>(INITIAL_TESTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Navigation mode: 'list' (Test Database) or 'detail' (view test)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [activeTest, setActiveTest] = useState<LabTestDetail | null>(null);

  // Normal value modal state
  const [isNormalValueModalOpen, setIsNormalValueModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<{
    testId: string;
    parameterId?: string;
    parameterName: string;
    config: NormalValueConfig;
  } | null>(null);

  // Normal value modal editable state
  const [modalSelectType, setModalSelectType] = useState<'numeric_range' | 'text'>('numeric_range');
  const [modalTextualNormal, setModalTextualNormal] = useState('');
  const [modalRanges, setModalRanges] = useState<DemographicRange[]>([]);

  // Add / Edit Test Metadata Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testModalMode, setTestModalMode] = useState<'create_select_type' | 'create_form' | 'edit'>('create_select_type');
  const [selectedNewType, setSelectedNewType] = useState<LabTestDetail['testType']>('Single parameter');

  // Form states for new/edit test
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formCategory, setFormCategory] = useState('Haematology');
  const [formUnit, setFormUnit] = useState('g/dl');
  const [formPrice, setFormPrice] = useState('50');
  const [formMethod, setFormMethod] = useState('');
  const [formInstrument, setFormInstrument] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formComments, setFormComments] = useState('');
  const [formInterpretation, setFormInterpretation] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formAlwaysBold, setFormAlwaysBold] = useState(false);
  const [formPrintLineAfter, setFormPrintLineAfter] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync with live backend tests if available
  useEffect(() => {
    const fetchLiveTests = async () => {
      try {
        const res = await mastersApi.listTests();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Merge backend tests with rich details
          setTests((prev) => {
            const updated = [...prev];
            res.data.forEach((backendTest: any) => {
              const existingIdx = updated.findIndex(
                (x) => x.id === backendTest.id || x.shortName === backendTest.code || x.name.toLowerCase() === backendTest.name.toLowerCase()
              );
              if (existingIdx >= 0) {
                updated[existingIdx] = {
                  ...updated[existingIdx],
                  id: backendTest.id,
                  price: backendTest.rate || updated[existingIdx].price,
                };
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.error('Failed to sync live tests:', err);
      }
    };
    fetchLiveTests();
  }, []);

  // Filtered tests in table
  const filteredTests = tests.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Open Normal Values Modal
  const handleOpenNormalValues = (test: LabTestDetail, subParam?: TestSubParameter) => {
    const targetName = subParam ? subParam.name : test.name;
    const currentConfig: NormalValueConfig = subParam
      ? subParam.normalValues
      : test.normalValues || {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'def_' + Date.now(),
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 0,
              upperValue: 100,
              displayRange: '0 - 100',
            },
          ],
        };

    setEditingTarget({
      testId: test.id,
      parameterId: subParam?.id,
      parameterName: targetName,
      config: currentConfig,
    });

    setModalSelectType(currentConfig.selectType);
    setModalTextualNormal(currentConfig.textualNormal || '');
    setModalRanges(
      currentConfig.ranges && currentConfig.ranges.length > 0
        ? JSON.parse(JSON.stringify(currentConfig.ranges))
        : [
            {
              id: 'range_' + Date.now(),
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 0,
              upperValue: 100,
              displayRange: '0 - 100',
            },
          ]
    );

    setIsNormalValueModalOpen(true);
  };

  // Add range row in modal
  const handleAddRangeRow = () => {
    const newRow: DemographicRange = {
      id: 'rng_' + Date.now(),
      gender: 'Any',
      minAge: 0,
      minAgeUnit: 'Years',
      maxAge: 120,
      maxAgeUnit: 'Years',
      lowerValue: 0,
      upperValue: 10,
      displayRange: '0 - 10',
    };
    setModalRanges([...modalRanges, newRow]);
  };

  // Delete range row
  const handleDeleteRangeRow = (index: number) => {
    if (modalRanges.length <= 1) {
      showToast('At least one demographic range is required.');
      return;
    }
    setModalRanges(modalRanges.filter((_, i) => i !== index));
  };

  // Update specific field in range row
  const handleRangeFieldChange = (index: number, field: keyof DemographicRange, value: any) => {
    setModalRanges((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };

      // Automatically sync displayRange if lower or upper value is changed and wasn't manually typed differently
      if (field === 'lowerValue' || field === 'upperValue') {
        const lower = field === 'lowerValue' ? value : target.lowerValue;
        const upper = field === 'upperValue' ? value : target.upperValue;
        if (!target.displayRange || target.displayRange.includes('-')) {
          target.displayRange = `${lower} - ${upper}`;
        }
      }

      updated[index] = target;
      return updated;
    });
  };

  // Save Normal Values
  const handleSaveNormalValues = async () => {
    if (!editingTarget) return;

    const newConfig: NormalValueConfig = {
      selectType: modalSelectType,
      textualNormal: modalSelectType === 'text' ? modalTextualNormal : undefined,
      ranges: modalSelectType === 'numeric_range' ? modalRanges : [],
    };

    // Update in local state
    setTests((prevTests) =>
      prevTests.map((t) => {
        if (t.id !== editingTarget.testId) return t;

        if (editingTarget.parameterId && t.parameters) {
          // Update subparameter
          return {
            ...t,
            parameters: t.parameters.map((p) =>
              p.id === editingTarget.parameterId ? { ...p, normalValues: newConfig } : p
            ),
          };
        } else {
          // Update standalone test
          return {
            ...t,
            normalValues: newConfig,
          };
        }
      })
    );

    // If active test is open in detail view, update activeTest state too
    if (activeTest && activeTest.id === editingTarget.testId) {
      if (editingTarget.parameterId && activeTest.parameters) {
        setActiveTest({
          ...activeTest,
          parameters: activeTest.parameters.map((p) =>
            p.id === editingTarget.parameterId ? { ...p, normalValues: newConfig } : p
          ),
        });
      } else {
        setActiveTest({
          ...activeTest,
          normalValues: newConfig,
        });
      }
    }

    // Attempt backend sync
    try {
      await mastersApi.updateNormalValues(editingTarget.testId, {
        parameterId: editingTarget.parameterId,
        selectType: newConfig.selectType,
        textualNormal: newConfig.textualNormal,
        ranges: newConfig.ranges.map((r) => ({
          gender: r.gender,
          minAge: r.minAge,
          minAgeUnit: r.minAgeUnit,
          maxAge: r.maxAge,
          maxAgeUnit: r.maxAgeUnit,
          lowerBound: r.lowerValue,
          upperBound: r.upperValue,
          displayRange: r.displayRange,
        })),
      });
    } catch (err) {
      console.warn('Backend sync for normal values (optimistic UI maintained):', err);
    }

    setIsNormalValueModalOpen(false);
    showToast(`Normal values for "${editingTarget.parameterName}" saved successfully.`);
  };

  // Open Edit Test Metadata Modal
  const handleOpenEditTest = (test: LabTestDetail) => {
    setFormName(test.name);
    setFormShortName(test.shortName);
    setFormCategory(test.category);
    setFormUnit(test.unit || 'g/dl');
    setFormPrice(String(test.price || 50));
    setFormMethod(test.method || '');
    setFormInstrument(test.instrument || '');
    setFormDescription(test.description || '');
    setFormComments(test.comments || '');
    setFormInterpretation(test.interpretation || '');
    setFormNotes(test.notes || '');
    setFormAlwaysBold(test.isAlwaysBold || false);
    setFormPrintLineAfter(test.printLineAfter || false);

    setTestModalMode('edit');
    setIsTestModalOpen(true);
  };

  // Open Create Test Flow
  const handleOpenCreateTest = () => {
    setSelectedNewType('Single parameter');
    setFormName('');
    setFormShortName('');
    setFormCategory('Haematology');
    setFormUnit('g/dl');
    setFormPrice('100');
    setFormMethod('');
    setFormInstrument('');
    setFormDescription('');
    setFormComments('');
    setFormInterpretation('');
    setFormNotes('');
    setFormAlwaysBold(false);
    setFormPrintLineAfter(false);

    setTestModalMode('create_select_type');
    setIsTestModalOpen(true);
  };

  // Save Test (New or Edit)
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (testModalMode === 'edit' && activeTest) {
      const updated: LabTestDetail = {
        ...activeTest,
        name: formName,
        shortName: formShortName,
        category: formCategory,
        unit: formUnit,
        price: Number(formPrice) || 50,
        method: formMethod,
        instrument: formInstrument,
        description: formDescription,
        comments: formComments,
        interpretation: formInterpretation,
        notes: formNotes,
        isAlwaysBold: formAlwaysBold,
        printLineAfter: formPrintLineAfter,
      };

      setTests((prev) => prev.map((t) => (t.id === activeTest.id ? updated : t)));
      setActiveTest(updated);
      showToast(`Updated test specification for "${formName}".`);
    } else {
      const newTest: LabTestDetail = {
        id: String(Date.now()),
        order: tests.length + 1,
        name: formName,
        shortName: formShortName || formName.substring(0, 4).toUpperCase(),
        category: formCategory,
        testType: selectedNewType,
        unit: formUnit,
        price: Number(formPrice) || 100,
        description: formDescription,
        comments: formComments,
        method: formMethod,
        instrument: formInstrument,
        interpretation: formInterpretation,
        notes: formNotes,
        isAlwaysBold: formAlwaysBold,
        printLineAfter: formPrintLineAfter,
        normalValues: {
          selectType: 'numeric_range',
          ranges: [
            {
              id: 'def_' + Date.now(),
              gender: 'Any',
              minAge: 0,
              minAgeUnit: 'Years',
              maxAge: 120,
              maxAgeUnit: 'Years',
              lowerValue: 0,
              upperValue: 100,
              displayRange: '0 - 100',
            },
          ],
        },
      };

      setTests([...tests, newTest]);
      showToast(`New test "${formName}" created and added to database.`);
    }

    setIsTestModalOpen(false);
  };

  // =========================================================================
  // VIEW: TEST SPECIFICATION DETAIL (Image 2)
  // =========================================================================
  if (viewMode === 'detail' && activeTest) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Toast */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={18} color="#22c55e" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: 0, fontWeight: 700 }}
          >
            MASTER TEST LIST
          </button>
          <span>/</span>
          <span>{activeTest.category}</span>
          <span>/</span>
          <span style={{ color: '#0f172a' }}>{activeTest.name}</span>
        </div>

        {/* Two-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Main Left Column: Test Specifications */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {/* Header: Title + Edit button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {activeTest.name} {activeTest.shortName ? `(${activeTest.shortName})` : ''}
                </h1>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEditTest(activeTest)}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Description */}
            {activeTest.description && (
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', marginBottom: '20px' }}>
                {activeTest.description}
              </p>
            )}

            {/* Clinical Significance Table (Single Parameter e.g. Hemoglobin) */}
            {activeTest.increasedIn && activeTest.decreasedIn && (
              <div style={{ marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ textAlign: 'left', padding: '10px 14px', width: '50%', borderRight: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                        Increased in:
                      </th>
                      <th style={{ textAlign: 'left', padding: '10px 14px', width: '50%', color: '#0f172a', fontWeight: 700 }}>
                        Decreased in:
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ verticalAlign: 'top', padding: '12px 14px', borderRight: '1px solid #cbd5e1', color: '#334155', lineHeight: '1.6' }}>
                        {activeTest.increasedIn.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '4px' }}>{item}</div>
                        ))}
                      </td>
                      <td style={{ verticalAlign: 'top', padding: '12px 14px', color: '#334155', lineHeight: '1.6' }}>
                        {activeTest.decreasedIn.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '4px' }}>{item}</div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Cell Causes Table (Multi Parameter e.g. DLC) */}
            {activeTest.cellCauses && (
              <div style={{ marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ textAlign: 'left', padding: '10px 12px', width: '18%', borderRight: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                        CELLS
                      </th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', width: '41%', borderRight: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                        INCREASED IN
                      </th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', width: '41%', color: '#0f172a', fontWeight: 700 }}>
                        DECREASED IN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTest.cellCauses.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a', borderRight: '1px solid #cbd5e1' }}>
                          {c.cell}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155', borderRight: '1px solid #cbd5e1', lineHeight: '1.5' }}>
                          {c.increasedIn}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#334155', lineHeight: '1.5' }}>
                          {c.decreasedIn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Comments Box */}
            {activeTest.comments && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Comments:
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  {activeTest.comments}
                </div>
              </div>
            )}

            {/* SINGLE PARAMETER NORMAL VALUES BLOCK */}
            {activeTest.testType === 'Single parameter' && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>UNIT: </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginLeft: '6px' }}>
                      {activeTest.unit || 'g/dl'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenNormalValues(activeTest)}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Edit normal values</span>
                  </button>
                </div>

                {/* Range summary preview */}
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Current Biological Reference Ranges:
                  </div>
                  {activeTest.normalValues?.selectType === 'text' ? (
                    <div style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                      Textual Normal: "{activeTest.normalValues.textualNormal || 'Negative'}"
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', fontSize: '11px', color: '#475569' }}>
                          <th style={{ padding: '6px 10px', textAlign: 'left' }}>SEX</th>
                          <th style={{ padding: '6px 10px', textAlign: 'left' }}>MIN AGE</th>
                          <th style={{ padding: '6px 10px', textAlign: 'left' }}>MAX AGE</th>
                          <th style={{ padding: '6px 10px', textAlign: 'left' }}>LOWER</th>
                          <th style={{ padding: '6px 10px', textAlign: 'left' }}>UPPER</th>
                          <th style={{ padding: '6px 10px', textAlign: 'left' }}>DISPLAYED IN REPORT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTest.normalValues?.ranges || []).map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                            <td style={{ padding: '6px 10px', fontWeight: 600 }}>{r.gender}</td>
                            <td style={{ padding: '6px 10px' }}>{r.minAge} {r.minAgeUnit}</td>
                            <td style={{ padding: '6px 10px' }}>{r.maxAge} {r.maxAgeUnit}</td>
                            <td style={{ padding: '6px 10px' }}>{r.lowerValue}</td>
                            <td style={{ padding: '6px 10px' }}>{r.upperValue}</td>
                            <td style={{ padding: '6px 10px', color: '#0284c7', fontWeight: 600 }}>
                              {r.displayRange || `${r.lowerValue} - ${r.upperValue}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* MULTI PARAMETER SUBTESTS TABLE (e.g. DLC, Blood Group) */}
            {activeTest.parameters && activeTest.parameters.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    Parameters ({activeTest.parameters.length}):
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Reorder parameters by drag 'n' drop
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ width: '60px', padding: '8px 12px', textAlign: 'left' }}>ORDER</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>NAME</th>
                      <th style={{ width: '90px', padding: '8px 12px', textAlign: 'left' }}>OPTIONAL</th>
                      <th style={{ width: '80px', padding: '8px 12px', textAlign: 'left' }}>UNIT</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>NORMAL VALUE</th>
                      <th style={{ width: '150px', padding: '8px 12px', textAlign: 'center' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTest.parameters.map((p, idx) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{idx + 1}.</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{p.isOptional ? 'Yes' : 'No'}</td>
                        <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 500 }}>{p.unit || '—'}</td>
                        <td style={{ padding: '10px 12px', color: '#0284c7', fontWeight: 600 }}>
                          {p.normalValues.selectType === 'text'
                            ? p.normalValues.textualNormal || 'Textual'
                            : p.normalValues.ranges[0]?.displayRange ||
                              `${p.normalValues.ranges[0]?.lowerValue} - ${p.normalValues.ranges[0]?.upperValue}`}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenNormalValues(activeTest, p)}
                            style={{
                              backgroundColor: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Edit2 size={11} />
                            <span>Edit normal values</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* DOCUMENT DEFAULT RESULT PREVIEW */}
            {activeTest.testType === 'Document' && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Default Template Text:
                </div>
                <pre style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px', fontSize: '12px', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {activeTest.defaultResultText || 'No default template specified.'}
                </pre>
              </div>
            )}

            {/* Create similar test link */}
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedNewType(activeTest.testType);
                  setFormName(activeTest.name + ' (Copy)');
                  setFormShortName((activeTest.shortName || '') + '2');
                  setFormCategory(activeTest.category);
                  setFormUnit(activeTest.unit || 'g/dl');
                  setFormPrice(String(activeTest.price || 100));
                  setFormDescription(activeTest.description || '');
                  setFormComments(activeTest.comments || '');
                  setTestModalMode('create_form');
                  setIsTestModalOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} />
                <span>Create similar test</span>
              </button>
            </div>
          </div>

          {/* Right Column: Ratelist & Panel Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Card 1: Available in ratelist under names */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Available in ratelist under names:
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ width: '40px', padding: '6px 8px', textAlign: 'left' }}>S. NO.</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>NAME</th>
                    <th style={{ width: '60px', padding: '6px 8px', textAlign: 'right' }}>FEE</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTest.ratelistEntries || [{ name: activeTest.name, fee: activeTest.price || 50 }]).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '8px', color: '#64748b' }}>{i + 1}.</td>
                      <td style={{ padding: '8px', fontWeight: 600, color: '#0284c7' }}>{r.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{r.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => showToast('Linked to ratelist entry.')}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} />
                  <span>Link to ratelist entry</span>
                </button>
              </div>
            </div>

            {/* Card 2: Available in panels under names */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Available in panels under names:
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ width: '40px', padding: '6px 8px', textAlign: 'left' }}>S. NO.</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>NAME</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTest.panelsIncluded || []).length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: '10px', color: '#94a3b8', fontStyle: 'italic' }}>
                        Not mapped to any panels yet.
                      </td>
                    </tr>
                  ) : (
                    activeTest.panelsIncluded!.map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '8px', color: '#64748b' }}>{i + 1}</td>
                        <td style={{ padding: '8px', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Edit Normal Values */}
        {renderNormalValueModal()}
        {renderTestModal()}
      </div>
    );
  }

  // =========================================================================
  // VIEW: TEST DATABASE MASTER LIST (Image 1)
  // =========================================================================
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Test database
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => showToast('Opening Labsmart global test library import...')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={15} color="#0284c7" />
            <span>Import</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreateTest}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0284c7', borderColor: '#0284c7' }}
          >
            <Plus size={15} />
            <span>Add new</span>
          </button>
        </div>
      </div>

      {/* Advisory Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          fontSize: '13px',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          <strong>Important: </strong> It is required that your laboratory proofreads and updates the provided reference range before using it for printing lab reports.
        </div>
      </div>

      {/* Horizontal Category Filter Strip */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={13} />
          <span>Filter by category:</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'thin',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search in page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Test Database Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '70px' }}>ORDER</th>
              <th>NAME</th>
              <th style={{ width: '150px' }}>SHORT NAME</th>
              <th style={{ width: '160px' }}>TEST TYPE</th>
              <th style={{ width: '180px' }}>CATEGORY</th>
              <th style={{ width: '140px', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No tests found matching "{searchQuery}" in category "{selectedCategory}".
                </td>
              </tr>
            ) : (
              filteredTests.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{idx + 1}.</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                      {t.name}
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                    {t.shortName || '-'}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor:
                          t.testType === 'Single parameter'
                            ? '#eff6ff'
                            : t.testType === 'Multi parameter' || t.testType === 'Multiple nested parameters'
                            ? '#f0fdf4'
                            : '#fef3c7',
                        color:
                          t.testType === 'Single parameter'
                            ? '#1d4ed8'
                            : t.testType === 'Multi parameter' || t.testType === 'Multiple nested parameters'
                            ? '#15803d'
                            : '#b45309',
                      }}
                    >
                      {t.testType}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditTest(t)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTest(t);
                          setViewMode('detail');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {renderNormalValueModal()}
      {renderTestModal()}
    </div>
  );

  // =========================================================================
  // MODAL: NORMAL VALUE MODAL (Image 3)
  // =========================================================================
  function renderNormalValueModal() {
    if (!isNormalValueModalOpen || !editingTarget) return null;

    return (
      <Modal
        isOpen={isNormalValueModalOpen}
        onClose={() => setIsNormalValueModalOpen(false)}
        title={`Normal value - ${editingTarget.parameterName}`}
        size="lg"
      >
        <div style={{ padding: '4px 0' }}>
          {/* Select Type Dropdown */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Select type
            </label>
            <select
              value={modalSelectType}
              onChange={(e) => setModalSelectType(e.target.value as any)}
              className="select-control"
              style={{ width: '220px', height: '36px', fontSize: '13px' }}
            >
              <option value="numeric_range">Numeric range</option>
              <option value="text">Text</option>
            </select>
          </div>

          {/* Conditional Body: Numeric range vs Text */}
          {modalSelectType === 'numeric_range' ? (
            <div>
              {/* Range Table */}
              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ color: '#475569', fontSize: '11px', fontWeight: 600, borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ width: '30px', padding: '6px' }}></th>
                      <th style={{ width: '100px', padding: '6px', textAlign: 'left' }}>* Sex</th>
                      <th style={{ width: '140px', padding: '6px', textAlign: 'left' }}>* Min. age</th>
                      <th style={{ width: '140px', padding: '6px', textAlign: 'left' }}>* Max. age</th>
                      <th style={{ width: '100px', padding: '6px', textAlign: 'left' }}>* Lower value</th>
                      <th style={{ width: '100px', padding: '6px', textAlign: 'left' }}>* Upper value</th>
                      <th style={{ padding: '6px', textAlign: 'left' }}>Displayed in report as</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalRanges.map((row, idx) => (
                      <tr key={row.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* Delete row */}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteRangeRow(idx)}
                            title="Delete tier"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={14} className="hover:text-red-500" />
                          </button>
                        </td>

                        {/* Sex */}
                        <td style={{ padding: '6px' }}>
                          <select
                            value={row.gender}
                            onChange={(e) => handleRangeFieldChange(idx, 'gender', e.target.value)}
                            className="select-control"
                            style={{ height: '32px', fontSize: '12px' }}
                          >
                            <option value="Any">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>

                        {/* Min Age (Number + Unit) */}
                        <td style={{ padding: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="number"
                              min="0"
                              value={row.minAge}
                              onChange={(e) => handleRangeFieldChange(idx, 'minAge', Number(e.target.value))}
                              className="input-control"
                              style={{ width: '55px', height: '32px', fontSize: '12px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            />
                            <select
                              value={row.minAgeUnit}
                              onChange={(e) => handleRangeFieldChange(idx, 'minAgeUnit', e.target.value)}
                              className="select-control"
                              style={{ width: '75px', height: '32px', fontSize: '11px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }}
                            >
                              <option value="Days">Days</option>
                              <option value="Months">Months</option>
                              <option value="Years">Years</option>
                            </select>
                          </div>
                        </td>

                        {/* Max Age (Number + Unit) */}
                        <td style={{ padding: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="number"
                              min="0"
                              value={row.maxAge}
                              onChange={(e) => handleRangeFieldChange(idx, 'maxAge', Number(e.target.value))}
                              className="input-control"
                              style={{ width: '55px', height: '32px', fontSize: '12px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            />
                            <select
                              value={row.maxAgeUnit}
                              onChange={(e) => handleRangeFieldChange(idx, 'maxAgeUnit', e.target.value)}
                              className="select-control"
                              style={{ width: '75px', height: '32px', fontSize: '11px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }}
                            >
                              <option value="Days">Days</option>
                              <option value="Months">Months</option>
                              <option value="Years">Years</option>
                            </select>
                          </div>
                        </td>

                        {/* Lower value */}
                        <td style={{ padding: '6px' }}>
                          <input
                            type="number"
                            step="any"
                            value={row.lowerValue}
                            onChange={(e) => handleRangeFieldChange(idx, 'lowerValue', parseFloat(e.target.value) || 0)}
                            className="input-control"
                            style={{ height: '32px', fontSize: '12px' }}
                          />
                        </td>

                        {/* Upper value */}
                        <td style={{ padding: '6px' }}>
                          <input
                            type="number"
                            step="any"
                            value={row.upperValue}
                            onChange={(e) => handleRangeFieldChange(idx, 'upperValue', parseFloat(e.target.value) || 0)}
                            className="input-control"
                            style={{ height: '32px', fontSize: '12px' }}
                          />
                        </td>

                        {/* Displayed in report as */}
                        <td style={{ padding: '6px' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={row.displayRange}
                              onChange={(e) => handleRangeFieldChange(idx, 'displayRange', e.target.value)}
                              placeholder={`${row.lowerValue} - ${row.upperValue}`}
                              className="input-control"
                              style={{ height: '32px', fontSize: '12px', paddingRight: '24px' }}
                            />
                            <Edit2 size={11} style={{ position: 'absolute', right: '8px', color: '#94a3b8', pointerEvents: 'none' }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add more button */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={handleAddRangeRow}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={14} />
                  <span>Add more</span>
                </button>
              </div>
            </div>
          ) : (
            /* Textual Normal Value Form */
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Normal Value / Finding text
              </label>
              <textarea
                rows={4}
                value={modalTextualNormal}
                onChange={(e) => setModalTextualNormal(e.target.value)}
                placeholder="e.g. Negative, Non-reactive, Nil, A / B / AB / O Positive"
                className="input-control"
                style={{ fontSize: '13px', padding: '10px' }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                This exact text will be displayed under the reference range column on patient diagnostic reports.
              </span>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsNormalValueModalOpen(false)}
              style={{ fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveNormalValues}
              style={{ fontSize: '13px', backgroundColor: '#0284c7', borderColor: '#0284c7' }}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // =========================================================================
  // MODAL: ADD / EDIT TEST FORM (Labsmart /lab_tests/select_type flow)
  // =========================================================================
  function renderTestModal() {
    if (!isTestModalOpen) return null;

    if (testModalMode === 'create_select_type') {
      return (
        <Modal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          title="Select type of test result"
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '6px 0' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Choose the structural type of test result template:
            </p>

            {/* Type 1: Single Parameter */}
            <div
              onClick={() => {
                setSelectedNewType('Single parameter');
                setTestModalMode('create_form');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.15s ease',
              }}
              className="hover:border-blue-500 hover:bg-blue-50"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Single parameter</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Eg. HB, TLC, Serum Creatinine, Fasting Blood Sugar</div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            {/* Type 2: Multiple Parameters */}
            <div
              onClick={() => {
                setSelectedNewType('Multi parameter');
                setTestModalMode('create_form');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.15s ease',
              }}
              className="hover:border-blue-500 hover:bg-blue-50"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Multiple parameters</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Eg. DLC, Blood group, Widal, Lipid Profile</div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            {/* Type 3: Multiple Nested Parameters */}
            <div
              onClick={() => {
                setSelectedNewType('Multiple nested parameters');
                setTestModalMode('create_form');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.15s ease',
              }}
              className="hover:border-blue-500 hover:bg-blue-50"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Multiple nested parameters</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Eg. Urine routine (Physical, Chemical, Microscopic), Semen Examination</div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            {/* Type 4: Document */}
            <div
              onClick={() => {
                setSelectedNewType('Document');
                setTestModalMode('create_form');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.15s ease',
              }}
              className="hover:border-blue-500 hover:bg-blue-50"
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                4
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Document</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Eg. FNAC, Peripheral Blood Smear, Histopathology, Culture & Sensitivity reports</div>
              </div>
              <ChevronRight size={18} color="#94a3b8" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsTestModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title={testModalMode === 'edit' ? `Edit Test: ${activeTest?.name}` : `New Test (${selectedNewType})`}
        size="lg"
      >
        <form onSubmit={handleSaveTest} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '6px' }}>
          {/* Row 1: Name + Short name */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Test Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hemoglobin"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Short Name / Code
              </label>
              <input
                type="text"
                placeholder="e.g. Hb"
                value={formShortName}
                onChange={(e) => setFormShortName(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          {/* Row 2: Category + Unit + Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="select-control"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Primary Unit
              </label>
              <input
                type="text"
                placeholder="e.g. g/dl, %, mg/dl"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                className="input-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Default Price (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          {/* Row 3: Method + Instrument */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Method</label>
              <input
                type="text"
                placeholder="e.g. Cyanmethemoglobin, Westergren"
                value={formMethod}
                onChange={(e) => setFormMethod(e.target.value)}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Instrument</label>
              <input
                type="text"
                placeholder="e.g. Mindray BC-5000, Erba Chem 5x"
                value={formInstrument}
                onChange={(e) => setFormInstrument(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Clinical Description</label>
            <textarea
              rows={2}
              placeholder="Clinical context and diagnostic significance..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="input-control"
              style={{ fontSize: '12px' }}
            />
          </div>

          {/* Comments & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Comments (Methodology / Pre-analytical)</label>
              <textarea
                rows={2}
                placeholder="Interferences, standardization, etc."
                value={formComments}
                onChange={(e) => setFormComments(e.target.value)}
                className="input-control"
                style={{ fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Internal Notes</label>
              <textarea
                rows={2}
                placeholder="Internal lab instructions..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="input-control"
                style={{ fontSize: '12px' }}
              />
            </div>
          </div>

          {/* Formatting check options */}
          <div style={{ display: 'flex', gap: '20px', padding: '6px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formAlwaysBold}
                onChange={(e) => setFormAlwaysBold(e.target.checked)}
              />
              <span>Always bold in report</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formPrintLineAfter}
                onChange={(e) => setFormPrintLineAfter(e.target.checked)}
              />
              <span>Print line after test</span>
            </label>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}>
              {testModalMode === 'edit' ? 'Save Changes' : 'Create Test'}
            </button>
          </div>
        </form>
      </Modal>
    );
  }
};
