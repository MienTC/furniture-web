import { Request, Response } from 'express';
import { ReviewModel } from '../models/Review.model.js';
import { ProductModel } from '../models/Product.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class ReviewController {
  /**
   * GET /api/v1/reviews/product/:productId
   */
  static async getProductReviews(req: Request, res: Response): Promise<any> {
    try {
      const { productId } = req.params;
      const reviews = await ReviewModel.find({
        product_id: productId,
        is_approved: true,
      }).sort({ dt_create: -1 }).lean();

      const formatted = reviews.map((r) => ({
        id: r.s_ID,
        userName: r.user_name,
        userAvatar: r.user_avatar || undefined,
        rating: r.rating,
        date: r.dt_create ? new Date(r.dt_create).toISOString().split('T')[0] : '',
        comment: r.comment,
        verifiedPurchase: r.verified_purchase,
      }));

      return sendSuccess(res, 'Lấy đánh giá thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy đánh giá', 500);
    }
  }

  /**
   * POST /api/v1/reviews
   */
  static async createReview(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID || 'guest_user';
      const { product_id, rating, comment, user_name, user_avatar } = req.body;

      if (!product_id || !rating || !comment) {
        return sendError(res, 'Vui lòng cung cấp mã sản phẩm, điểm đánh giá và nhận xét', 400);
      }

      const product = await ProductModel.findOne({
        $or: [{ s_ID: product_id }, { slug: product_id }],
      });

      if (!product) {
        return sendError(res, 'Sản phẩm không tồn tại', 404);
      }

      const newReview = new ReviewModel({
        s_ID: generateId('rev'),
        product_id: product.s_ID,
        user_id: userId,
        user_name: user_name || req.user?.email?.split('@')[0] || 'Khách hàng',
        user_avatar: user_avatar || '',
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment.trim(),
        verified_purchase: true,
        is_approved: true,
      });

      await newReview.save();

      // Recalculate average rating & review count on product
      const allReviews = await ReviewModel.find({ product_id: product.s_ID, is_approved: true });
      const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avg = Number((totalScore / allReviews.length).toFixed(1));

      product.avg_rating = avg;
      product.review_count = allReviews.length;
      await product.save();

      return sendSuccess(
        res,
        'Gửi đánh giá thành công!',
        {
          id: newReview.s_ID,
          userName: newReview.user_name,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0],
          verifiedPurchase: true,
        },
        201
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi viết đánh giá', 500);
    }
  }
}
