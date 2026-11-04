import { Patient } from './patient.types';
import { SelectedInvestigation } from './test.types';

export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Cheque' | 'Credit';
export type ReportStatus = 'Registered' | 'Sample Collected' | 'In Process' | 'Results Entered' | 'Signed Off';
export type PaymentStatus = 'Paid' | 'Partial' | 'Due';

export interface CaseRecord {
  id: string;
  billNumber: string;
  uhid: string;
  registeredAt: string;
  patient: Patient;
  referringDoctor: {
    id: string;
    name: string;
    degree?: string;
  };
  collectionCenter?: {
    id: string;
    name: string;
  };
  modality: 'LAB' | 'USG' | 'X-RAY' | 'CT SCAN';
  investigations: SelectedInvestigation[];
  financials: {
    grossAmount: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    discountReason?: string;
    netPayable: number;
    paidAmount: number;
    balanceDue: number;
    paymentMode: PaymentMode;
  };
  reportStatus: ReportStatus;
  paymentStatus: PaymentStatus;
  sampleStatus: 'Pending' | 'Collected' | 'Rejected';
  collectedAt?: string;
  reportedAt?: string;
  signedOffBy?: string;
}
