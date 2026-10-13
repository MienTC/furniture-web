import { Request, Response } from 'express';
import { BannerModel } from '../models/Banner.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class BannerController {
  /**
   * GET /api/v1/banners
   */
  static async getBanners(_req: Request, res: Response): Promise<any> {
    try {
      const banners = await BannerModel.find({ type: 'hero', is_active: true })
        .sort({ sort_order: 1 })
        .lean();

      const formatted = banners.map((b) => ({
        id: b.s_ID,
        title: b.title,
        subtitle: b.subtitle,
        image: b.image_url,
        imageUrl: b.image_url,
        link: b.link_url,
        linkUrl: b.link_url,
        badgeText: b.badge_text,
        isActive: b.is_active,
        sortOrder: b.sort_order,
      }));

      return sendSuccess(res, 'Lấy danh sách banner thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy banner', 500);
    }
  }

  /**
   * GET /api/v1/banners/trustbar
   */
  static async getTrustBar(_req: Request, res: Response): Promise<any> {
    try {
      const items = await BannerModel.find({ type: 'trustbar', is_active: true })
        .sort({ sort_order: 1 })
        .lean();

      const formatted = items.map((i) => ({
        id: i.s_ID,
        title: i.title,
        subtitle: i.subtitle,
        iconName: i.icon_name || 'Shield',
        sortOrder: i.sort_order,
      }));

      return sendSuccess(res, 'Lấy trustbar thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy trustbar', 500);
    }
  }

  /**
   * GET /api/v1/banners/showcase
   */
  static async getShowcase(_req: Request, res: Response): Promise<any> {
    try {
      const showcase = await BannerModel.findOne({ type: 'showcase', is_active: true }).lean();

      if (!showcase) {
        return sendSuccess(res, 'Không có showcase', null);
      }

      return sendSuccess(res, 'Lấy showcase thành công', {
        title: showcase.title,
        description: showcase.subtitle,
        imageUrl: showcase.image_url,
        badgeText: showcase.badge_text || '',
        highlights: Array.isArray(showcase.highlights) ? showcase.highlights : [],
        ctaLabel: 'Khám Phá Bộ Sưu Tập',
        ctaLink: showcase.link_url || '/products',
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy showcase', 500);
    }
  }

  /**
   * GET /api/v1/banners/promo-img4
   * Lấy cấu hình ảnh ưu đãi img4 từ Admin
   */
  static async getPromoImg4(_req: Request, res: Response): Promise<any> {
    try {
      const banner = await BannerModel.findOne({ type: 'promo_img4', is_active: true }).lean();
      return sendSuccess(res, 'Lấy ảnh ưu đãi thành công', banner || null);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy banner ưu đãi', 500);
    }
  }

  /**
   * POST /api/v1/banners (Admin)
   */
  static async createBanner(req: Request, res: Response): Promise<any> {
    try {
      const { title, subtitle, image_url, link_url, badge_text, type, sort_order } = req.body;

      if (!title) {
        return sendError(res, 'Tiêu đề banner là bắt buộc', 400);
      }

      const newBanner = new BannerModel({
        s_ID: generateId('ban'),
        title: title.trim(),
        subtitle: subtitle || '',
        image_url: image_url || '',
        link_url: link_url || '',
        badge_text: badge_text || '',
        type: type || 'hero',
        sort_order: sort_order || 0,
        is_active: true,
      });

      await newBanner.save();
      return sendSuccess(res, 'Tạo banner thành công', newBanner, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo banner', 500);
    }
  }
}
