import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger.js';

export interface RequestWithTrace extends Request {
  traceId?: string;
  startTime?: number;
}

export const requestLogger = (req: RequestWithTrace, res: Response, next: NextFunction) => {
  const traceId = (req.headers['x-trace-id'] as string) || uuidv4();
  req.traceId = traceId;
  req.startTime = Date.now();
  res.setHeader('X-Trace-Id', traceId);

  logger.info({
    traceId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  }, `Incoming ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || 0);
    logger.info({
      traceId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    }, `Completed ${req.method} ${req.originalUrl} with status ${res.statusCode} (${duration}ms)`);
  });

  next();
};
