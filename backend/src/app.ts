import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import rootRouter from './routes/index.js';
import { swaggerDocument } from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API v1 Routing
app.use('/api/v1', rootRouter);

// 404 & Global Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
