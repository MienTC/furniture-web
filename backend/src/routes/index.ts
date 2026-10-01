import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import addressRoutes from './address.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import voucherRoutes from './voucher.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import bannerRoutes from './banner.routes.js';
import aiRoutes from './ai.routes.js';

const rootRouter = Router();

rootRouter.use('/', healthRoutes);
rootRouter.use('/auth', authRoutes);
rootRouter.use('/addresses', addressRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/wishlist', wishlistRoutes);
rootRouter.use('/vouchers', voucherRoutes);
rootRouter.use('/orders', orderRoutes);
rootRouter.use('/reviews', reviewRoutes);
rootRouter.use('/banners', bannerRoutes);
rootRouter.use('/ai', aiRoutes);

export default rootRouter;
