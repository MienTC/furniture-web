import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/product/:productId', ReviewController.getProductReviews);

// Write review
router.post('/', verifyToken, ReviewController.createReview);

export default router;
