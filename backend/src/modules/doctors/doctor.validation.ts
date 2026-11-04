import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Doctor name must be at least 2 characters'),
  degree: z.string().optional().or(z.literal('')),
  specialty: z.string().min(2, 'Specialty is required'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  commissionPct: z.number().min(0).max(100).default(0.0)
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const recordPayoutSchema = z.object({
  doctorId: z.string().uuid(),
  periodStart: z.string(),
  periodEnd: z.string(),
  totalCommission: z.number().min(0),
  paidAmount: z.number().min(0),
  paymentMode: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Cheque']),
  transactionRef: z.string().optional()
});
