import { Router } from 'express';
import { BannerController } from '../controllers/banner.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/', BannerController.getBanners);
router.get('/trustbar', BannerController.getTrustBar);
router.get('/showcase', BannerController.getShowcase);

// Admin
router.post('/', verifyToken, requireAdmin, BannerController.createBanner);

export default router;
