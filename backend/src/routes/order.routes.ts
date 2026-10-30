import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { verifyToken, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Order creation can be guest or logged-in (optionalAuth extracts req.user if token provided)
router.post('/', optionalAuth, OrderController.createOrder);

// User orders
router.get('/', verifyToken, OrderController.getMyOrders);
router.get('/:id', OrderController.getOrderDetail);
router.patch('/:id/cancel', verifyToken, OrderController.cancelOrder);

export default router;
