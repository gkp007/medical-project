import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export class SecurityService {
  static async listDevices() {
    return prisma.browserDevice.findMany({
      orderBy: { lastSeenAt: 'desc' }
    });
  }

  static async registerOrTouchDevice(data: {
    deviceFingerprint: string;
    deviceName: string;
    browser: string;
    operatingSystem: string;
    ipAddress: string;
  }) {
    return prisma.browserDevice.upsert({
      where: { deviceFingerprint: data.deviceFingerprint },
      update: {
        lastIpAddress: data.ipAddress,
        lastSeenAt: new Date()
      },
      create: {
        deviceFingerprint: data.deviceFingerprint,
        deviceName: data.deviceName,
        browser: data.browser,
        operatingSystem: data.operatingSystem,
        lastIpAddress: data.ipAddress,
        isApproved: true,
        isBlocked: false
      }
    });
  }

  static async toggleDeviceBlock(id: string) {
    const device = await prisma.browserDevice.findUnique({ where: { id } });
    if (!device) throw new NotFoundError('Device terminal not found');

    return prisma.browserDevice.update({
      where: { id },
      data: { isBlocked: !device.isBlocked }
    });
  }

  static async renameDevice(id: string, name: string) {
    const device = await prisma.browserDevice.findUnique({ where: { id } });
    if (!device) throw new NotFoundError('Device terminal not found');

    return prisma.browserDevice.update({
      where: { id },
      data: { deviceName: name }
    });
  }

  static async verifyBrowser(code: string, ipAddress?: string) {
    if (!code) {
      return {
        allowed: false,
        isApproved: false,
        error: 'DEVICE_NOT_SPECIFIED',
        message: 'Browser code / device fingerprint is required'
      };
    }

    const clinic = await prisma.clinicSetting.findUnique({
      where: { id: 'clinic_default' }
    });

    if (!clinic?.ipLockdownEnabled) {
      return {
        allowed: true,
        isApproved: true,
        browserCode: code,
        lockdownActive: false,
        message: 'Terminal verified. IP lockdown is inactive.'
      };
    }

    const device = await prisma.browserDevice.findUnique({
      where: { deviceFingerprint: code }
    });

    if (!device) {
      return {
        allowed: false,
        isApproved: false,
        browserCode: code,
        lockdownActive: true,
        error: 'DEVICE_NOT_AUTHORIZED',
        message: 'Terminal device is not registered. Please contact your lab administrator.'
      };
    }

    if (device.isBlocked) {
      return {
        allowed: false,
        isApproved: false,
        browserCode: code,
        lockdownActive: true,
        error: 'DEVICE_BLOCKED',
        message: 'This terminal device has been blocked by the lab administrator.'
      };
    }

    await prisma.browserDevice.update({
      where: { id: device.id },
      data: {
        lastSeenAt: new Date(),
        lastIpAddress: ipAddress || device.lastIpAddress
      }
    });

    return {
      allowed: true,
      isApproved: true,
      browserCode: code,
      deviceName: device.deviceName,
      lockdownActive: true,
      message: 'Terminal device successfully verified and authorized.'
    };
  }
}
