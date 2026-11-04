import { Request, Response, NextFunction } from 'express';
import { PatientService } from './patient.service.js';

export class PatientController {
  static async listPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PatientService.listPatients(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.getPatientById(req.params.id as string);
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  }

  static async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await PatientService.createPatient(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await PatientService.updatePatient(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async archivePatient(req: Request, res: Response, next: NextFunction) {
    try {
      await PatientService.archivePatient(req.params.id as string);
      res.status(200).json({ success: true, message: 'Patient archived successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async getMedicalHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await PatientService.getMedicalHistory(req.params.id as string);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
}
