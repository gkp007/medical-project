import { Request, Response, NextFunction } from 'express';
import { MasterService } from './master.service.js';

export class MasterController {
  // Tests
  static async listTests(req: Request, res: Response, next: NextFunction) {
    try {
      const tests = await MasterService.listTests(req.query as any);
      res.status(200).json({ success: true, data: tests });
    } catch (err) {
      next(err);
    }
  }

  static async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MasterService.createTest(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MasterService.updateTest(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
      await MasterService.deleteTest(req.params.id as string);
      res.status(200).json({ success: true, message: 'Test deactivated' });
    } catch (err) {
      next(err);
    }
  }

  // Packages
  static async listPackages(_req: Request, res: Response, next: NextFunction) {
    try {
      const packages = await MasterService.listPackages();
      res.status(200).json({ success: true, data: packages });
    } catch (err) {
      next(err);
    }
  }

  static async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MasterService.createPackage(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updatePackage(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MasterService.updatePackage(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deletePackage(req: Request, res: Response, next: NextFunction) {
    try {
      await MasterService.deletePackage(req.params.id as string);
      res.status(200).json({ success: true, message: 'Package deactivated' });
    } catch (err) {
      next(err);
    }
  }

  // Panels
  static async listPanels(_req: Request, res: Response, next: NextFunction) {
    try {
      const panels = await MasterService.listPanels();
      res.status(200).json({ success: true, data: panels });
    } catch (err) {
      next(err);
    }
  }

  static async createPanel(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MasterService.createPanel(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updatePanel(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MasterService.updatePanel(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deletePanel(req: Request, res: Response, next: NextFunction) {
    try {
      await MasterService.deletePanel(req.params.id as string);
      res.status(200).json({ success: true, message: 'Panel deleted' });
    } catch (err) {
      next(err);
    }
  }

  // Categories
  static async listCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await MasterService.listCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MasterService.createCategory(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MasterService.updateCategory(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await MasterService.deleteCategory(req.params.id as string);
      res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  }

  // Agents
  static async listAgents(_req: Request, res: Response, next: NextFunction) {
    try {
      const agents = await MasterService.listAgents();
      res.status(200).json({ success: true, data: agents });
    } catch (err) {
      next(err);
    }
  }

  static async createAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MasterService.createAgent(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updateAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MasterService.updateAgent(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAgent(req: Request, res: Response, next: NextFunction) {
    try {
      await MasterService.deleteAgent(req.params.id as string);
      res.status(200).json({ success: true, message: 'Agent deactivated' });
    } catch (err) {
      next(err);
    }
  }

  // Settings
  static async getClinicSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await MasterService.getClinicSettings();
      res.status(200).json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }

  static async updateClinicSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MasterService.updateClinicSettings(req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}
