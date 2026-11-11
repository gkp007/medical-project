import { Router } from 'express';
import { MasterController } from './master.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

// Public test directory
router.get('/public/tests', MasterController.listTests);

router.use(authenticate);

// Tests
router.get('/tests', MasterController.listTests);
router.get('/tests/:id', MasterController.getTestById);
router.put('/tests/:id/normal-values', MasterController.updateNormalValues);
router.post('/tests', MasterController.createTest);
router.put('/tests/:id', MasterController.updateTest);
router.delete('/tests/:id', MasterController.deleteTest);

// Packages
router.get('/packages', MasterController.listPackages);
router.post('/packages', MasterController.createPackage);
router.put('/packages/:id', MasterController.updatePackage);
router.delete('/packages/:id', MasterController.deletePackage);

// Panels
router.get('/panels', MasterController.listPanels);
router.post('/panels', MasterController.createPanel);
router.put('/panels/:id', MasterController.updatePanel);
router.delete('/panels/:id', MasterController.deletePanel);

// Categories
router.get('/categories', MasterController.listCategories);
router.post('/categories', MasterController.createCategory);
router.put('/categories/:id', MasterController.updateCategory);
router.delete('/categories/:id', MasterController.deleteCategory);

// Collection Agents
router.get('/agents', MasterController.listAgents);
router.post('/agents', MasterController.createAgent);
router.put('/agents/:id', MasterController.updateAgent);
router.delete('/agents/:id', MasterController.deleteAgent);

// Clinic Settings
router.get('/settings', MasterController.getClinicSettings);
router.put('/settings', MasterController.updateClinicSettings);

export default router;
