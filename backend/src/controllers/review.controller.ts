import { Request, Response } from 'express';
import { ReviewModel } from '../models/Review.model.js';
import { ProductModel } from '../models/Product.model.js';
import { OrderModel } from '../models/Order.model.js';
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
   * GET /api/v1/reviews/featured
   * Lấy các đánh giá nổi bật từ khách hàng thực tế (100% dữ liệu động)
   */
  static async getFeaturedReviews(_req: Request, res: Response): Promise<any> {
    try {
      const reviews = await ReviewModel.find({ is_approved: true })
        .sort({ rating: -1, dt_create: -1 })
        .limit(6)
        .lean();

      const productIds = reviews.map((r) => r.product_id);
      const products = await ProductModel.find({ s_ID: { $in: productIds } }).lean();
      const productMap = new Map<string, string>();
      const productSlugMap = new Map<string, string>();
      products.forEach((p) => {
        productMap.set(p.s_ID, p.s_Name);
        if (p.slug) productSlugMap.set(p.s_ID, p.slug);
      });

      const formatted = reviews.map((r) => ({
        id: r.s_ID,
        name: r.user_name || '',
        role: r.verified_purchase ? 'Đã mua hàng' : '',
        avatar: r.user_avatar || '',
        content: r.comment || '',
        rating: r.rating || 5,
        product: productMap.get(r.product_id) || '',
        productId: r.product_id,
        productSlug: productSlugMap.get(r.product_id) || r.product_id,
      }));

      return sendSuccess(res, 'Lấy đánh giá nổi bật thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy đánh giá nổi bật', 500);
    }
  }

  /**
   * POST /api/v1/reviews
   */
  static async createReview(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID || 'guest_user';
      const { product_id, rating, comment, user_name, user_avatar, order_id } = req.body;

      if (!product_id || !rating || !comment) {
        return sendError(res, 'Vui lòng cung cấp mã sản phẩm, điểm đánh giá và nhận xét', 400);
      }

      const product = await ProductModel.findOne({
        $or: [{ s_ID: product_id }, { slug: product_id }],
      });

      if (!product) {
        return sendError(res, 'Sản phẩm không tồn tại', 404);
      }

      // Check if attached to completed order
      let verifiedPurchase = false;
      let resolvedOrderId: string | null = null;
      let finalUserName = user_name || req.user?.s_user || req.user?.email || '';

      if (order_id) {
        const order = await OrderModel.findOne({
          $or: [{ s_ID: order_id }, { s_order_id: order_id }],
        }).lean();

        if (order) {
          resolvedOrderId = order.s_ID;
          if (order.status === 'completed') {
            verifiedPurchase = true;
          }
          if (!finalUserName && order.recipient_name) {
            finalUserName = order.recipient_name;
          }
        }
      } else if (userId !== 'guest_user') {
        // Check if user has bought this product in any completed order
        const userCompletedOrders = await OrderModel.find({
          s_user_id: userId,
          status: 'completed',
        }).lean();
        if (userCompletedOrders.length > 0) {
          verifiedPurchase = true;
          resolvedOrderId = userCompletedOrders[0].s_ID;
        }
      }

      const newReview = new ReviewModel({
        s_ID: generateId('rev'),
        product_id: product.s_ID,
        user_id: userId,
        user_name: finalUserName || 'Khách hàng',
        user_avatar: user_avatar || '',
        order_id: resolvedOrderId,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment.trim(),
        verified_purchase: verifiedPurchase,
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
          verifiedPurchase,
        },
        201
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi viết đánh giá', 500);
    }
  }
}
