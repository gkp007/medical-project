import { Router } from 'express';
import { SecurityController } from './security.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

// Public terminal verification endpoint
router.post('/verify-browser', SecurityController.verifyBrowser);

router.use(authenticate);

router.get('/devices', SecurityController.listDevices);
router.post('/devices/register', SecurityController.registerOrTouchDevice);
router.patch('/devices/:id/toggle-block', SecurityController.toggleDeviceBlock);
router.patch('/devices/:id/rename', SecurityController.renameDevice);

export default router;
