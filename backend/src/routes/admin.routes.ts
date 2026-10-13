import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  updateOrderStatusSchema,
  toggleUserStatusSchema,
} from '../dto/admin.dto.js';

const adminRouter = Router();

// Tất cả các route /admin đều yêu cầu có JWT hợp lệ và vai trò admin
adminRouter.use(verifyToken, requireAdmin);

/**
 * Thống kê Dashboard
 */
adminRouter.get('/stats', AdminController.getStats);

/**
 * Quản lý Sản phẩm
 */
adminRouter.get('/products', AdminController.getProducts);
adminRouter.post('/products', validateBody(createProductSchema), AdminController.createProduct);
adminRouter.put('/products/:id', validateBody(updateProductSchema), AdminController.updateProduct);
adminRouter.delete('/products/:id', AdminController.deleteProduct);

/**
 * Quản lý Đơn hàng
 */
adminRouter.get('/orders', AdminController.getOrders);
adminRouter.patch('/orders/:id/status', validateBody(updateOrderStatusSchema), AdminController.updateOrderStatus);

/**
 * Quản lý Danh mục
 */
adminRouter.get('/categories', AdminController.getCategories);
adminRouter.post('/categories', AdminController.createCategory);
adminRouter.put('/categories/:id', AdminController.updateCategory);
adminRouter.delete('/categories/:id', AdminController.deleteCategory);
adminRouter.post('/categories/:id/products', AdminController.addProductsToCategory);
adminRouter.delete('/categories/:id/products', AdminController.removeProductsFromCategory);

/**
 * Quản lý Banners
 */
adminRouter.get('/banners', AdminController.getBanners);
adminRouter.post('/banners', AdminController.createBanner);
adminRouter.put('/banners/:id', AdminController.updateBanner);
adminRouter.delete('/banners/:id', AdminController.deleteBanner);

/**
 * Quản lý Người dùng
 */
adminRouter.get('/users', AdminController.getUsers);
adminRouter.patch('/users/:id/status', validateBody(toggleUserStatusSchema), AdminController.toggleUserStatus);
adminRouter.put('/users/:id', AdminController.updateUser);
adminRouter.post('/users/:id/reset-password', AdminController.resetUserPassword);
adminRouter.get('/users/:id/orders', AdminController.getUserOrders);

/**
 * Quản lý Vouchers
 */
adminRouter.get('/vouchers', AdminController.getVouchers);
adminRouter.post('/vouchers', AdminController.createVoucher);
adminRouter.delete('/vouchers/:id', AdminController.deleteVoucher);

/**
 * Quản lý Đánh giá
 */
adminRouter.get('/reviews', AdminController.getReviews);
adminRouter.patch('/reviews/:id/reply', AdminController.replyReview);
adminRouter.delete('/reviews/:id', AdminController.deleteReview);

/**
 * Quản lý Thông tin liên hệ & Zalo
 */
adminRouter.get('/contact-settings', AdminController.getContactSettings);
adminRouter.put('/contact-settings', AdminController.updateContactSettings);

export default adminRouter;
