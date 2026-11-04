import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from './subscription.service.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';

export class SubscriptionController {
  static async getPlans(_req: Request, res: Response, next: NextFunction) {
    try {
      const plans = SubscriptionService.getPlans();
      res.status(200).json({ success: true, data: plans });
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentSubscription(_req: Request, res: Response, next: NextFunction) {
    try {
      const current = await SubscriptionService.getCurrentSubscription();
      res.status(200).json({ success: true, data: current });
    } catch (err) {
      next(err);
    }
  }

  static async subscribe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { planTier, billingCycle, paymentMethod, transactionRef } = req.body;
      const actorName = req.user?.username || 'Owner';
      const result = await SubscriptionService.subscribe({
        planTier,
        billingCycle,
        paymentMethod,
        transactionRef,
        actorName
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async cancel(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await SubscriptionService.cancel();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
