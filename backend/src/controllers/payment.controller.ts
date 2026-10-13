import { Request, Response } from 'express';
import crypto from 'crypto';
import { OrderModel } from '../models/Order.model.js';
import { SettingModel } from '../models/Setting.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Giá trị mặc định (Fallback)
const DEFAULT_TMN_CODE = process.env.VNP_TMN_CODE || '2QXUI4J4';
const DEFAULT_HASH_SECRET = process.env.VNP_HASH_SECRET || 'RAOQUIVNZKZGUTOISIKGHYHYEUPNINWB';
const DEFAULT_SANDBOX_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Chuẩn hóa và sắp xếp params theo đúng tiêu chuẩn VNPay (RFC 1738 / encodeURIComponent)
 */
function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '')
    .sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, '+');
  }
  return sorted;
}

export class PaymentController {
  /**
   * Helper: Lấy cấu hình thanh toán từ Database
   */
  static async getEffectiveSettings() {
    const setting = await SettingModel.findOne({ key: 'payment_settings' });
    const val = setting?.value || {};
    return {
      vnpay_enabled: val.vnpay_enabled !== undefined ? val.vnpay_enabled : true,
      vnpay_tmn_code: val.vnpay_tmn_code !== undefined ? val.vnpay_tmn_code : (process.env.VNP_TMN_CODE || ''),
      vnpay_hash_secret: val.vnpay_hash_secret !== undefined ? val.vnpay_hash_secret : (process.env.VNP_HASH_SECRET || ''),
      vnpay_sandbox: val.vnpay_sandbox !== undefined ? val.vnpay_sandbox : true,
      vnpay_url: val.vnpay_sandbox === false
        ? 'https://pay.vnpayment.vn/vpcpay.html'
        : DEFAULT_SANDBOX_URL,
      cod_enabled: val.cod_enabled !== undefined ? val.cod_enabled : true,
      bank_transfer_enabled: val.bank_transfer_enabled !== undefined ? val.bank_transfer_enabled : true,
      bank_name: val.bank_name || 'MB Bank',
      bank_account_number: val.bank_account_number || '',
      bank_account_holder: val.bank_account_holder || '',
      bank_branch: val.bank_branch || '',
      sepay_enabled: val.sepay_enabled !== undefined ? val.sepay_enabled : false,
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
        vnpay_hash_secret: config.vnpay_hash_secret ? '********' : '',
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

      // Giữ lại hash_secret cũ nếu payload gửi dạng masked
      let secret = payload.vnpay_hash_secret ? String(payload.vnpay_hash_secret).trim() : '';
      if (secret === '********' || !secret) {
        secret = current.vnpay_hash_secret;
      }

      let sepayKey = payload.sepay_api_key ? String(payload.sepay_api_key).trim() : '';
      if (sepayKey === '********' || !sepayKey) {
        sepayKey = current.sepay_api_key;
      }

      const updated = await SettingModel.findOneAndUpdate(
        { key: 'payment_settings' },
        {
          key: 'payment_settings',
          value: {
            vnpay_enabled: payload.vnpay_enabled,
            vnpay_tmn_code: (payload.vnpay_tmn_code || '').trim(),
            vnpay_hash_secret: secret,
            vnpay_sandbox: payload.vnpay_sandbox !== undefined ? payload.vnpay_sandbox : true,
            cod_enabled: payload.cod_enabled,
            bank_transfer_enabled: payload.bank_transfer_enabled,
            bank_name: payload.bank_name || '',
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
   * POST /api/v1/payment/vnpay/create-url
   */
  static async createVNPayUrl(req: Request, res: Response): Promise<any> {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return sendError(res, 'Vui lòng cung cấp mã đơn hàng', 400);
      }

      const settings = await PaymentController.getEffectiveSettings();

      if (!settings.vnpay_enabled) {
        return sendError(res, 'Cổng thanh toán VNPay hiện đang tạm tắt. Vui lòng chọn phương thức thanh toán khác.', 400);
      }

      if (!settings.vnpay_tmn_code || !settings.vnpay_hash_secret) {
        return sendError(
          res,
          'Cổng VNPay chưa được cấu hình (Mã TMN Code hoặc Chuỗi bí mật). Vui lòng vào Quản trị > Cấu hình thanh toán để nhập thông tin.',
          400
        );
      }

      const isObjectId = /^[0-9a-fA-F]{24}$/.test(orderId);
      const order = await OrderModel.findOne({
        $or: [
          { s_ID: orderId },
          { s_order_id: orderId },
          ...(isObjectId ? [{ _id: orderId }] : []),
        ],
      });

      if (!order) {
        return sendError(res, 'Không tìm thấy đơn hàng cần thanh toán', 404);
      }

      if (order.payment_status === 'paid') {
        return sendError(res, 'Đơn hàng này đã được thanh toán thành công', 400);
      }

      const ipAddr =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';

      // Format YYYYMMDDHHmmss
      const date = new Date();
      const createDate =
        date.getFullYear().toString() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const returnUrl = `${req.protocol}://${req.get('host')}/api/v1/payment/vnpay/callback`;

      const vnpParams: Record<string, any> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: settings.vnpay_tmn_code,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: order.s_order_id,
        vnp_OrderInfo: `Thanh toan don hang ${order.s_order_id}`,
        vnp_OrderType: 'other',
        vnp_Amount: Math.round(order.total_amount * 100), // VNPay tính đơn vị x100
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr.includes('::') ? '127.0.0.1' : ipAddr,
        vnp_CreateDate: createDate,
      };

      const sortedParams = sortObject(vnpParams);
      const signData = Object.keys(sortedParams)
        .map((k) => `${k}=${sortedParams[k]}`)
        .join('&');

      // Ký dữ liệu bằng HMAC-SHA512
      const hmac = crypto.createHmac('sha512', settings.vnpay_hash_secret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      const paymentUrl = `${settings.vnpay_url}?${signData}&vnp_SecureHash=${signed}`;

      return sendSuccess(res, 'Tạo URL thanh toán VNPay thành công', { paymentUrl });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo liên kết thanh toán', 500);
    }
  }

  /**
   * GET /api/v1/payment/vnpay/callback
   */
  static async vnpayCallback(req: Request, res: Response): Promise<any> {
    try {
      let vnp_Params = { ...req.query } as Record<string, any>;
      const secureHash = vnp_Params['vnp_SecureHash'];

      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = sortObject(vnp_Params);
      const signData = Object.keys(vnp_Params)
        .map((k) => `${k}=${vnp_Params[k]}`)
        .join('&');

      const settings = await PaymentController.getEffectiveSettings();
      const hmac = crypto.createHmac('sha512', settings.vnpay_hash_secret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      const orderId = req.query.vnp_TxnRef as string;
      const responseCode = req.query.vnp_ResponseCode as string;

      const isObjectId = /^[0-9a-fA-F]{24}$/.test(orderId);
      const order = await OrderModel.findOne({
        $or: [
          { s_ID: orderId },
          { s_order_id: orderId },
          ...(isObjectId ? [{ _id: orderId }] : []),
        ],
      });

      if (!order) {
        return res.redirect(`${CLIENT_URL}/orders?payment=not_found`);
      }

      // Check chữ ký và mã phản hồi 00 = Thành công
      if (secureHash === signed && responseCode === '00') {
        order.payment_status = 'paid';
        order.payment_method = 'vnpay';
        order.payment_transaction_id = (req.query.vnp_TransactionNo as string) || '';
        order.payment_paid_at = new Date();
        if (order.status === 'pending') {
          order.status = 'processing';
        }
        await order.save();

        return res.redirect(`${CLIENT_URL}/orders/${order.s_order_id}?payment=success`);
      } else {
        return res.redirect(`${CLIENT_URL}/orders/${order.s_order_id}?payment=failed&code=${responseCode}`);
      }
    } catch (error: any) {
      return res.redirect(`${CLIENT_URL}/orders?payment=error`);
    }
  }

  /**
   * GET /api/v1/payment/vnpay/ipn
   * Server-to-server Instant Payment Notification từ VNPay
   */
  static async vnpayIpn(req: Request, res: Response): Promise<any> {
    try {
      let vnp_Params = { ...req.query } as Record<string, any>;
      const secureHash = vnp_Params['vnp_SecureHash'];

      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = sortObject(vnp_Params);
      const signData = Object.keys(vnp_Params)
        .map((k) => `${k}=${vnp_Params[k]}`)
        .join('&');

      const settings = await PaymentController.getEffectiveSettings();
      const hmac = crypto.createHmac('sha512', settings.vnpay_hash_secret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash !== signed) {
        return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
      }

      const orderId = req.query.vnp_TxnRef as string;
      const responseCode = req.query.vnp_ResponseCode as string;
      const vnpAmount = Number(req.query.vnp_Amount) / 100;

      const order = await OrderModel.findOne({
        $or: [{ s_ID: orderId }, { s_order_id: orderId }],
      });

      if (!order) {
        return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }

      if (Math.round(order.total_amount) !== Math.round(vnpAmount)) {
        return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
      }

      if (order.payment_status === 'paid') {
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
      }

      if (responseCode === '00') {
        order.payment_status = 'paid';
        order.payment_method = 'vnpay';
        order.payment_transaction_id = (req.query.vnp_TransactionNo as string) || '';
        order.payment_paid_at = new Date();
        if (order.status === 'pending') {
          order.status = 'processing';
        }
        await order.save();
        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        return res.status(200).json({ RspCode: '00', Message: 'Confirm Success (Failed payment recorded)' });
      }
    } catch (e: any) {
      return res.status(200).json({ RspCode: '99', Message: 'Unknow error' });
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

      // Trích xuất mã đơn hàng từ nội dung chuyển khoản (Hỗ trợ định dạng ORD... hoặc số ID đơn hàng)
      const cleanContent = String(content).toUpperCase();
      const orderMatches = cleanContent.match(/ORD[A-Z0-9_\-]+/i) || cleanContent.match(/LUX[A-Z0-9_\-]+/i) || cleanContent.match(/OD[0-9]+/i);
      
      let orderTargetId = orderMatches ? orderMatches[0] : '';
      
      // Nếu không khớp regex ORD, thử tìm tất cả từ trong content xem có từ nào khớp mã s_ID / s_order_id không
      const contentTokens = cleanContent.split(/[\s,._\-]+/);

      const queryConditions: any[] = [];
      if (orderTargetId) {
        queryConditions.push({ s_ID: { $regex: new RegExp(orderTargetId, 'i') } });
        queryConditions.push({ s_order_id: { $regex: new RegExp(orderTargetId, 'i') } });
      }

      // Tìm qua tokens
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
