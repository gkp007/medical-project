import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.js';
import { AnalyzerController } from './analyzer.controller.js';

const router = Router();

// Protect all analyzer endpoints with authentication
router.use(authenticate);

router.get('/', AnalyzerController.listAnalyzers);
router.post('/', AnalyzerController.createAnalyzer);
router.get('/transmissions', AnalyzerController.getTransmissions);
router.post('/simulate', AnalyzerController.simulateRun);
router.get('/pending/:caseId', AnalyzerController.getPendingResultsForCase);
router.get('/:id', AnalyzerController.getAnalyzer);
router.put('/:id', AnalyzerController.updateAnalyzer);
router.put('/:id/mappings', AnalyzerController.saveMappings);

export default router;
