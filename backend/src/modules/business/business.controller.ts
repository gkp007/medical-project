import { Response, NextFunction } from 'express';
import { BusinessService } from './business.service.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';

export class BusinessController {
  static async getDashboardMetrics(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await BusinessService.getDashboardMetrics();
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getDailyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await BusinessService.getDailyBusiness(req.query.date as string);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getDailyReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await BusinessService.getDailyReport(req.query.date as string);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async emailDailyReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { email, date } = req.body;
      const result = await BusinessService.emailDailyReport(date, email);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getDuesAging(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await BusinessService.getDuesAging();
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getDueReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return BusinessController.getDuesAging(req, res, next);
  }

  static async waiveDue(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const waivedBy = req.user?.username || 'Admin';
      const { reason } = req.body;
      const updated = await BusinessService.waiveDue(req.params.caseId as string, reason, waivedBy);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async listExpenses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const expenses = await BusinessService.listExpenses(req.query as any);
      res.status(200).json({ success: true, data: expenses });
    } catch (err) {
      next(err);
    }
  }

  static async createExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cashierName = req.user?.username || 'Accountant Desk';
      const created = await BusinessService.createExpense({
        ...req.body,
        cashierName
      });
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async deleteExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BusinessService.deleteExpense(req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getReferralStatements(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const statements = await BusinessService.getReferralStatements(req.query as any);
      res.status(200).json({ success: true, data: statements });
    } catch (err) {
      next(err);
    }
  }

  static async settleDoctorPayout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const settledBy = req.user?.username || 'Finance Desk';
      const payout = await BusinessService.settleDoctorPayout(
        req.params.id as string,
        req.body,
        settledBy
      );
      res.status(200).json({ success: true, data: payout });
    } catch (err) {
      next(err);
    }
  }

  static async exportData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as string) || req.body?.type || 'cases';
      const fromDate = (req.query.fromDate as string) || req.body?.fromDate;
      const toDate = (req.query.toDate as string) || req.body?.toDate;
      const csv = await BusinessService.exportData(type, fromDate, toDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${type}_export_${Date.now()}.csv"`);
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }

  static async listActivities(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const activities = await BusinessService.listActivities();
      res.status(200).json({ success: true, data: activities });
    } catch (err) {
      next(err);
    }
  }
}
