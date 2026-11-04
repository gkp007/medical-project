import { Router } from 'express';
import { RadiologyController } from './radiology.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Digital X-Ray Worklist & findings
router.get('/worklist', RadiologyController.getXrayWorklist);
router.get('/cases/:caseId', RadiologyController.getStudyDetails);
router.post('/cases/:caseId/findings', RadiologyController.saveXrayFindings);
router.post('/cases/:caseId/authorize', RadiologyController.authorizeStudy);
router.get('/cases/:caseId/report', RadiologyController.getReport);

export default router;
