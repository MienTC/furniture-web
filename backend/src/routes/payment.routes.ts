import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const paymentRouter = Router();

// Endpoint tạo URL thanh toán
paymentRouter.post('/vnpay/create-url', PaymentController.createVNPayUrl);

// Endpoint nhận phản hồi sau khi thanh toán từ VNPay (Return URL)
paymentRouter.get('/vnpay/callback', PaymentController.vnpayCallback);

// Endpoint IPN (Instant Payment Notification) từ VNPay
paymentRouter.get('/vnpay/ipn', PaymentController.vnpayIpn);

// Endpoint Webhook tự động nhận thông báo biến động số dư VietQR từ SePay
paymentRouter.post('/sepay/webhook', PaymentController.sepayWebhook);

// Cấu hình cổng thanh toán
paymentRouter.get('/settings', PaymentController.getSettings);
paymentRouter.get('/admin-settings', verifyToken, requireAdmin, PaymentController.getAdminSettings);
paymentRouter.put('/settings', verifyToken, requireAdmin, PaymentController.updateSettings);

export default paymentRouter;
