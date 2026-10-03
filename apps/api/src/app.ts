import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import crypto from 'node:crypto';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { ApiErrorResponse } from '@housie/shared';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: [env.WEB_URL],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Requested-With'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Attach Request-ID and HTTP Logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    res.setHeader('X-Request-Id', reqId);
    next();
  });

  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        genReqId: (req) => (req.headers['x-request-id'] as string) || crypto.randomUUID(),
      })
    );
  }

  // Liveness check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Readiness check
  app.get('/api/ready', (_req: Request, res: Response) => {
    // In Phase 0, returns ok. In Phase 1/2 will check Postgres + Redis connectivity.
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      redis: 'connected',
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler for unmatched routes
  app.use((_req: Request, res: Response) => {
    const errorResponse: ApiErrorResponse = {
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
      },
    };
    res.status(404).json(errorResponse);
  });

  // Global uniform error handling middleware
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, 'Unhandled application error');

    const errorResponse: ApiErrorResponse = {
      error: {
        code: 'INTERNAL_ERROR',
        message:
          env.NODE_ENV === 'production'
            ? 'An unexpected internal error occurred'
            : err instanceof Error
              ? err.message
              : 'Unknown internal error',
      },
    };

    res.status(500).json(errorResponse);
  });

  return app;
}
