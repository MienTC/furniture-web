import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Order creation can be guest or logged-in
router.post('/', OrderController.createOrder);

// User orders
router.get('/', verifyToken, OrderController.getMyOrders);
router.get('/:id', verifyToken, OrderController.getOrderDetail);
router.patch('/:id/cancel', verifyToken, OrderController.cancelOrder);

export default router;
