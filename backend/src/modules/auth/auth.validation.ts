import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const createEmployeeSchema = z.object({
  username: z.string().min(3),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'PATHOLOGIST', 'RADIOLOGIST', 'RECEPTIONIST', 'ACCOUNTANT']),
  canBilling: z.boolean().default(true),
  canResultsEntry: z.boolean().default(false),
  canAuthorize: z.boolean().default(false),
  canDoctorPayouts: z.boolean().default(false),
  canAuditMaster: z.boolean().default(false)
});

export const registerClinicSchema = z.object({
  clinicName: z.string().min(2, 'Clinic name is required'),
  fullName: z.string().min(2, 'Owner or doctor name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Valid email address is required'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  planTier: z.enum(['TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional().default('TRIAL'),
  modality: z.string().optional().default('ALL')
});

