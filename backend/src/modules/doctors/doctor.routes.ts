import { Router } from 'express';
import { DoctorController } from './doctor.controller.js';
import { validateRequest } from '../../core/middleware/validateRequest.js';
import { createDoctorSchema, updateDoctorSchema, recordPayoutSchema } from './doctor.validation.js';
import { authenticate, requirePermission } from '../../core/middleware/authenticate.js';

const router = Router();

// Public doctor directory for landing page (no auth required)
router.get('/public', DoctorController.listDoctors);

router.use(authenticate);

router.get('/', DoctorController.listDoctors);
router.post('/', validateRequest({ body: createDoctorSchema }), DoctorController.createDoctor);
router.put('/:id', validateRequest({ body: updateDoctorSchema }), DoctorController.updateDoctor);
router.patch('/:id/toggle-status', DoctorController.toggleDoctorStatus);
router.patch('/:id/toggle-portal', DoctorController.togglePortalAccess);
router.post(
  '/payout',
  requirePermission('canDoctorPayouts'),
  validateRequest({ body: recordPayoutSchema }),
  DoctorController.recordPayout
);

export default router;
