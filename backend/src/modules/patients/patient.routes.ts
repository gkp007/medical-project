import { Router } from 'express';
import { PatientController } from './patient.controller.js';
import { validateRequest } from '../../core/middleware/validateRequest.js';
import { createPatientSchema, updatePatientSchema } from './patient.validation.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', PatientController.listPatients);
router.post('/', validateRequest({ body: createPatientSchema }), PatientController.createPatient);
router.get('/:id', PatientController.getPatientById);
router.put('/:id', validateRequest({ body: updatePatientSchema }), PatientController.updatePatient);
router.patch('/:id/archive', PatientController.archivePatient);
router.get('/:id/history', PatientController.getMedicalHistory);

export default router;
