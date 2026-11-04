import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { SecurityController } from '../security/security.controller.js';
import { validateRequest } from '../../core/middleware/validateRequest.js';
import { loginSchema, createEmployeeSchema, registerClinicSchema } from './auth.validation.js';
import { authenticate, requirePermission } from '../../core/middleware/authenticate.js';
import { authLimiter } from '../../core/middleware/rateLimiter.js';

const router = Router();

// Public routes
router.post('/register', authLimiter, validateRequest({ body: registerClinicSchema }), AuthController.register);
router.post('/login', authLimiter, validateRequest({ body: loginSchema }), AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-browser', SecurityController.verifyBrowser);

// Authenticated session & security routes
router.get('/me', authenticate, AuthController.me);
router.post('/switch-branch', authenticate, AuthController.switchBranch);
router.post('/logout', authenticate, AuthController.logout);
router.post('/send-verification-email', authenticate, AuthController.sendVerificationEmail);
router.post('/lock-terminal', authenticate, AuthController.lockTerminal);
router.post('/unlock-terminal', authenticate, AuthController.unlockTerminal);
router.post('/support-ticket', authenticate, AuthController.createSupportTicket);

// Protected Employee Administration routes
router.get('/employees', authenticate, AuthController.listEmployees);
router.post(
  '/employees',
  authenticate,
  requirePermission('canAuditMaster'),
  validateRequest({ body: createEmployeeSchema }),
  AuthController.createEmployee
);
router.patch(
  '/employees/:id/toggle-status',
  authenticate,
  requirePermission('canAuditMaster'),
  AuthController.toggleEmployeeStatus
);

export default router;
