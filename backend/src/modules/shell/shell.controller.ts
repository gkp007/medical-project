import { Request, Response, NextFunction } from 'express';
import { ShellService } from './shell.service.js';

export class ShellController {
  static async getContext(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      const requestedBranch = (req.query.branchId as string) || (req.headers['x-branch-id'] as string);
      const data = await ShellService.getContext(userId, requestedBranch);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async omnisearch(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const limit = Number(req.query.limit) || 10;
      const results = await ShellService.omnisearch(query, limit);
      res.status(200).json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }

  static async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      const result = await ShellService.createSupportTicket(userId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async rechargeCredits(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      const result = await ShellService.rechargeCredits(userId, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
