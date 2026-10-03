import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = createApp();
const server = http.createServer(app);

server.listen(env.PORT, () => {
  logger.info(`🚀 API Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Process signal handling
function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, initiating graceful shutdown...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { app, server };
export default app;
