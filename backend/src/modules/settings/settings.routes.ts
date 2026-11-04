import { Router } from 'express';
import { SettingsController } from './settings.controller.js';
import { authenticate, requirePermission } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', SettingsController.getSettings);
router.put('/', requirePermission('canAuditMaster'), SettingsController.updateSettings);
router.get('/security', SettingsController.getSecuritySettings);
router.post('/test-sms', SettingsController.sendTestSms);
router.post('/test-email', SettingsController.sendTestEmail);

export default router;
