import { Request, Response, NextFunction } from 'express';
import { SecurityService } from './security.service.js';

export class SecurityController {
  static async listDevices(_req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await SecurityService.listDevices();
      res.status(200).json({ success: true, data: devices });
    } catch (err) {
      next(err);
    }
  }

  static async registerOrTouchDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await SecurityService.registerOrTouchDevice({
        ...req.body,
        ipAddress: req.ip || '127.0.0.1'
      });
      res.status(200).json({ success: true, data: device });
    } catch (err) {
      next(err);
    }
  }

  static async toggleDeviceBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await SecurityService.toggleDeviceBlock(req.params.id as string);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async renameDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const updated = await SecurityService.renameDevice(req.params.id as string, name);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async verifyBrowser(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.body?.browserCode || (req.headers['x-browser-code'] as string);
      const ip = req.ip || req.socket.remoteAddress;
      const result = await SecurityService.verifyBrowser(code, ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
