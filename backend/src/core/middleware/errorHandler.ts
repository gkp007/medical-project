import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger/logger.js';
import { RequestWithTrace } from '../logger/requestLogger.js';

export const errorHandler = (
  err: Error,
  req: RequestWithTrace,
  res: Response,
  _next: NextFunction
) => {
  const traceId = req.traceId || 'unknown-trace';

  if (err instanceof AppError) {
    logger.warn({
      traceId,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
      message: err.message,
      details: err.details
    }, `Handled AppError: ${err.message}`);

    return res.status(err.statusCode).json({
      success: false,
      traceId,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details
      }
    });
  }

  // Unhandled internal server error
  logger.error({
    traceId,
    err: {
      message: err.message,
      stack: err.stack
    }
  }, `Unhandled Server Error: ${err.message}`);

  return res.status(500).json({
    success: false,
    traceId,
    error: {
      code: 'ERR_INTERNAL_SERVER',
      message: err.message || 'An unexpected internal medical server error occurred. Please contact laboratory IT support with the traceId.',
      details: err.message,
      traceId
    }
  });
};
