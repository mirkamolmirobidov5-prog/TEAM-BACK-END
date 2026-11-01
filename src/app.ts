import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import routes from './routes';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/errorHandler';
import logger from './utils/logger';

const app: Application = express();

// Security
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging (Morgan → Winston)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartBiz API is running',
    timestamp: new Date().toISOString(),
  });
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SmartBiz API Docs',
}));

// API routes
app.use('/api/v1', routes);

// 404
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
