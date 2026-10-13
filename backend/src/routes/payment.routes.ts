import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const paymentRouter = Router();

// Endpoint Webhook tự động nhận thông báo biến động số dư VietQR từ SePay
paymentRouter.post('/sepay/webhook', PaymentController.sepayWebhook);


// Cấu hình cổng thanh toán
paymentRouter.get('/settings', PaymentController.getSettings);
paymentRouter.get('/admin-settings', verifyToken, requireAdmin, PaymentController.getAdminSettings);
paymentRouter.put('/settings', verifyToken, requireAdmin, PaymentController.updateSettings);

export default paymentRouter;
