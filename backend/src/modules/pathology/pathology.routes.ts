import { Router } from 'express';
import { PathologyController } from './pathology.controller.js';
import { validateRequest } from '../../core/middleware/validateRequest.js';
import { saveResultsSchema, authorizeReportSchema, updateSampleStatusSchema } from './pathology.validation.js';
import { authenticate, requirePermission } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Worklists
router.get('/today', PathologyController.getTodayWorklist);
router.get('/worklist/today', PathologyController.getTodayWorklist);

// Sample status
router.patch(
  '/cases/:caseId/sample-status',
  validateRequest({ body: updateSampleStatusSchema }),
  PathologyController.updateSampleStatus
);

// Parameter entry grid
router.get('/cases/:caseId/worksheet', PathologyController.getResultsWorksheet);
router.get('/cases/:caseId/params', PathologyController.getResultsWorksheet);

// Draft / Results Entry
router.post(
  '/cases/:caseId/results',
  requirePermission('canResultsEntry'),
  validateRequest({ body: saveResultsSchema }),
  PathologyController.saveResults
);
router.post(
  '/cases/:caseId/draft',
  requirePermission('canResultsEntry'),
  validateRequest({ body: saveResultsSchema }),
  PathologyController.saveResults
);

// Sign-off / Authorization
router.post(
  '/cases/:caseId/authorize',
  requirePermission('canAuthorize'),
  validateRequest({ body: authorizeReportSchema }),
  PathologyController.authorizeReport
);
router.post(
  '/cases/:caseId/signoff',
  requirePermission('canAuthorize'),
  validateRequest({ body: authorizeReportSchema }),
  PathologyController.authorizeReport
);

// Medical Report (NABL Compliant) & Specimen Barcode
router.get('/cases/:caseId/report', PathologyController.getNablReport);
router.get('/cases/:caseId/report-pdf', PathologyController.getNablReport);
router.get('/cases/:caseId/barcode', PathologyController.getSpecimenBarcode);
router.post('/cases/:caseId/email-report', PathologyController.emailReport);

// Clinical Interpretations & Test statistics
router.get('/interpretations', PathologyController.getInterpretations);
router.post('/interpretations', PathologyController.createInterpretation);
router.put('/interpretations/:id', PathologyController.updateInterpretation);
router.delete('/interpretations/:id', PathologyController.deleteInterpretation);
router.get('/test-counts', PathologyController.getTestCounts);

export default router;
