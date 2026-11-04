import { Response, NextFunction } from 'express';
import { RadiologyService } from './radiology.service.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';

export class RadiologyController {
  static async getWorklist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const modality = (req.query.modality as string) || 'USG';
      const worklist = await RadiologyService.getWorklist(modality, req.query as any);
      res.status(200).json({ success: true, data: worklist });
    } catch (err) {
      next(err);
    }
  }

  static async getUsgWorklist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const worklist = await RadiologyService.getWorklist('USG', req.query as any);
      res.status(200).json({ success: true, data: worklist });
    } catch (err) {
      next(err);
    }
  }

  static async getXrayWorklist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const worklist = await RadiologyService.getWorklist('X-RAY', req.query as any);
      res.status(200).json({ success: true, data: worklist });
    } catch (err) {
      next(err);
    }
  }

  static async getStudyDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const details = await RadiologyService.getStudyDetails(req.params.caseId as string);
      res.status(200).json({ success: true, data: details });
    } catch (err) {
      next(err);
    }
  }

  static async saveUsgFindings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const study = await RadiologyService.saveUsgFindings(req.params.caseId as string, req.body);
      res.status(200).json({ success: true, data: study });
    } catch (err) {
      next(err);
    }
  }

  static async saveXrayFindings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const study = await RadiologyService.saveXrayFindings(req.params.caseId as string, req.body);
      res.status(200).json({ success: true, data: study });
    } catch (err) {
      next(err);
    }
  }

  static async saveFindings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { findings, impression, clinicalHistory } = req.body;
      const study = await RadiologyService.saveFindings(req.params.caseId as string, findings, impression, clinicalHistory);
      res.status(200).json({ success: true, data: study });
    } catch (err) {
      next(err);
    }
  }

  static async authorizeStudy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const radiologist = req.user?.username ? `Dr. ${req.user.username}, MD (Radiology)` : 'Dr. Vikram Malhotra, MD';
      const study = await RadiologyService.authorizeStudy(req.params.caseId as string, radiologist);
      res.status(200).json({ success: true, data: study });
    } catch (err) {
      next(err);
    }
  }

  static async getReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await RadiologyService.getReport(req.params.caseId as string);
      res.status(200).json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }

  static async listTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const templates = await RadiologyService.listTemplates(req.query.modality as string);
      res.status(200).json({ success: true, data: templates });
    } catch (err) {
      next(err);
    }
  }

  static async createTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const template = await RadiologyService.createTemplate(req.body);
      res.status(201).json({ success: true, data: template });
    } catch (err) {
      next(err);
    }
  }

  static async listSignatures(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sigs = await RadiologyService.listSignatures();
      res.status(200).json({ success: true, data: sigs });
    } catch (err) {
      next(err);
    }
  }

  static async createSignature(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const sig = await RadiologyService.createSignature(req.body);
      res.status(201).json({ success: true, data: sig });
    } catch (err) {
      next(err);
    }
  }
}
