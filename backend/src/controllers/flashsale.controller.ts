import { Request, Response } from 'express';
import { SettingModel } from '../models/Setting.model.js';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class FlashSaleController {
  /**
   * GET /api/v1/flash-sale
   * Lấy cấu hình và danh sách sản phẩm Flash Sale hiện tại
   */
  static async getFlashSale(_req: Request, res: Response): Promise<any> {
    try {
      const setting = await SettingModel.findOne({ key: 'flash_sale_config' });
      const config = setting?.value || {
        is_active: false,
        title: 'Flash Sale Hôm Nay',
        discount_badge: 'Giảm tới 45%',
        description: 'Số lượng có hạn trong khung giờ vàng nội thất',
        end_time: null,
        product_ids: [],
      };

      if (!config.is_active || !Array.isArray(config.product_ids) || config.product_ids.length === 0) {
        return sendSuccess(res, 'Flash Sale hiện đang tắt', {
          isActive: false,
          config,
          products: [],
        });
      }

      // Lấy danh sách sản phẩm theo ID được admin set
      const products = await ProductModel.find({
        s_ID: { $in: config.product_ids },
        is_active: true,
      }).lean();

      const productIds = products.map((p) => p.s_ID);
      const images = await ProductImageModel.find({
        s_product_ID: { $in: productIds },
      }).sort({ sort_order: 1 });

      const imageMap = new Map<string, string[]>();
      images.forEach((img: any) => {
        if (!imageMap.has(img.s_product_ID)) {
          imageMap.set(img.s_product_ID, []);
        }
        imageMap.get(img.s_product_ID)!.push(img.image_url);
      });

      const formatted = products.map((p: any) => ({
        id: p.s_ID,
        s_ID: p.s_ID,
        name: p.s_Name,
        slug: p.slug,
        categoryId: p.category_id,
        categoryName: p.category_name,
        price: p.price,
        originalPrice: p.original_price,
        discountPercent: p.discount_percent,
        inStock: p.in_stock,
        stockQuantity: p.stock_quantity,
        images: imageMap.get(p.s_ID) || [],
      }));

      return sendSuccess(res, 'Lấy flash sale thành công', {
        isActive: true,
        config,
        products: formatted,
      });
    } catch (e: any) {
      return sendError(res, e.message || 'Lỗi khi lấy Flash Sale', 500);
    }
  }

  /**
   * PUT /api/v1/flash-sale/config (Admin)
   */
  static async updateFlashSaleConfig(req: Request, res: Response): Promise<any> {
    try {
      const payload = req.body;
      const updated = await SettingModel.findOneAndUpdate(
        { key: 'flash_sale_config' },
        {
          key: 'flash_sale_config',
          value: {
            is_active: Boolean(payload.is_active),
            title: payload.title || 'Flash Sale Hôm Nay',
            discount_badge: payload.discount_badge || 'Giảm tới 45%',
            description: payload.description || 'Số lượng có hạn trong khung giờ vàng nội thất',
            end_time: payload.end_time || null,
            product_ids: Array.isArray(payload.product_ids) ? payload.product_ids : [],
          },
        },
        { upsert: true, new: true }
      );
      return sendSuccess(res, 'Cập nhật cấu hình Flash Sale thành công', updated.value);
    } catch (e: any) {
      return sendError(res, e.message || 'Lỗi lưu cấu hình Flash Sale', 500);
    }
  }
}
