import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', WishlistController.getMyWishlist);
router.post('/toggle', WishlistController.toggleWishlist);

export default router;
