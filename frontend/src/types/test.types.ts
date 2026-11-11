export type Department =
  | 'Haematology'
  | 'Hematology'
  | 'Biochemistry'
  | 'Microbiology'
  | 'Serology & Immunology'
  | 'Serology'
  | 'Clinical Pathology'
  | 'Radiology'
  | 'Cytology'
  | 'Endocrinology'
  | 'Histopathology'
  | 'Others'
  | 'Miscellaneous'
  | 'CT Scan'
  | 'Cardiology'
  | 'Neurology'
  | (string & {});

export type SpecimenType =
  | 'EDTA Whole Blood'
  | 'Serum'
  | 'Plasma'
  | 'Urine'
  | 'Stool'
  | 'Swab'
  | 'Radiological Imaging'
  | 'Digital Exposure'
  | (string & {});

export interface ParameterRange {
  id?: string;
  minAge: number;
  minAgeUnit?: 'Years' | 'Days' | 'Months';
  maxAge: number;
  maxAgeUnit?: 'Years' | 'Days' | 'Months';
  gender: 'All' | 'Any' | 'Male' | 'Female' | 'Other';
  lowerBound: number;
  upperBound: number;
  displayRange?: string; // e.g. "17 - 23", "< 2", "12 - 15"
  panicLower?: number;
  panicUpper?: number;
  textualNormal?: string;
  selectType?: 'numeric_range' | 'text';
}

export interface TestParameter {
  id: string;
  name: string;
  code: string;
  unit: string;
  method?: string;
  ranges: ParameterRange[];
  formula?: string; // e.g. '(PCV / RBC) * 10'
  isCalculated?: boolean;
  isOptional?: boolean;
  inputType?: 'decimal' | 'string' | 'text';
  defaultResult?: string;
  groupBy?: string;
  sortOrder?: number;
}

export interface InvestigationTest {
  id: string;
  code: string;
  name: string;
  shortName?: string;
  department: Department;
  testType: 'Single parameter' | 'Multi parameter' | 'Multiple nested parameters' | 'Document' | 'Formula';
  specimen: SpecimenType;
  container: string; // Lavender EDTA, Yellow Gel, etc.
  rate: number;
  b2bRate?: number;
  tatHours: number;
  description?: string;
  increasedIn?: string[];
  decreasedIn?: string[];
  comments?: string;
  method?: string;
  instrument?: string;
  interpretation?: string;
  notes?: string;
  isAlwaysBold?: boolean;
  printLineAfter?: boolean;
  parameters: TestParameter[];
  ratelistEntries?: Array<{ name: string; fee: number }>;
  panelsIncluded?: Array<{ name: string }>;
}

export interface SelectedInvestigation {
  testId: string;
  code: string;
  name: string;
  department: Department;
  specimen: SpecimenType;
  rate: number;
  discount: number;
  netAmount: number;
  deliveryTime: string;
}
