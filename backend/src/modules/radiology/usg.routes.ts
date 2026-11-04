import { Router } from 'express';
import { RadiologyController } from './radiology.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// USG Worklist & findings
router.get('/worklist', RadiologyController.getUsgWorklist);
router.get('/cases/:caseId', RadiologyController.getStudyDetails);
router.post('/cases/:caseId/findings', RadiologyController.saveUsgFindings);
router.post('/cases/:caseId/authorize', RadiologyController.authorizeStudy);
router.get('/cases/:caseId/report', RadiologyController.getReport);

export default router;
