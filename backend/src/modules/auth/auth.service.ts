import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../core/database/prisma.client.js';
import { env } from '../../config/env.config.js';
import { UnauthorizedError, ConflictError, NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { AuthUserPayload } from '../../core/middleware/authenticate.js';
import { EmailService } from '../../shared/email/email.service.js';
import { SubscriptionRepo } from '../subscription/subscription.repo.js';

export class AuthService {
  static async login(username: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials or account is deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const payload: AuthUserPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      isOwner: user.isOwner,
      canBilling: user.canBilling,
      canResultsEntry: user.canResultsEntry,
      canAuthorize: user.canAuthorize,
      canDoctorPayouts: user.canDoctorPayouts,
      canAuditMaster: user.canAuditMaster
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isOwner: user.isOwner,
        isEmailVerified: user.isEmailVerified,
        isTerminalLocked: user.isTerminalLocked,
        allowedBranches: JSON.parse(user.allowedBranches || '["main"]'),
        permissions: {
          canBilling: user.canBilling,
          canResultsEntry: user.canResultsEntry,
          canAuthorize: user.canAuthorize,
          canDoctorPayouts: user.canDoctorPayouts,
          canAuditMaster: user.canAuditMaster,
          canEditRates: user.canEditRates,
          canDeleteBills: user.canDeleteBills,
          canSignOffReports: user.canSignOffReports,
          canViewLedger: user.canViewLedger,
          canManageExpenses: user.canManageExpenses,
          canIssueRefunds: user.canIssueRefunds
        }
      }
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User session expired or account deactivated');
    }

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      isOwner: user.isOwner,
      isEmailVerified: user.isEmailVerified,
      isTerminalLocked: user.isTerminalLocked,
      allowedBranches: JSON.parse(user.allowedBranches || '["main"]'),
      permissions: {
        canBilling: user.canBilling,
        canResultsEntry: user.canResultsEntry,
        canAuthorize: user.canAuthorize,
        canDoctorPayouts: user.canDoctorPayouts,
        canAuditMaster: user.canAuditMaster,
        canEditRates: user.canEditRates,
        canDeleteBills: user.canDeleteBills,
        canSignOffReports: user.canSignOffReports,
        canViewLedger: user.canViewLedger,
        canManageExpenses: user.canManageExpenses,
        canIssueRefunds: user.canIssueRefunds
      }
    };
  }

  static async logout(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.auditLog.create({
        data: {
          action: 'STAFF_LOGOUT',
          entityType: 'User',
          entityId: user.id,
          actorId: user.id,
          actorName: user.fullName,
          changes: JSON.stringify({ timestamp: new Date().toISOString() })
        }
      });
    }
    return { success: true, message: 'Logged out successfully' };
  }

  static async sendVerificationEmail(userId: string, targetEmail?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const emailToSend = targetEmail || user.email;
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: emailToSend,
        emailVerificationToken: token,
        emailVerificationExpiresAt: expiresAt
      }
    });

    await EmailService.sendVerificationEmail(emailToSend, token, user.fullName);

    return {
      success: true,
      email: emailToSend,
      message: `Verification instructions sent to ${emailToSend}`
    };
  }

  static async verifyEmail(token: string) {
    if (!token) throw new BadRequestError('Verification token is required');

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiresAt: { gte: new Date() }
      }
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired email verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null
      }
    });

    return {
      success: true,
      message: 'Email verified successfully',
      email: user.email
    };
  }

  static async forgotPassword(identifier: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      // Return ambiguous message for security
      return { success: true, message: 'If an account exists, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: expiresAt
      }
    });

    await EmailService.sendPasswordResetEmail(user.email, resetToken, user.fullName);

    return {
      success: true,
      message: `Password reset link has been sent to ${user.email.replace(/(.{2})(.*)(?=@)/, '$1***')}`
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new BadRequestError('Token and new password are required');
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { resetPasswordToken: token },
          // Also allow 6-character OTP matching
          { resetPasswordToken: { startsWith: token.toLowerCase() } }
        ],
        resetPasswordExpiresAt: { gte: new Date() }
      }
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null
      }
    });

    return { success: true, message: 'Password has been updated successfully. Please log in.' };
  }

  static async lockTerminal(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isTerminalLocked: true }
    });
    return { success: true, isTerminalLocked: true };
  }

  static async unlockTerminal(userId: string, pin: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const expectedPin = user.terminalLockPin || '1234';
    const isPinMatch = pin === expectedPin;
    const isPasswordMatch = await bcrypt.compare(pin, user.passwordHash).catch(() => false);

    if (!isPinMatch && !isPasswordMatch) {
      throw new UnauthorizedError('Invalid terminal unlock PIN or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isTerminalLocked: false }
    });

    return { success: true, isTerminalLocked: false };
  }

  static async createSupportTicket(userId: string, data: { category: string; subject: string; description: string; priority?: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const count = await prisma.supportTicket.count();
    const ticketNo = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNo,
        category: data.category,
        subject: data.subject,
        description: data.description,
        priority: data.priority || 'NORMAL',
        userId: user?.id,
        userEmail: user?.email
      }
    });

    await EmailService.sendSupportTicketAlert({
      ticketNo,
      category: data.category,
      subject: data.subject,
      description: data.description,
      userEmail: user?.email
    });

    return ticket;
  }

  static async listEmployees() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        canBilling: true,
        canResultsEntry: true,
        canAuthorize: true,
        canDoctorPayouts: true,
        canAuditMaster: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createEmployee(data: any) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email }
        ]
      }
    });

    if (existing) {
      throw new ConflictError('A staff member with this username or email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        role: data.role,
        canBilling: data.canBilling,
        canResultsEntry: data.canResultsEntry,
        canAuthorize: data.canAuthorize,
        canDoctorPayouts: data.canDoctorPayouts,
        canAuditMaster: data.canAuditMaster
      }
    });

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }

  static async toggleEmployeeStatus(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('Employee not found');

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive }
    });

    return { id: updated.id, username: updated.username, isActive: updated.isActive };
  }

  static async refreshToken(refreshTokenString: string) {
    if (!refreshTokenString) {
      throw new UnauthorizedError('Refresh token required');
    }

    try {
      const decoded = jwt.verify(refreshTokenString, env.JWT_SECRET) as any;
      if (decoded.tokenType !== 'refresh' || !decoded.userId) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user || !user.isActive || user.isBlocked) {
        throw new UnauthorizedError('Account is inactive or blocked');
      }

      const payload: AuthUserPayload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        isOwner: user.isOwner,
        canBilling: user.canBilling,
        canResultsEntry: user.canResultsEntry,
        canAuthorize: user.canAuthorize,
        canDoctorPayouts: user.canDoctorPayouts,
        canAuditMaster: user.canAuditMaster
      };

      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
      const newRefreshToken = jwt.sign(
        { userId: user.id, tokenType: 'refresh' },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isOwner: user.isOwner
        }
      };
    } catch {
      throw new UnauthorizedError('Expired or invalid refresh token');
    }
  }

  static async switchBranch(userId: string, branchId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const allowed = JSON.parse(user.allowedBranches || '["main"]');
    if (!allowed.includes(branchId) && user.role !== 'SUPER_ADMIN' && !user.isOwner) {
      throw new BadRequestError(`User is not authorized for branch '${branchId}'`);
    }

    const payload: AuthUserPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      isOwner: user.isOwner,
      branchId,
      canBilling: user.canBilling,
      canResultsEntry: user.canResultsEntry,
      canAuthorize: user.canAuthorize,
      canDoctorPayouts: user.canDoctorPayouts,
      canAuditMaster: user.canAuditMaster
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);

    return {
      token,
      activeBranch: branchId,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        activeBranch: branchId
      }
    };
  }

  /**
   * Public Self-Service Registration for new Diagnostic Center Owner
   * Automatically initializes clinic settings and provisions 14-day full feature trial
   */
  static async registerClinic(data: {
    clinicName: string;
    fullName: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
    planTier?: string;
    modality?: string;
  }) {
    // Check if user already exists (username, email, or mobile)
    const whereOr: any[] = [
      { username: data.username },
      { email: data.email }
    ];
    if (data.mobile) {
      whereOr.push({ mobile: data.mobile });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: whereOr }
    });

    if (existing) {
      if (existing.username === data.username) throw new ConflictError('This username is already taken. Please choose another.');
      if (existing.email === data.email) throw new ConflictError('An account with this email address already exists.');
      if (existing.mobile && existing.mobile === data.mobile) throw new ConflictError('An account with this mobile number already exists.');
      throw new ConflictError('A staff member or clinic account with these credentials already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user as SUPER_ADMIN & Owner with full administrative privileges
    const user = await prisma.user.create({
      data: {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        passwordHash,
        role: 'SUPER_ADMIN',
        isOwner: true,
        isActive: true,
        isEmailVerified: true, // auto-verify owner registration
        canBilling: true,
        canResultsEntry: true,
        canAuthorize: true,
        canDoctorPayouts: true,
        canAuditMaster: true,
        canEditRates: true,
        canDeleteBills: true,
        canSignOffReports: true,
        canViewLedger: true,
        canManageExpenses: true,
        canIssueRefunds: true,
        allowedBranches: '["main"]'
      }
    });

    // Update clinic default setting with the registered clinic name, email and phone
    const clinic = await prisma.clinicSetting.upsert({
      where: { id: 'clinic_default' },
      update: {
        clinicName: data.clinicName,
        email: data.email,
        phone: data.mobile
      },
      create: {
        id: 'clinic_default',
        clinicName: data.clinicName,
        email: data.email,
        phone: data.mobile
      }
    });

    // Provision 14-day full feature trial subscription (or selected plan)
    const plan = data.planTier || 'TRIAL';
    const trialDays = 14;
    const periodEnd = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);

    const subscription = await SubscriptionRepo.create({
      clinicId: clinic.id,
      planTier: plan,
      status: plan === 'TRIAL' ? 'TRIALING' : 'ACTIVE',
      billingCycle: 'MONTHLY',
      price: 0,
      trialEndsAt: periodEnd,
      currentPeriodStart: new Date(),
      currentPeriodEnd: periodEnd,
      maxCasesPerMonth: 999999,
      maxBranches: 3,
      features: JSON.stringify(['ALL_MODALITIES', 'NABL_COMPLIANCE', 'FORMULA_ENGINE', 'DELTA_CHECK', 'WHATSAPP_ALERTS']),
      paymentMethod: 'TRIAL'
    });

    // Generate JWT access token & 7-day refresh token
    const payload: AuthUserPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      isOwner: user.isOwner,
      branchId: 'main',
      canBilling: true,
      canResultsEntry: true,
      canAuthorize: true,
      canDoctorPayouts: true,
      canAuditMaster: true
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);
    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isOwner: user.isOwner,
        isEmailVerified: user.isEmailVerified,
        allowedBranches: ['main'],
        permissions: {
          canBilling: true,
          canResultsEntry: true,
          canAuthorize: true,
          canDoctorPayouts: true,
          canAuditMaster: true,
          canEditRates: true,
          canDeleteBills: true,
          canSignOffReports: true,
          canViewLedger: true,
          canManageExpenses: true,
          canIssueRefunds: true
        }
      },
      clinic: {
        name: clinic.clinicName,
        email: clinic.email,
        phone: clinic.phone
      },
      subscription: {
        planTier: subscription.planTier,
        status: subscription.status,
        daysRemaining: trialDays,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    };
  }
}

