import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';

const router = Router();

// Public: Xem đánh giá nổi bật & đánh giá theo sản phẩm
router.get('/featured', ReviewController.getFeaturedReviews);
router.get('/product/:productId', ReviewController.getProductReviews);

// Cho phép tất cả người dùng (kể cả khách vãng lai) gửi đánh giá, không bắt buộc đăng nhập hay đã mua hàng
router.post('/', ReviewController.createReview);

export default router;
