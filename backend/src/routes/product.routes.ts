import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/', ProductController.getProducts);
router.get('/:slug', ProductController.getProductBySlug);

// Admin only
router.post('/', verifyToken, requireAdmin, ProductController.createProduct);
router.put('/:id', verifyToken, requireAdmin, ProductController.updateProduct);
router.delete('/:id', verifyToken, requireAdmin, ProductController.deleteProduct);

// Images
router.post('/:id/images', verifyToken, requireAdmin, ProductController.addImage);
router.delete('/:id/images/:imageId', verifyToken, requireAdmin, ProductController.deleteImage);

export default router;
