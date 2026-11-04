import { Response, NextFunction } from 'express';
import { prisma } from '../../core/database/prisma.client.js';
import { AuthenticatedRequest } from '../../core/middleware/authenticate.js';
import { EmailService } from '../../shared/email/email.service.js';

export class SettingsController {
  static async getSettings(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.clinicSetting.findUnique({
        where: { id: 'clinic_default' }
      });
      res.status(200).json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await prisma.clinicSetting.update({
        where: { id: 'clinic_default' },
        data: req.body
      });
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getSecuritySettings(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.clinicSetting.findUnique({
        where: { id: 'clinic_default' },
        select: {
          allowedIp: true,
          ipLockdownEnabled: true
        }
      });
      const devices = await prisma.browserDevice.findMany({
        orderBy: { lastSeenAt: 'desc' }
      });
      res.status(200).json({ success: true, data: { settings, devices } });
    } catch (err) {
      next(err);
    }
  }

  static async sendTestSms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const mobile = req.body.mobile || '9876543210';
      const settings = await prisma.clinicSetting.findUnique({
        where: { id: 'clinic_default' }
      });
      res.status(200).json({
        success: true,
        data: {
          message: `Test DLT SMS simulated successfully to +91-${mobile}`,
          senderId: settings?.smsSenderId || 'LABSMT',
          dltPrincipalId: settings?.dltPrincipalId || '1101489102830',
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendTestEmail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const email = req.body.email || 'doctor@apexdiagnostics.com';
      const result = await EmailService.sendTestEmail(email);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

