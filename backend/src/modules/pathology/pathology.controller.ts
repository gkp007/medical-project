import { Response, NextFunction } from 'express';
import { PathologyService } from './pathology.service.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';

export class PathologyController {
  static async getTodayWorklist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const worklist = await PathologyService.getTodayWorklist(req.query as any);
      res.status(200).json({ success: true, data: worklist });
    } catch (err) {
      next(err);
    }
  }

  static async updateSampleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sampleStatus, rejectionReason } = req.body;
      const updated = await PathologyService.updateSampleStatus(req.params.caseId as string, sampleStatus, rejectionReason);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getResultsWorksheet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const worksheet = await PathologyService.getResultsWorksheet(req.params.caseId as string);
      res.status(200).json({ success: true, data: worksheet });
    } catch (err) {
      next(err);
    }
  }

  static async saveResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { parameters, interpretation } = req.body;
      const result = await PathologyService.saveResults(req.params.caseId as string, parameters, interpretation);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async authorizeReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authorizedBy = req.user?.username ? `Dr. ${req.user.username}, MD` : 'Pathologist On Duty';
      const { pathologistNotes } = req.body;
      const result = await PathologyService.authorizeReport(req.params.caseId as string, authorizedBy, pathologistNotes);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getNablReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await PathologyService.getNablReport(req.params.caseId as string);
      res.status(200).json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }

  static async getInterpretations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const interpretations = await PathologyService.getInterpretations(req.query as any);
      res.status(200).json({ success: true, data: interpretations });
    } catch (err) {
      next(err);
    }
  }

  static async getTestCounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const counts = await PathologyService.getTestCounts(req.query as any);
      res.status(200).json({ success: true, data: counts });
    } catch (err) {
      next(err);
    }
  }

  static async createInterpretation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await PathologyService.createInterpretation(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updateInterpretation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PathologyService.updateInterpretation(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteInterpretation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await PathologyService.deleteInterpretation(req.params.id as string);
      res.status(200).json({ success: true, message: 'Clinical interpretation deleted' });
    } catch (err) {
      next(err);
    }
  }

  static async emailReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const caseId = req.params.caseId as string;
      const targetEmail = req.body?.email;
      const result = await PathologyService.emailReport(caseId, targetEmail);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getSpecimenBarcode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const caseId = req.params.caseId as string;
      const result = await PathologyService.getSpecimenBarcode(caseId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}


