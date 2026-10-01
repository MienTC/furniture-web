import { Request, Response } from 'express';
import { VoucherModel } from '../models/Voucher.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class VoucherController {
  /**
   * Helper: format voucher to match FE `IFVoucher`
   */
  private static formatVoucher(v: any) {
    return {
      code: v.code,
      discountType: v.discount_type,
      discountValue: v.discount_value,
      minOrderValue: v.min_order_value,
      maxDiscount: v.max_discount || undefined,
      description: v.description,
    };
  }

  /**
   * GET /api/v1/vouchers
   */
  static async getActiveVouchers(_req: Request, res: Response): Promise<any> {
    try {
      const vouchers = await VoucherModel.find({
        is_active: true,
        $or: [{ end_date: null }, { end_date: { $gte: new Date() } }],
      }).lean();

      const formatted = vouchers.map(VoucherController.formatVoucher);
      return sendSuccess(res, 'Lấy danh sách mã giảm giá thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy voucher', 500);
    }
  }

  /**
   * GET /api/v1/vouchers/:code
   */
  static async getVoucherByCode(req: Request, res: Response): Promise<any> {
    try {
      const code = String(req.params.code).trim().toUpperCase();
      const voucher = await VoucherModel.findOne({
        code,
        is_active: true,
      });

      if (!voucher) {
        return sendError(res, `Mã giảm giá "${code}" không tồn tại hoặc đã hết hạn`, 404);
      }

      if (voucher.end_date && voucher.end_date < new Date()) {
        return sendError(res, 'Mã giảm giá này đã hết hạn sử dụng', 400);
      }

      if (voucher.usage_limit && voucher.usage_count >= voucher.usage_limit) {
        return sendError(res, 'Mã giảm giá này đã hết lượt sử dụng', 400);
      }

      return sendSuccess(
        res,
        'Mã giảm giá hợp lệ',
        VoucherController.formatVoucher(voucher)
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi kiểm tra voucher', 500);
    }
  }

  /**
   * POST /api/v1/vouchers (Admin)
   */
  static async createVoucher(req: Request, res: Response): Promise<any> {
    try {
      const {
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_value,
        max_discount,
        usage_limit,
        end_date,
      } = req.body;

      if (!code || !discount_type || discount_value === undefined) {
        return sendError(res, 'Mã, loại giảm và giá trị giảm là bắt buộc', 400);
      }

      const existing = await VoucherModel.findOne({ code: code.trim().toUpperCase() });
      if (existing) {
        return sendError(res, 'Mã voucher này đã tồn tại', 400);
      }

      const newVoucher = new VoucherModel({
        s_ID: generateId('vouch'),
        code: code.trim().toUpperCase(),
        name: name || code.trim().toUpperCase(),
        description: description || '',
        discount_type,
        discount_value: Number(discount_value),
        min_order_value: min_order_value ? Number(min_order_value) : 0,
        max_discount: max_discount ? Number(max_discount) : undefined,
        usage_limit: usage_limit ? Number(usage_limit) : 1000,
        end_date: end_date ? new Date(end_date) : undefined,
        is_active: true,
      });

      await newVoucher.save();
      return sendSuccess(res, 'Tạo mã giảm giá thành công', newVoucher, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo voucher', 500);
    }
  }
}
