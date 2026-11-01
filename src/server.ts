import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });

  // Graceful shutdown
  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM received. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  });
};

startServer();