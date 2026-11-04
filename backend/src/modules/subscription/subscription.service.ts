import { SubscriptionRepo } from './subscription.repo.js';
import { BadRequestError } from '../../core/errors/AppError.js';

export interface PlanDefinition {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  maxCasesPerMonth: number | 'Unlimited';
  maxBranches: number | 'Unlimited';
  popular?: boolean;
}

export const AVAILABLE_PLANS: PlanDefinition[] = [
  {
    id: 'STARTER',
    name: 'Labsmart Starter',
    badge: 'Single Lab',
    monthlyPrice: 1499,
    annualPrice: 14990,
    description: 'Perfect for standalone pathology labs and clinics starting digital operations',
    maxCasesPerMonth: 300,
    maxBranches: 1,
    features: [
      'Up to 300 Patient Bills / month',
      'Pathology Bench Entry & Formats',
      'A4 / A5 Standard PDF Reports',
      'Email Report Delivery to Patients',
      'Single Branch Deployment',
      'Standard Business Financials',
      'Daily Data Backup'
    ]
  },
  {
    id: 'PROFESSIONAL',
    name: 'Labsmart Professional',
    badge: 'Most Popular',
    popular: true,
    monthlyPrice: 3499,
    annualPrice: 34990,
    description: 'Full clinical intelligence & NABL ISO 15189 compliance for high-volume labs',
    maxCasesPerMonth: 'Unlimited',
    maxBranches: 3,
    features: [
      'Unlimited Patient Bills & Cases',
      'Automated Formula Engine (eGFR, A/G Ratio, MCV)',
      '90-Day Delta Check shift warnings',
      'NABL ISO 15189 Audit Compliance',
      'Automated WhatsApp & SMS PDF Delivery',
      'Specimen Tube Barcode Label Printing',
      'Dynamic QR Code Report Verification',
      'Doctor Commission & Referral Statements',
      'Cashier Till & Shift Variance Tracking',
      'Multi-Branch Ready (Up to 3 Branches)'
    ]
  },
  {
    id: 'ENTERPRISE',
    name: 'Labsmart Enterprise Network',
    badge: 'Multi-Modality & Hospital',
    monthlyPrice: 6999,
    annualPrice: 69990,
    description: 'Complete diagnostic network suite covering Pathology, Ultrasound, and Digital X-Ray',
    maxCasesPerMonth: 'Unlimited',
    maxBranches: 'Unlimited',
    features: [
      'All Capabilities of Professional Plan',
      'Ultrasound (USG) Worklist & PC-PNDT Forms',
      'Digital X-Ray Queue & AERB Radiation Logs',
      'Multi-Branch Live Sync (Unlimited Branches)',
      'Terminal Hardware Fingerprint Lockdown',
      'Custom Letterhead Designer & Margins (mm)',
      'Direct Accounting Tally & CSV Exports',
      'Custom Domain (reports.yourclinic.com)',
      '24/7 Dedicated Priority Technical Support',
      'Guaranteed 99.95% SLA Uptime'
    ]
  }
];

export class SubscriptionService {
  /**
   * Returns list of subscription plans and tiers
   */
  static getPlans() {
    return AVAILABLE_PLANS;
  }

  /**
   * Retrieves the active clinic subscription or auto-provisions a 14-day free trial
   */
  static async getCurrentSubscription() {
    let sub = await SubscriptionRepo.findLatest('clinic_default');

    // If no subscription exists in database, initialize a 14-day Enterprise Trial
    if (!sub) {
      const trialEnds = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      sub = await SubscriptionRepo.create({
        clinicId: 'clinic_default',
        planTier: 'TRIAL',
        status: 'TRIALING',
        billingCycle: 'MONTHLY',
        price: 0,
        trialEndsAt: trialEnds,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEnds,
        maxCasesPerMonth: 999999,
        maxBranches: 3,
        features: JSON.stringify(['ALL_MODALITIES', 'NABL_COMPLIANCE', 'FORMULA_ENGINE', 'DELTA_CHECK', 'WHATSAPP_ALERTS'])
      });
    }

    const now = new Date();
    const periodEnd = new Date(sub.currentPeriodEnd);
    const msRemaining = periodEnd.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
    const isExpired = daysRemaining <= 0;

    let planInfo = AVAILABLE_PLANS.find(p => p.id === sub.planTier);
    if (sub.planTier === 'TRIAL') {
      planInfo = {
        id: 'TRIAL',
        name: 'Labsmart Enterprise Trial (14-Day Free Access)',
        badge: 'Free Trial',
        monthlyPrice: 0,
        annualPrice: 0,
        description: 'Complete unrestricted access to all Enterprise features during your evaluation period',
        maxCasesPerMonth: 'Unlimited',
        maxBranches: 3,
        features: [
          'Full 14-Day Unrestricted Access',
          'NABL ISO 15189 Pathology Engine',
          'USG & Digital X-Ray Modalities',
          'Automated Formulas & Delta Checks',
          'WhatsApp & SMS Delivery',
          'No Credit Card Required'
        ]
      };
    }

    return {
      subscription: sub,
      planInfo,
      daysRemaining,
      isExpired,
      isTrial: sub.planTier === 'TRIAL' || sub.status === 'TRIALING'
    };
  }

  /**
   * Activates or upgrades subscription plan
   */
  static async subscribe(data: {
    planTier: string;
    billingCycle?: 'MONTHLY' | 'ANNUAL';
    paymentMethod?: string;
    transactionRef?: string;
    actorName?: string;
  }) {
    const plan = AVAILABLE_PLANS.find(p => p.id === data.planTier.toUpperCase());
    if (!plan) {
      throw new BadRequestError(`Invalid plan tier: ${data.planTier}. Choose from STARTER, PROFESSIONAL, ENTERPRISE`);
    }

    const cycle = data.billingCycle || 'MONTHLY';
    const price = cycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;
    const durationDays = cycle === 'ANNUAL' ? 365 : 30;
    const periodEnd = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const paymentRef = data.transactionRef || `LBS-TXN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newSub = await SubscriptionRepo.create({
      clinicId: 'clinic_default',
      planTier: plan.id,
      status: 'ACTIVE',
      billingCycle: cycle,
      price,
      currentPeriodStart: new Date(),
      currentPeriodEnd: periodEnd,
      maxCasesPerMonth: typeof plan.maxCasesPerMonth === 'number' ? plan.maxCasesPerMonth : 999999,
      maxBranches: typeof plan.maxBranches === 'number' ? plan.maxBranches : 999,
      features: JSON.stringify(plan.features),
      paymentMethod: data.paymentMethod || 'DIRECT_UPI',
      lastPaymentRef: paymentRef
    });

    return {
      success: true,
      message: `Successfully subscribed to ${plan.name} (${cycle}). License valid for ${durationDays} days.`,
      subscription: newSub,
      daysRemaining: durationDays,
      transactionRef: paymentRef
    };
  }

  /**
   * Cancels future auto-renewal
   */
  static async cancel() {
    const active = await SubscriptionRepo.findLatest('clinic_default');

    if (!active || active.status !== 'ACTIVE') {
      throw new BadRequestError('No active paid subscription found to cancel');
    }

    await SubscriptionRepo.cancel(active.id);
    const updated = await SubscriptionRepo.findById(active.id);

    return {
      success: true,
      message: 'Subscription renewal has been cancelled. Access remains active until the end of your current period.',
      subscription: updated
    };
  }
}

