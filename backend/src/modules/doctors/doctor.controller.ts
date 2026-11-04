import { Request, Response, NextFunction } from 'express';
import { DoctorService } from './doctor.service.js';

export class DoctorController {
  static async listDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await DoctorService.listDoctors(req.query as any);
      res.status(200).json({ success: true, data: doctors });
    } catch (err) {
      next(err);
    }
  }

  static async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await DoctorService.createDoctor(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DoctorService.updateDoctor(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async toggleDoctorStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DoctorService.toggleDoctorStatus(req.params.id as string);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async togglePortalAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DoctorService.togglePortalAccess(req.params.id as string);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async recordPayout(req: Request, res: Response, next: NextFunction) {
    try {
      const payout = await DoctorService.recordPayout(req.body);
      res.status(201).json({ success: true, data: payout });
    } catch (err) {
      next(err);
    }
  }
}
