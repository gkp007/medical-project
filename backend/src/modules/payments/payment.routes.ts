import { Router } from 'express';
import { PaymentController } from './payment.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Due collection endpoint
router.post('/collect-due', PaymentController.collectDue);

// Transaction queries and updates
router.get('/transactions', PaymentController.getTransactions);
router.put('/transactions/:id', PaymentController.updateTransaction);

// Cashier drawer shifts
router.post('/cashier-shift/start', PaymentController.startShift);
router.post('/cashier-shift/close', PaymentController.closeShift);

export default router;
