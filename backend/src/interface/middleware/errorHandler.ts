import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error]', err.message);
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
