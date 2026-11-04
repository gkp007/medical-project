import { Router } from 'express';
import { SubscriptionController } from './subscription.controller.js';
import { authenticate, requireRole } from '../../core/middleware/authenticate.js';

const router = Router();

// Public plans catalog
router.get('/plans', SubscriptionController.getPlans);

// Authenticated subscription endpoints
router.get('/current', authenticate, SubscriptionController.getCurrentSubscription);
router.post('/subscribe', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), SubscriptionController.subscribe);
router.post('/cancel', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), SubscriptionController.cancel);

export default router;
