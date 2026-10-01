import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/', CategoryController.getCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);

// Admin only
router.post('/', verifyToken, requireAdmin, CategoryController.createCategory);
router.put('/:id', verifyToken, requireAdmin, CategoryController.updateCategory);
router.delete('/:id', verifyToken, requireAdmin, CategoryController.deleteCategory);

export default router;
