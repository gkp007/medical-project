import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config.js';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError.js';
import { SecurityService } from '../../modules/security/security.service.js';

export interface AuthUserPayload {
  userId: string;
  username: string;
  role: string;
  isOwner?: boolean;
  branchId?: string;
  canBilling: boolean;
  canResultsEntry: boolean;
  canAuthorize: boolean;
  canDoctorPayouts: boolean;
  canAuditMaster: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
  cookies: any;
}

export const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
    req.user = decoded;

    // Check browser device fingerprint if IP/terminal lockdown is enabled
    const browserCode = (req.headers['x-browser-code'] || req.headers['x-device-fingerprint']) as string;
    const clientIp = req.ip || req.socket.remoteAddress;
    const deviceCheck = await SecurityService.verifyBrowser(browserCode, clientIp);
    if (!deviceCheck.allowed && deviceCheck.lockdownActive) {
      return next(new ForbiddenError(deviceCheck.message || 'Terminal device access denied due to IP lockdown'));
    }

    next();
  } catch (err: any) {
    if (err instanceof ForbiddenError) return next(err);
    next(new UnauthorizedError('Invalid or expired authentication session token'));
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.role === 'SUPER_ADMIN' || req.user.isOwner || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(new ForbiddenError(`Access denied: Requires one of [${allowedRoles.join(', ')}] role`));
  };
};

export const requirePermission = (permission: keyof Omit<AuthUserPayload, 'userId' | 'username' | 'role' | 'branchId'>) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.role === 'SUPER_ADMIN' || req.user.isOwner || req.user[permission]) {
      return next();
    }

    return next(new ForbiddenError(`Access denied: Missing required '${permission}' permission`));
  };
};
