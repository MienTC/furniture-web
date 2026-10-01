import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import rootRouter from './routes/index.js';
import { swaggerDocument } from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';

const app: Application = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://luxdecor.id.vn',
  'http://luxdecor.id.vn',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for production deployment
    },
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check root endpoint for VibeHost & uptime monitors
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'LuxDecor API Server' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API v1 Routing
app.use('/api/v1', rootRouter);

// 404 & Global Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
