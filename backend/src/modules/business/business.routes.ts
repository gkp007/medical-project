import { Router } from 'express';
import { BusinessController } from './business.controller.js';
import { authenticate } from '../../core/middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Dashboard Overview
router.get('/dashboard-metrics', BusinessController.getDashboardMetrics);
router.get('/activities', BusinessController.listActivities);

// Daily Business & Day-End Net Income
router.get('/daily-summary', BusinessController.getDailyBusiness);
router.get('/daily', BusinessController.getDailyBusiness);
router.get('/daily-report', BusinessController.getDailyReport);
router.post('/email-report', BusinessController.emailDailyReport);

// Accounts Receivable & Debt Aging
router.get('/dues-aging', BusinessController.getDuesAging);
router.get('/due-reports', BusinessController.getDueReports);
router.post('/due-reports/:caseId/waive', BusinessController.waiveDue);

// Expense Vouchers
router.get('/expenses', BusinessController.listExpenses);
router.post('/expenses', BusinessController.createExpense);
router.delete('/expenses/:id', BusinessController.deleteExpense);

// Doctor Referral Statements & Settlements
router.get('/referral-statements', BusinessController.getReferralStatements);
router.post('/doctors/:id/settle', BusinessController.settleDoctorPayout);

// Data Export
router.get('/export', BusinessController.exportData);
router.post('/export', BusinessController.exportData);

export default router;
