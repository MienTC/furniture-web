import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, 'LuxDecor API Server is healthy and running smoothly!', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
