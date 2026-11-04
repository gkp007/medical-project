import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger.js';
import { env } from '../../config/env.config.js';

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

  return client;
};

declare const globalThis: {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully');
  } catch (err: any) {
    logger.error({ error: err.message }, 'Failed to connect to database');
    throw err;
  }
};
