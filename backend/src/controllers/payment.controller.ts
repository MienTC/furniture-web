import { Request, Response } from 'express';
import crypto from 'crypto';
import { OrderModel } from '../models/Order.model.js';
import { SettingModel } from '../models/Setting.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class PaymentController {
  /**
   * Helper: Lấy cấu hình thanh toán từ Database
   */
  static async getEffectiveSettings() {
    const setting = await SettingModel.findOne({ key: 'payment_settings' });
    const val = setting?.value || {};
    return {
      cod_enabled: val.cod_enabled !== undefined ? val.cod_enabled : true,
      bank_transfer_enabled: val.bank_transfer_enabled !== undefined ? val.bank_transfer_enabled : true,
      bank_name: val.bank_name || 'MB Bank',
      bank_account_number: val.bank_account_number || '',
      bank_account_holder: val.bank_account_holder || '',
      bank_branch: val.bank_branch || '',
      sepay_enabled: val.sepay_enabled !== undefined ? val.sepay_enabled : true,
      sepay_merchant_id: val.sepay_merchant_id !== undefined ? val.sepay_merchant_id : '',
      sepay_api_key: val.sepay_api_key !== undefined ? val.sepay_api_key : '',
    };
  }

  /**
   * GET /api/v1/payment/settings (Public - masked sensitive data)
   */
  static async getSettings(_req: Request, res: Response): Promise<any> {
    try {
      const config = await PaymentController.getEffectiveSettings();
      // Mask secret key for public/client safety
      const publicConfig = {
        ...config,
        sepay_api_key: config.sepay_api_key ? '********' : '',
      };
      return sendSuccess(res, 'Lấy cấu hình thanh toán thành công', publicConfig);
    } catch (e: any) {
      return sendError(res, e.message || 'Lỗi lấy cấu hình thanh toán', 500);
    }
  }

  /**
   * GET /api/v1/payment/admin-settings (Admin - Full data)
   */
  static async getAdminSettings(_req: Request, res: Response): Promise<any> {
    try {
      const config = await PaymentController.getEffectiveSettings();
      return sendSuccess(res, 'Lấy cấu hình thanh toán admin thành công', config);
    } catch (e: any) {
      return sendError(res, e.message || 'Lỗi lấy cấu hình thanh toán', 500);
    }
  }

  /**
   * PUT /api/v1/payment/settings
   * Admin lưu cấu hình thanh toán
   */
  static async updateSettings(req: Request, res: Response): Promise<any> {
    try {
      const payload = req.body;
      const current = await PaymentController.getEffectiveSettings();

      let sepayKey = payload.sepay_api_key ? String(payload.sepay_api_key).trim() : '';
      if (sepayKey === '********' || !sepayKey) {
        sepayKey = current.sepay_api_key;
      }

      const updated = await SettingModel.findOneAndUpdate(
        { key: 'payment_settings' },
        {
          key: 'payment_settings',
          value: {
            cod_enabled: payload.cod_enabled !== undefined ? payload.cod_enabled : true,
            bank_transfer_enabled: payload.bank_transfer_enabled !== undefined ? payload.bank_transfer_enabled : true,
            bank_name: payload.bank_name || 'MB Bank',
            bank_account_number: payload.bank_account_number || '',
            bank_account_holder: payload.bank_account_holder || '',
            bank_branch: payload.bank_branch || '',
            sepay_enabled: payload.sepay_enabled !== undefined ? payload.sepay_enabled : false,
            sepay_merchant_id: (payload.sepay_merchant_id || '').trim(),
            sepay_api_key: sepayKey,
          },
        },
        { upsert: true, new: true }
      );
      return sendSuccess(res, 'Cập nhật cấu hình thanh toán thành công', updated.value);
    } catch (e: any) {
      return sendError(res, e.message || 'Lỗi cập nhật cấu hình thanh toán', 500);
    }
  }

  /**
   * POST /api/v1/payment/sepay/webhook
   * Webhook tự động nhận thông báo biến động số dư từ SePay
   */
  static async sepayWebhook(req: Request, res: Response): Promise<any> {
    try {
      const settings = await PaymentController.getEffectiveSettings();

      // Kiểm tra API Key / Authorization nếu người dùng cấu hình
      if (settings.sepay_api_key) {
        const authHeader = (req.headers.authorization || '') as string;
        const apiKeyHeader = (req.headers['x-api-key'] || req.headers['apikey'] || req.headers['x-secret-key'] || '') as string;
        const sepaySig = (req.headers['x-sepay-signature'] || '') as string;
        const incomingToken = authHeader.replace(/^(Bearer|Apikey)\s+/i, '').trim() || apiKeyHeader.trim();

        if (sepaySig && settings.sepay_api_key.startsWith('whsec_')) {
          const bodyString = JSON.stringify(req.body || {});
          const computed = crypto.createHmac('sha256', settings.sepay_api_key).update(bodyString).digest('hex');
          if (computed.toLowerCase() !== sepaySig.toLowerCase()) {
            return res.status(401).json({ success: false, message: 'Invalid HMAC-SHA256 signature' });
          }
        } else if (incomingToken && incomingToken !== settings.sepay_api_key) {
          return res.status(401).json({ success: false, message: 'Invalid API Key' });
        }
      }

      const body = req.body || {};

      // Xử lý cả 2 định dạng: SePay Bank Webhook và SePay Payment Gateway IPN
      const transferType = body.transferType || 'in';
      const transferAmount = body.transferAmount !== undefined 
        ? Number(body.transferAmount) 
        : (body.order?.order_amount !== undefined ? Number(body.order.order_amount) : (body.transaction?.transferAmount !== undefined ? Number(body.transaction.transferAmount) : 0));
      const content = String(body.content || body.order?.order_id || body.code || body.order?.id || body.transaction?.content || '').trim();
      const referenceCode = body.referenceCode || body.order?.order_invoice_number || body.transaction?.referenceCode;
      const id = body.id || body.transaction?.id || body.order?.id;

      // Xử lý gói tin Test từ SePay (Nút 'Gửi test' trên màn hình SePay)
      if (body.notification_type === 'TEST' || body.test === true || content.toUpperCase() === 'TEST' || (!content && !transferAmount)) {
        return res.status(200).json({ success: true, message: 'SePay Webhook test ping received successfully' });
      }

      // Chỉ xử lý tiền vào (transferType === 'in')
      if (transferType && transferType !== 'in') {
        return res.status(200).json({ success: true, message: 'Ignored outgoing transaction' });
      }

      if (!content || !transferAmount) {
        return res.status(200).json({ success: true, message: 'Missing transaction content or amount' });
      }

      // Trích xuất mã đơn hàng từ nội dung chuyển khoản (Hỗ trợ định dạng ORD... có hoặc không có gạch nối)
      const cleanContent = String(content).toUpperCase();

      // 1. Nhận diện các tiền tố ORD, LUX, OD đi kèm số (ví dụ: ORD525867 hoặc ORD-525867)
      const prefixMatch = cleanContent.match(/(?:ORD|LUX|OD)[-_]?([0-9]+)/i);
      const orderDigits = prefixMatch ? prefixMatch[1] : '';

      // 2. Tìm tất cả chuỗi số có độ dài >= 4 trong nội dung (ví dụ: '525867')
      const numericSequences = cleanContent.match(/[0-9]{4,}/g) || [];

      // 3. Tách các token từ
      const contentTokens = cleanContent.split(/[\s,._\-+/]+/);

      const queryConditions: any[] = [];

      if (orderDigits) {
        queryConditions.push({ s_order_id: { $regex: new RegExp(`ORD[-_]?${orderDigits}`, 'i') } });
        queryConditions.push({ s_order_id: { $regex: new RegExp(orderDigits, 'i') } });
        queryConditions.push({ s_ID: { $regex: new RegExp(orderDigits, 'i') } });
      }

      for (const num of numericSequences) {
        queryConditions.push({ s_order_id: { $regex: new RegExp(num, 'i') } });
        queryConditions.push({ s_ID: { $regex: new RegExp(num, 'i') } });
      }

      for (const token of contentTokens) {
        if (token.length >= 4) {
          queryConditions.push({ s_ID: { $regex: new RegExp(token, 'i') } });
          queryConditions.push({ s_order_id: { $regex: new RegExp(token, 'i') } });
        }
      }

      if (queryConditions.length === 0) {
        return res.status(200).json({ success: true, message: 'Cannot find order identifier in transaction content' });
      }

      const order = await OrderModel.findOne({ $or: queryConditions });

      if (!order) {
        return res.status(200).json({ success: true, message: 'Order not found in database or test request' });
      }

      // Nếu đơn hàng đã thanh toán trước đó
      if (order.payment_status === 'paid') {
        return res.status(200).json({ success: true, message: 'Order already paid', orderId: order.s_ID });
      }

      // Kiểm tra số tiền chuyển có đủ không (chấp nhận sai lệch <= 1000 đồng làm tròn)
      const amountDiff = Math.abs(order.total_amount - Number(transferAmount));
      if (amountDiff > 1000 && Number(transferAmount) < order.total_amount) {
        return res.status(200).json({
          success: false,
          message: `Amount mismatch: expected ${order.total_amount}, got ${transferAmount}`,
        });
      }

      // Đổi trạng thái đơn hàng sang ĐÃ THANH TOÁN (Paid)
      order.payment_status = 'paid';
      order.payment_method = 'bank_transfer';
      order.payment_transaction_id = String(referenceCode || id || 'SEPAY_' + Date.now());
      order.payment_paid_at = new Date();
      if (order.status === 'pending') {
        order.status = 'processing';
      }

      await order.save();

      return res.status(200).json({
        success: true,
        message: 'Order payment auto-confirmed successfully via SePay VietQR webhook',
        orderId: order.s_ID,
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message || 'SePay webhook error' });
    }
  }
}
