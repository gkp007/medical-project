import { Response, NextFunction } from 'express';
import { PaymentService } from './payment.service.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';

export class PaymentController {
  static async collectDue(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const receivedBy = req.user?.username || 'Cashier Desk';
      const result = await PaymentService.collectDue({
        ...req.body,
        receivedBy
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.getTransactions(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async updateTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updatedBy = req.user?.username || 'Admin';
      const result = await PaymentService.updateTransaction(
        req.params.id as string,
        req.body,
        updatedBy
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async startShift(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cashierId = req.user?.userId || 'unknown';
      const cashierName = req.user?.username || 'Cashier';
      const result = await PaymentService.startShift({
        cashierId,
        cashierName,
        counterDesk: req.body.counterDesk,
        openingFloat: req.body.openingFloat
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async closeShift(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cashierId = req.user?.userId || 'unknown';
      const cashierName = req.user?.username || 'Cashier';
      const result = await PaymentService.closeShift({
        cashierId,
        cashierName,
        closingCashCount: req.body.closingCashCount
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
