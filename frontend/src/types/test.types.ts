export type Department =
  | 'Hematology'
  | 'Biochemistry'
  | 'Microbiology'
  | 'Serology'
  | 'Clinical Pathology'
  | 'Radiology'
  | 'Cytology'
  | 'Endocrinology'
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
  | (string & {});

export interface ParameterRange {
  minAge: number;
  maxAge: number;
  gender: 'All' | 'Male' | 'Female';
  lowerBound: number;
  upperBound: number;
  textualNormal?: string;
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
}

export interface InvestigationTest {
  id: string;
  code: string;
  name: string;
  department: Department;
  specimen: SpecimenType;
  container: string; // Lavender EDTA, Yellow Gel, etc.
  rate: number;
  b2bRate?: number;
  tatHours: number;
  parameters: TestParameter[];
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
