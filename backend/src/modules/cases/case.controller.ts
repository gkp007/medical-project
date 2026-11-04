import { Response, NextFunction } from 'express';
import { CaseService } from './case.service.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';

export class CaseController {
  static async createCase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const receivedBy = req.user?.username || 'Reception Desk';
      const created = await CaseService.createCase(req.body, receivedBy, req.user);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async listCases(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await CaseService.listCases(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getCaseById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const caseRecord = await CaseService.getCaseById(req.params.id as string);
      res.status(200).json({ success: true, data: caseRecord });
    } catch (err) {
      next(err);
    }
  }

  static async updateCase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updatedBy = req.user?.username || 'Front Desk';
      const updated = await CaseService.updateCase(req.params.id as string, req.body, updatedBy);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async updateSampleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sampleStatus, rejectionReason } = req.body;
      const updated = await CaseService.updateSampleStatus(req.params.id as string, sampleStatus, rejectionReason);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async collectDue(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const receivedBy = req.user?.username || 'Billing Desk';
      const { amount, paymentMode, note } = req.body;
      const updated = await CaseService.collectDue(req.params.id as string, amount, paymentMode, receivedBy, note);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async cancelCase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cancelledBy = req.user?.username || 'Admin';
      const { reason } = req.body;
      const updated = await CaseService.cancelCase(req.params.id as string, reason, cancelledBy);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getPrintableBill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const layout = (req.query.layout as string) || 'A4';
      const printData = await CaseService.getPrintableBill(req.params.id as string, layout);
      res.status(200).json({ success: true, data: printData });
    } catch (err) {
      next(err);
    }
  }

  static async getBarcodes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const barcodeData = await CaseService.getBarcodes(req.params.id as string);
      res.status(200).json({ success: true, data: barcodeData });
    } catch (err) {
      next(err);
    }
  }
}
