import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiRateLimiter } from './middlewares/rateLimiters.js';

const app: Application = express();

// Security & Utility Middlewares
const helmetFn = typeof helmet === 'function' ? helmet : (helmet as unknown as { default: () => express.RequestHandler }).default;
app.use(helmetFn());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      if (!origin || ENV.CLIENT_URL === '*' || origin === ENV.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, lockable in prod
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global API rate limiter
app.use('/api', apiRateLimiter);

// API v1 Routes
app.use('/api/v1', routes);

// Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
