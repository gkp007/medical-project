import { z } from 'zod';

export const createPatientSchema = z.object({
  prefix: z.enum(['Mr', 'Mrs', 'Ms', 'Master', 'Baby', 'Dr']).default('Mr'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z.number().int().min(0).max(130),
  ageUnit: z.enum(['Years', 'Months', 'Days']).default('Years'),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  bloodGroup: z.string().optional().or(z.literal(''))
});

export const updatePatientSchema = createPatientSchema.partial();
