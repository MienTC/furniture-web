import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public: Xem đánh giá nổi bật & đánh giá theo sản phẩm
router.get('/featured', ReviewController.getFeaturedReviews);
router.get('/product/:productId', ReviewController.getProductReviews);

// Cho phép người dùng gửi đánh giá (tự động nhận token nếu đã đăng nhập)
router.post('/', optionalAuth, ReviewController.createReview);

export default router;
