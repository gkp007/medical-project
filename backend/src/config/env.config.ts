import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().default('super-secret-labsmart-jwt-key-2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  CLINIC_NAME: z.string().default('Apex Diagnostic Centre & Imaging Network'),
  CLINIC_PHONE: z.string().default('+91 98765 43210'),
  CLINIC_EMAIL: z.string().default('reports@apexdiagnostics.com'),
  CLINIC_ADDRESS: z.string().default('42, Medical Enclave, Health City, New Delhi - 110029'),
  NABL_ACCREDITATION_NO: z.string().default('MC-4921-ISO15189')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid backend environment variables:', parsed.error.format());
  throw new Error('Invalid backend environment configuration');
}

export const env = parsed.data;
