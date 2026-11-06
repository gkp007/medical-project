import { Router } from 'express';
import { CaseController } from './case.controller.js';
import { validateRequest } from '../../core/middleware/validateRequest.js';
import { createCaseSchema, collectDueSchema, cancelCaseSchema } from './case.validation.js';
import { authenticate, requirePermission } from '../../core/middleware/authenticate.js';

const router = Router();

// --- Public Patient Self-Service Routes (No Auth Required) ---
router.get('/public/track', CaseController.publicTrackCase);
router.get('/public/report/:id', CaseController.publicGetReport);
router.post('/public/book-appointment', CaseController.publicBookAppointment);

router.use(authenticate);

router.get('/', CaseController.listCases);
router.post(
  '/',
  requirePermission('canBilling'),
  validateRequest({ body: createCaseSchema }),
  CaseController.createCase
);
router.get('/:id', CaseController.getCaseById);
router.put('/:id', requirePermission('canBilling'), CaseController.updateCase);
router.patch('/:id/sample-status', CaseController.updateSampleStatus);
router.get('/:id/printable-bill', CaseController.getPrintableBill);
router.get('/:id/bill-pdf', CaseController.getPrintableBill);
router.get('/:id/barcodes', CaseController.getBarcodes);
router.post(
  '/:id/payments',
  requirePermission('canBilling'),
  validateRequest({ body: collectDueSchema }),
  CaseController.collectDue
);
router.post(
  '/:id/cancel',
  requirePermission('canBilling'),
  validateRequest({ body: cancelCaseSchema }),
  CaseController.cancelCase
);

export default router;
