import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', CartController.getMyCart);
router.post('/items', CartController.addToCart);
router.put('/items/:id', CartController.updateQuantity);
router.delete('/items/:id', CartController.removeItem);
router.delete('/clear', CartController.clearCart);

export default router;
