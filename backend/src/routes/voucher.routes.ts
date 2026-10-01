import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/', VoucherController.getActiveVouchers);
router.get('/:code', VoucherController.getVoucherByCode);

// Admin
router.post('/', verifyToken, requireAdmin, VoucherController.createVoucher);

export default router;
