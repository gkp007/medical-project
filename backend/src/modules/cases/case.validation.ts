import { z } from 'zod';

export const createCaseSchema = z.object({
  patient: z.object({
    id: z.string().optional(),
    prefix: z.string().default('Mr'),
    fullName: z.string().min(2),
    age: z.number().int().min(0).max(130),
    ageYears: z.number().int().min(0).max(130).optional(),
    ageMonths: z.number().int().min(0).max(11).optional(),
    ageDays: z.number().int().min(0).max(31).optional(),
    ageUnit: z.string().default('Years'),
    gender: z.string().default('Male'),
    mobile: z.string().min(10),
    email: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    aadhaar: z.string().optional().or(z.literal('')),
    onlineReportRequested: z.boolean().optional(),
    bloodGroup: z.string().optional().or(z.literal(''))
  }),
  doctorId: z.string(),
  agentId: z.string().optional().nullable(),
  branchId: z.string().min(1).optional(),
  modality: z.string().default('LAB'),
  isUrgent: z.boolean().optional().default(false),
  collectionTime: z.string().optional(),
  investigations: z.array(z.object({
    testId: z.string(),
    discount: z.number().min(0).default(0)
  })).min(1, 'At least one investigation must be selected'),
  discountType: z.enum(['percentage', 'fixed']).default('fixed'),
  discountValue: z.number().min(0).default(0),
  discountReason: z.string().optional(),
  paidAmount: z.number().min(0).default(0),
  paymentMode: z.string().default('Cash'),
  allowDue: z.boolean().optional().default(false),
  notes: z.string().optional()
});

export const collectDueSchema = z.object({
  amount: z.number().positive('Payment amount must be greater than zero'),
  paymentMode: z.enum(['Cash', 'UPI', 'Card', 'Cheque']),
  note: z.string().optional()
});

export const cancelCaseSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason is mandatory')
});
