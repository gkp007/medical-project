export type Gender = 'Male' | 'Female' | 'Other';
export type AgeUnit = 'Years' | 'Months' | 'Days';
export type NamePrefix =
  | 'Mr'
  | 'Mrs'
  | 'Ms'
  | 'Dr'
  | 'Prof'
  | 'Master'
  | 'Baby'
  | 'Baby of'
  | 'Smt'
  | 'Sri'
  | 'Md'
  | 'Col'
  | 'Major'
  | 'Capt'
  | 'Brig'
  | 'Sister'
  | 'Rev'
  | 'Father'
  | 'Sheikh'
  | 'Advocate'
  | 'Justice'
  | 'Swami'
  | 'Shri'
  | 'Late'
  | string;

export interface Patient {
  id: string;
  uhid: string;
  prefix: NamePrefix;
  fullName: string;
  age: number;
  ageUnit: AgeUnit;
  gender: Gender;
  mobile: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  totalVisits: number;
  lastVisitDate: string;
}
