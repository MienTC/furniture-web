import { Response } from 'express';
import { CartModel } from '../models/Cart.model.js';
import { CartItemModel } from '../models/CartItem.model.js';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class CartController {
  /**
   * Helper: ensure user has a cart
   */
  private static async getOrCreateCart(userId: string) {
    let cart = await CartModel.findOne({ user_id: userId });
    if (!cart) {
      cart = new CartModel({
        s_ID: generateId('cart'),
        user_id: userId,
      });
      await cart.save();
    }
    return cart;
  }

  /**
   * GET /api/v1/cart
   */
  static async getMyCart(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const cart = await CartController.getOrCreateCart(userId);

      const items = await CartItemModel.find({ s_cart_id: cart.s_ID }).lean();

      // Populate product details for FE format: { product, quantity, selectedColor }
      const populatedItems = await Promise.all(
        items.map(async (item) => {
          const product = await ProductModel.findOne({ s_ID: item.product_id }).lean();
          if (!product) return null;

          const imgs = await ProductImageModel.find({ s_product_ID: product.s_ID })
            .sort({ is_primary: -1 })
            .lean();

          return {
            id: item.s_ID,
            product: {
              id: product.s_ID,
              s_ID: product.s_ID,
              name: product.s_Name,
              slug: product.slug,
              categoryId: product.category_id,
              price: product.price,
              originalPrice: product.original_price,
              images: imgs.map((i) => i.image_url),
              inStock: product.in_stock,
              stockQuantity: product.stock_quantity,
            },
            quantity: item.quantity,
            selectedColor: item.selected_color,
          };
        })
      );

      const validItems = populatedItems.filter(Boolean);

      return sendSuccess(res, 'Lấy giỏ hàng thành công', {
        cartId: cart.s_ID,
        items: validItems,
        totalItems: validItems.reduce((acc, curr: any) => acc + curr.quantity, 0),
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy giỏ hàng', 500);
    }
  }

  /**
   * POST /api/v1/cart/items
   */
  static async addToCart(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const { product_id, variant_id, quantity = 1, selected_color = '' } = req.body;

      if (!product_id) {
        return sendError(res, 'Vui lòng cung cấp mã sản phẩm', 400);
      }

      // Check product existence and stock
      const product = await ProductModel.findOne({
        $or: [{ s_ID: product_id }, { slug: product_id }],
        is_active: true,
      });

      if (!product) {
        return sendError(res, 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh', 404);
      }

      if (product.stock_quantity < quantity) {
        return sendError(res, `Sản phẩm chỉ còn ${product.stock_quantity} trong kho`, 400);
      }

      const cart = await CartController.getOrCreateCart(userId);

      // Find existing item with same product and color
      let cartItem = await CartItemModel.findOne({
        s_cart_id: cart.s_ID,
        product_id: product.s_ID,
        selected_color,
      });

      if (cartItem) {
        const newQty = cartItem.quantity + Number(quantity);
        if (newQty > product.stock_quantity) {
          return sendError(res, `Số lượng vượt quá tồn kho (${product.stock_quantity})`, 400);
        }
        cartItem.quantity = newQty;
        await cartItem.save();
      } else {
        cartItem = new CartItemModel({
          s_ID: generateId('item'),
          s_cart_id: cart.s_ID,
          product_id: product.s_ID,
          variant_id: variant_id || null,
          quantity: Number(quantity),
          selected_color,
        });
        await cartItem.save();
      }

      return sendSuccess(res, 'Đã thêm sản phẩm vào giỏ hàng', cartItem);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi thêm vào giỏ hàng', 500);
    }
  }

  /**
   * PUT /api/v1/cart/items/:id
   */
  static async updateQuantity(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || Number(quantity) < 1) {
        return sendError(res, 'Số lượng không hợp lệ', 400);
      }

      const cartItem = await CartItemModel.findOne({ s_ID: id });
      if (!cartItem) {
        return sendError(res, 'Không tìm thấy sản phẩm trong giỏ', 404);
      }

      const product = await ProductModel.findOne({ s_ID: cartItem.product_id });
      if (product && product.stock_quantity < Number(quantity)) {
        return sendError(res, `Kho chỉ còn ${product.stock_quantity} sản phẩm`, 400);
      }

      cartItem.quantity = Number(quantity);
      await cartItem.save();

      return sendSuccess(res, 'Cập nhật số lượng thành công', cartItem);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi cập nhật giỏ hàng', 500);
    }
  }

  /**
   * DELETE /api/v1/cart/items/:id
   */
  static async removeItem(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const deleted = await CartItemModel.findOneAndDelete({ s_ID: id });

      if (!deleted) {
        return sendError(res, 'Không tìm thấy sản phẩm trong giỏ', 404);
      }

      return sendSuccess(res, 'Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ', 500);
    }
  }

  /**
   * DELETE /api/v1/cart/clear
   */
  static async clearCart(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const cart = await CartModel.findOne({ user_id: userId });
      if (cart) {
        await CartItemModel.deleteMany({ s_cart_id: cart.s_ID });
      }
      return sendSuccess(res, 'Đã xóa toàn bộ giỏ hàng');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa giỏ hàng', 500);
    }
  }
}
