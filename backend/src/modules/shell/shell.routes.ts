import { Router } from 'express';
import { ShellController } from './shell.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/context', ShellController.getContext);
router.get('/omnisearch', ShellController.omnisearch);
router.post('/tickets', ShellController.createTicket);
router.post('/recharge-sms', ShellController.rechargeCredits);

export default router;
