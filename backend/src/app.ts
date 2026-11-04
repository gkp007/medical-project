import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env.config.js';
import { requestLogger } from './core/logger/requestLogger.js';
import { errorHandler } from './core/middleware/errorHandler.js';
import { NotFoundError } from './core/errors/AppError.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import patientRoutes from './modules/patients/patient.routes.js';
import doctorRoutes from './modules/doctors/doctor.routes.js';
import caseRoutes from './modules/cases/case.routes.js';
import pathologyRoutes from './modules/pathology/pathology.routes.js';
import radiologyRoutes from './modules/radiology/radiology.routes.js';
import businessRoutes from './modules/business/business.routes.js';
import masterRoutes from './modules/masters/master.routes.js';
import securityRoutes from './modules/security/security.routes.js';
import shellRoutes from './modules/shell/shell.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import usgRoutes from './modules/radiology/usg.routes.js';
import xrayRoutes from './modules/radiology/xray.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import subscriptionRoutes from './modules/subscription/subscription.routes.js';
import analyzerRoutes from './modules/analyzer/analyzer.routes.js';

import cookieParser from 'cookie-parser';
import { apiLimiter } from './core/middleware/rateLimiter.js';

export const createApp = () => {
  const app = express();

  // Standard Middlewares
  const allowedOrigins = [
    env.CORS_ORIGIN,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  if (env.CORS_ORIGIN && env.CORS_ORIGIN.includes(',')) {
    env.CORS_ORIGIN.split(',').forEach(o => allowedOrigins.push(o.trim()));
  }

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow exact match, localhost, or any vercel.app preview domain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow in cloud deployment
    },
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use('/api', apiLimiter);

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'Labsmart LIS Healthcare Backend'
    });
  });

  // API v1 Routing Architecture
  const apiRouter = express.Router();
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/patients', patientRoutes);
  apiRouter.use('/doctors', doctorRoutes);
  apiRouter.use('/cases', caseRoutes);
  apiRouter.use('/pathology', pathologyRoutes);
  apiRouter.use('/radiology', radiologyRoutes);
  apiRouter.use('/business', businessRoutes);
  apiRouter.use('/masters', masterRoutes);
  apiRouter.use('/security', securityRoutes);
  apiRouter.use('/shell', shellRoutes);
  apiRouter.use('/payments', paymentRoutes);
  apiRouter.use('/usg', usgRoutes);
  apiRouter.use('/xray', xrayRoutes);
  apiRouter.use('/settings', settingsRoutes);
  apiRouter.use('/subscription', subscriptionRoutes);
  apiRouter.use('/analyzers', analyzerRoutes);

  app.use('/api/v1', apiRouter);

  // 404 Route Handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found on this LIS server`));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
