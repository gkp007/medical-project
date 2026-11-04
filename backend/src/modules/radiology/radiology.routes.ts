import { Router } from 'express';
import { RadiologyController } from './radiology.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/worklist', RadiologyController.getWorklist);
router.get('/cases/:caseId', RadiologyController.getStudyDetails);
router.post('/cases/:caseId/findings', RadiologyController.saveFindings);
router.post('/cases/:caseId/usg-findings', RadiologyController.saveUsgFindings);
router.post('/cases/:caseId/xray-findings', RadiologyController.saveXrayFindings);
router.post('/cases/:caseId/authorize', RadiologyController.authorizeStudy);
router.get('/cases/:caseId/report', RadiologyController.getReport);

router.get('/templates', RadiologyController.listTemplates);
router.post('/templates', RadiologyController.createTemplate);

router.get('/signatures', RadiologyController.listSignatures);
router.post('/signatures', RadiologyController.createSignature);

export default router;
