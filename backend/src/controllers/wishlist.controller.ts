import { Response } from 'express';
import { WishlistModel } from '../models/Wishlist.model.js';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class WishlistController {
  /**
   * GET /api/v1/wishlist
   */
  static async getMyWishlist(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const wishlists = await WishlistModel.find({ user_id: userId }).lean();

      const products = await Promise.all(
        wishlists.map(async (w) => {
          const product = await ProductModel.findOne({ s_ID: w.product_id }).lean();
          if (!product) return null;
          const imgs = await ProductImageModel.find({ s_product_ID: product.s_ID }).lean();
          return {
            ...product,
            images: imgs.map((i) => i.image_url),
          };
        })
      );

      return sendSuccess(res, 'Lấy danh sách yêu thích thành công', products.filter(Boolean));
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy wishlist', 500);
    }
  }

  /**
   * POST /api/v1/wishlist/toggle
   */
  static async toggleWishlist(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const { product_id } = req.body;

      if (!product_id) {
        return sendError(res, 'Mã sản phẩm là bắt buộc', 400);
      }

      const existing = await WishlistModel.findOne({
        user_id: userId,
        product_id,
      });

      if (existing) {
        await WishlistModel.findByIdAndDelete(existing._id);
        return sendSuccess(res, 'Đã xóa khỏi danh sách yêu thích', { isWishlisted: false });
      }

      const newWish = new WishlistModel({
        s_ID: generateId('wish'),
        user_id: userId,
        product_id,
      });
      await newWish.save();

      return sendSuccess(res, 'Đã thêm vào danh sách yêu thích', { isWishlisted: true }, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi toggle wishlist', 500);
    }
  }
}
