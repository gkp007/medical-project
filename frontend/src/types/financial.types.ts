export interface DailyBusinessSummary {
  date: string;
  grossSales: number;
  totalDiscounts: number;
  netRevenue: number;
  totalCollections: number;
  totalDues: number;
  totalCases: number;
  paymentBreakdown: {
    cash: number;
    upi: number;
    card: number;
    cheque: number;
  };
}

export interface ExpenseRecord {
  id: string;
  voucherNumber: string;
  date: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Cheque';
  receiptAttached?: boolean;
}
