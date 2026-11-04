import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';
import { AnalyzerService } from './analyzer.service.js';

export class AnalyzerController {
  static async listAnalyzers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyzerService.listAnalyzers();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAnalyzer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyzerService.getAnalyzer(req.params.id as string);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Analyzer not found' });
      }
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createAnalyzer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyzerService.createAnalyzer(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async updateAnalyzer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyzerService.updateAnalyzer(req.params.id as string, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async saveMappings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyzerService.saveMappings(req.params.id as string, req.body.mappings);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getTransmissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const data = await AnalyzerService.getTransmissions(limit);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async simulateRun(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { analyzerId, sampleBarcode, scenario } = req.body;
      if (!analyzerId || !sampleBarcode) {
        return res.status(400).json({ success: false, message: 'analyzerId and sampleBarcode are required' });
      }
      const data = await AnalyzerService.simulateRun(analyzerId, sampleBarcode, scenario || 'NORMAL');
      res.json({
        success: true,
        message: 'Automated analyzer run executed and matched with active laboratory worklist.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPendingResultsForCase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyzerService.getPendingResultsForCase(req.params.caseId as string);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
