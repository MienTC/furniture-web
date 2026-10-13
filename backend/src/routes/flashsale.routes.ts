import { Router } from 'express';
import { FlashSaleController } from '../controllers/flashsale.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const flashSaleRouter = Router();

// Public
flashSaleRouter.get('/', FlashSaleController.getFlashSale);

// Admin
flashSaleRouter.put('/config', verifyToken, requireAdmin, FlashSaleController.updateFlashSaleConfig);

export default flashSaleRouter;
