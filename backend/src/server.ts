import { createApp } from './app.js';
import { env } from './config/env.config.js';
import { logger } from './core/logger/logger.js';
import { connectDatabase, prisma } from './core/database/prisma.client.js';
import { AnalyzerService } from './modules/analyzer/analyzer.service.js';
import { seedAdminAndMastersIfNeeded } from './core/database/seedInit.js';

const startServer = async () => {
  try {
    await connectDatabase();
    await seedAdminAndMastersIfNeeded();
    await AnalyzerService.seedDefaultsIfNeeded();
    AnalyzerService.startListeners();

    const app = createApp();
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Labsmart LIS Backend running on http://localhost:${env.PORT} in [${env.NODE_ENV}] mode`);
      logger.info(`🏥 Clinic: ${env.CLINIC_NAME}`);
      logger.info(`📋 NABL Accreditation: ${env.NABL_ACCREDITATION_NO}`);
    });

    // Graceful Shutdown Signals
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully closing HTTP server and database pool...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database disconnected. Process terminating gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err: any) {
    logger.error({ error: err.message, stack: err.stack }, 'Fatal server boot failure');
    process.exit(1);
  }
};

startServer();
