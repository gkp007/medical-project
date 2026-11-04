import { prisma } from '../../core/database/prisma.client.js';
import { v4 as uuidv4 } from 'uuid';

export interface SubscriptionRecord {
  id: string;
  clinicId: string;
  planTier: string;
  status: string;
  billingCycle: string;
  price: number;
  trialEndsAt: Date | string | null;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelledAt: Date | string | null;
  maxCasesPerMonth: number;
  maxBranches: number;
  whatsappQuota: number;
  features: string;
  paymentMethod: string | null;
  lastPaymentRef: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export class SubscriptionRepo {
  static async findLatest(clinicId = 'clinic_default'): Promise<SubscriptionRecord | null> {
    const rows = await prisma.$queryRawUnsafe<SubscriptionRecord[]>(
      `SELECT * FROM Subscription WHERE clinicId = ? ORDER BY createdAt DESC LIMIT 1`,
      clinicId
    );
    return rows && rows.length > 0 ? rows[0] : null;
  }

  static async findById(id: string): Promise<SubscriptionRecord | null> {
    const rows = await prisma.$queryRawUnsafe<SubscriptionRecord[]>(
      `SELECT * FROM Subscription WHERE id = ? LIMIT 1`,
      id
    );
    return rows && rows.length > 0 ? rows[0] : null;
  }

  static async create(data: {
    clinicId?: string;
    planTier: string;
    status: string;
    billingCycle?: string;
    price?: number;
    trialEndsAt?: Date | null;
    currentPeriodStart?: Date;
    currentPeriodEnd: Date;
    maxCasesPerMonth?: number;
    maxBranches?: number;
    whatsappQuota?: number;
    features?: string;
    paymentMethod?: string | null;
    lastPaymentRef?: string | null;
  }): Promise<SubscriptionRecord> {
    const id = uuidv4();
    const clinicId = data.clinicId || 'clinic_default';
    const planTier = data.planTier;
    const status = data.status;
    const billingCycle = data.billingCycle || 'MONTHLY';
    const price = data.price ?? 0;
    const trialEndsAt = data.trialEndsAt ? data.trialEndsAt.toISOString() : null;
    const currentPeriodStart = (data.currentPeriodStart || new Date()).toISOString();
    const currentPeriodEnd = data.currentPeriodEnd.toISOString();
    const maxCasesPerMonth = data.maxCasesPerMonth ?? 999999;
    const maxBranches = data.maxBranches ?? 1;
    const whatsappQuota = data.whatsappQuota ?? 500;
    const features = data.features || '[]';
    const paymentMethod = data.paymentMethod || null;
    const lastPaymentRef = data.lastPaymentRef || null;
    const now = new Date().toISOString();

    await prisma.$executeRawUnsafe(
      `INSERT INTO Subscription (
        id, clinicId, planTier, status, billingCycle, price, trialEndsAt,
        currentPeriodStart, currentPeriodEnd, maxCasesPerMonth, maxBranches,
        whatsappQuota, features, paymentMethod, lastPaymentRef, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, clinicId, planTier, status, billingCycle, price, trialEndsAt,
      currentPeriodStart, currentPeriodEnd, maxCasesPerMonth, maxBranches,
      whatsappQuota, features, paymentMethod, lastPaymentRef, now, now
    );

    const record = await this.findById(id);
    return record!;
  }

  static async cancel(id: string): Promise<void> {
    const now = new Date().toISOString();
    await prisma.$executeRawUnsafe(
      `UPDATE Subscription SET status = 'CANCELLED', cancelledAt = ?, updatedAt = ? WHERE id = ?`,
      now, now, id
    );
  }
}
