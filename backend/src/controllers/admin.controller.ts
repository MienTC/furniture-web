import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { OrderModel } from '../models/Order.model.js';
import { OrderDetailModel } from '../models/OrderDetail.model.js';
import { UserModel } from '../models/User.model.js';
import { CategoryModel } from '../models/Category.model.js';
import { BannerModel } from '../models/Banner.model.js';
import { VoucherModel } from '../models/Voucher.model.js';
import { ReviewModel } from '../models/Review.model.js';
import { SettingModel } from '../models/Setting.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class AdminController {
  /**
   * GET /api/v1/admin/stats
   * Lấy số liệu thống kê tổng quan cho Admin Dashboard
   */
  static async getStats(req: AuthRequest, res: Response): Promise<any> {
    try {
      const [
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        recentOrders,
        ordersData,
      ] = await Promise.all([
        ProductModel.countDocuments({ is_active: true }),
        OrderModel.countDocuments(),
        UserModel.countDocuments(),
        CategoryModel.countDocuments({ is_active: true }),
        OrderModel.find().sort({ dt_created: -1 }).limit(5),
        OrderModel.find({
          status: { $ne: 'cancelled' },
          payment_status: { $in: ['paid', 'completed'] },
        }).select('total_amount s_ID'),
      ]);

      const totalRevenue = ordersData.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

      // Thống kê đơn theo trạng thái
      const orderStatusCounts = await OrderModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      // Thống kê doanh thu theo 14 ngày gần nhất (chỉ tính đơn hàng đã thanh toán thực tế)
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const revenueByDate = await OrderModel.aggregate([
        {
          $match: {
            dt_created: { $gte: fourteenDaysAgo },
            status: { $ne: 'cancelled' },
            payment_status: { $in: ['paid', 'completed'] },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%d/%m', date: '$dt_created' } },
            revenue: {
              $sum: '$total_amount',
            },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Thống kê doanh thu theo từng danh mục từ các đơn đã thanh toán
      const paidOrderIds = ordersData.map((o) => o.s_ID);
      const categoryRevenue = await OrderDetailModel.aggregate([
        { $match: { s_order_id: { $in: paidOrderIds } } },
        {
          $lookup: {
            from: 'LS_Products',
            localField: 's_product_id',
            foreignField: 's_ID',
            as: 'product',
          },
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$product.category_name',
            revenue: { $sum: '$line_total' },
            count: { $sum: '$quantity' },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 6 },
      ]);

      // Top sản phẩm bán chạy nhất theo doanh thu từ các đơn đã thanh toán
      const topSellingProducts = await OrderDetailModel.aggregate([
        { $match: { s_order_id: { $in: paidOrderIds } } },
        {
          $group: {
            _id: '$product_name',
            revenue: { $sum: '$line_total' },
            quantity: { $sum: '$quantity' },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 6 },
      ]);

      // Thống kê phân bổ sản phẩm theo danh mục (dự phòng)
      const categoryDistribution = await ProductModel.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: '$category_name',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]);

      return sendSuccess(res, 'Lấy dữ liệu thống kê dashboard thành công', {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        totalCategories,
        orderStatusCounts: orderStatusCounts.reduce((acc: any, cur) => {
          acc[cur._id] = cur.count;
          return acc;
        }, {}),
        revenueByDate: revenueByDate.map((r) => ({
          date: r._id,
          revenue: r.revenue,
          orders: r.orders,
        })),
        topProducts: topSellingProducts.map((p) => ({
          name: p._id,
          revenue: p.revenue,
          quantity: p.quantity,
        })),
        categoryRevenue: categoryRevenue.map((c) => ({
          name: c._id,
          revenue: c.revenue,
          count: c.count,
        })),
        categoryDistribution: categoryDistribution.map((c) => ({
          name: c._id,
          count: c.count,
        })),
        recentOrders,
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy dữ liệu thống kê admin', 500);
    }
  }

  /**
   * GET /api/v1/admin/products
   */
  static async getProducts(req: AuthRequest, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = (req.query.search as string || '').trim();
      const categoryId = req.query.categoryId as string;

      const query: any = {};
      if (search) {
        query.$or = [
          { s_Name: { $regex: search, $options: 'i' } },
          { s_ID: { $regex: search, $options: 'i' } },
        ];
      }
      if (categoryId) {
        query.category_id = categoryId;
      }

      const total = await ProductModel.countDocuments(query);
      const items = await ProductModel.find(query)
        .sort({ dt_create: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const productIds = items.map((p) => p.s_ID);
      const allImages = await ProductImageModel.find({
        s_product_ID: { $in: productIds },
      }).sort({ sort_order: 1 });

      const imageMap = new Map<string, string[]>();
      allImages.forEach((img: any) => {
        if (!imageMap.has(img.s_product_ID)) {
          imageMap.set(img.s_product_ID, []);
        }
        imageMap.get(img.s_product_ID)!.push(img.image_url);
      });

      const mapped = items.map((p: any) => ({
        id: p.s_ID,
        s_ID: p.s_ID,
        name: p.s_Name,
        slug: p.slug,
        categoryId: p.category_id,
        categoryName: p.category_name,
        price: p.price,
        originalPrice: p.original_price,
        discountPercent: p.discount_percent,
        inStock: p.in_stock,
        stockQuantity: p.stock_quantity,
        isFeatured: p.is_featured,
        isNew: p.is_new,
        images: imageMap.get(p.s_ID) || [],
        description: p.description,
        material: p.material,
        dimensions: p.dimensions,
        videoUrl: (p as any).video_url || '',
        origin: p.origin,
        warranty: p.warranty,
        createdAt: p.dt_create,
      }));

      return sendSuccess(res, 'Lấy danh sách sản phẩm thành công', {
        items: mapped,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi lấy danh sách sản phẩm admin', 500);
    }
  }

  /**
   * POST /api/v1/admin/products
   */
  static async createProduct(req: AuthRequest, res: Response): Promise<any> {
    try {
      const data = req.body;
      const s_ID = generateId('prd');

      // Tạo slug nếu không có
      const slug = data.slug || data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') + '-' + Date.now();

      // Tìm tên danh mục
      let categoryName = '';
      if (data.categoryId) {
        const cat = await CategoryModel.findOne({ s_ID: data.categoryId });
        if (cat) categoryName = cat.s_Name;
      }

      const newProduct = new ProductModel({
        s_ID,
        s_Product_ID: s_ID,
        s_Name: data.name,
        slug,
        sku: `SKU-${Date.now()}`,
        category_id: data.categoryId,
        category_name: categoryName,
        price: data.price,
        original_price: data.originalPrice,
        discount_percent: data.discountPercent,
        stock_quantity: data.stockQuantity || 0,
        in_stock: (data.stockQuantity || 0) > 0,
        is_new: !!data.isNew,
        is_featured: !!data.isFeatured,
        description: data.description || '',
        material: data.material || '',
        dimensions: data.dimensions || '',
        video_url: data.videoUrl || data.video_url || '',
        origin: data.origin || '',
        warranty: data.warranty || '',
        color_options: data.colorOptions || [],
        specifications: data.specifications || {},
        is_active: true,
      });

      await newProduct.save();

      if (Array.isArray(data.images) && data.images.length > 0) {
        const imageDocs = data.images.map((url: string, index: number) => ({
          s_ID: generateId('img'),
          s_product_ID: s_ID,
          image_url: url,
          sort_order: index,
          is_primary: index === 0,
        }));
        await ProductImageModel.insertMany(imageDocs);
      }

      return sendSuccess(res, 'Tạo sản phẩm thành công', newProduct, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo sản phẩm', 500);
    }
  }

  /**
   * PUT /api/v1/admin/products/:id
   */
  static async updateProduct(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const data = req.body;

      const product = await ProductModel.findOne({ s_ID: id });
      if (!product) {
        return sendError(res, 'Không tìm thấy sản phẩm để cập nhật', 404);
      }

      if (data.name) product.s_Name = data.name;
      if (data.categoryId) {
        product.category_id = data.categoryId;
        const cat = await CategoryModel.findOne({ s_ID: data.categoryId });
        if (cat) product.category_name = cat.s_Name;
      }
      if (data.price !== undefined) product.price = data.price;
      if (data.originalPrice !== undefined) product.original_price = data.originalPrice;
      if (data.discountPercent !== undefined) product.discount_percent = data.discountPercent;
      if (data.stockQuantity !== undefined) {
        product.stock_quantity = data.stockQuantity;
        product.in_stock = data.stockQuantity > 0;
      }
      if (data.inStock !== undefined) product.in_stock = data.inStock;
      if (data.isNew !== undefined) product.is_new = data.isNew;
      if (data.isFeatured !== undefined) product.is_featured = data.isFeatured;
      if (data.description !== undefined) product.description = data.description;
      if (data.material !== undefined) product.material = data.material;
      if (data.dimensions !== undefined) product.dimensions = data.dimensions;
      if (data.videoUrl !== undefined || data.video_url !== undefined) {
        (product as any).video_url = data.videoUrl || data.video_url || '';
      }
      if (data.origin !== undefined) product.origin = data.origin;
      if (data.warranty !== undefined) product.warranty = data.warranty;

      await product.save();

      if (Array.isArray(data.images) && data.images.length > 0) {
        await ProductImageModel.deleteMany({ s_product_ID: product.s_ID });
        const imageDocs = data.images.map((url: string, index: number) => ({
          s_ID: generateId('img'),
          s_product_ID: product.s_ID,
          image_url: url,
          sort_order: index,
          is_primary: index === 0,
        }));
        await ProductImageModel.insertMany(imageDocs);
      }

      return sendSuccess(res, 'Cập nhật sản phẩm thành công', product);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi cập nhật sản phẩm', 500);
    }
  }

  /**
   * DELETE /api/v1/admin/products/:id
   */
  static async deleteProduct(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const product = await ProductModel.findOneAndDelete({ s_ID: id });
      if (!product) {
        return sendError(res, 'Không tìm thấy sản phẩm cần xóa', 404);
      }
      return sendSuccess(res, 'Xóa sản phẩm thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi xóa sản phẩm', 500);
    }
  }

  /**
   * GET /api/v1/admin/orders
   */
  static async getOrders(req: AuthRequest, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const urgentOnly = req.query.urgent === 'true' || req.query.urgentOnly === 'true';
      const search = (req.query.search as string || '').trim();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const query: any = {};
      if (status) query.status = status;

      if (search) {
        query.$or = [
          { s_order_id: { $regex: search, $options: 'i' } },
          { recipient_name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      // Filter theo ngày đặt
      if (startDate || endDate) {
        query.dt_created = {};
        if (startDate) query.dt_created.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.dt_created.$lte = end;
        }
      }

      // Đơn cần xử lý gấp (> 3 ngày đặt hàng mà chưa chuyển trạng thái giao)
      if (urgentOnly) {
        query.dt_created = { ...(query.dt_created || {}), $lte: threeDaysAgo };
        query.status = { $in: ['pending', 'processing'] };
      }

      // Đếm số đơn cần xử lý gấp (quá 3 ngày chưa giao: status là pending hoặc processing)
      const urgentCount = await OrderModel.countDocuments({
        dt_created: { $lte: threeDaysAgo },
        status: { $in: ['pending', 'processing'] },
      });

      const total = await OrderModel.countDocuments(query);
      const orders = await OrderModel.find(query)
        .sort({ dt_created: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return sendSuccess(res, 'Lấy danh sách đơn hàng thành công', {
        items: orders,
        urgentCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi lấy danh sách đơn hàng', 500);
    }
  }

  /**
   * POST /api/v1/admin/orders
   * Admin tạo mới đơn hàng cho khách hàng
   */
  static async createOrder(req: AuthRequest, res: Response): Promise<any> {
    try {
      const {
        customerInfo,
        items,
        paymentMethod = 'bank_transfer',
        paymentStatus = 'unpaid',
        status = 'pending',
        voucherCode = '',
        note = '',
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return sendError(res, 'Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng', 400);
      }

      if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
        return sendError(res, 'Vui lòng điền đủ Tên, Số điện thoại và Địa chỉ người nhận', 400);
      }

      let subtotal = 0;
      const orderItemsDetail: any[] = [];

      for (const item of items) {
        const prodId = item.productId || item.product?.id || item.product?.s_ID;
        const product = await ProductModel.findOne({ s_ID: prodId });
        if (!product) {
          return sendError(res, `Sản phẩm ${prodId} không tồn tại`, 400);
        }

        const qty = Number(item.quantity) || 1;
        const unitPrice = item.unitPrice !== undefined ? Number(item.unitPrice) : product.price;
        const lineTotal = unitPrice * qty;
        subtotal += lineTotal;

        const img = await ProductImageModel.findOne({ s_product_ID: product.s_ID, is_primary: true });

        orderItemsDetail.push({
          productId: product.s_ID,
          productName: product.s_Name,
          selectedColor: item.selectedColor || '',
          imageUrl: img ? img.image_url : '',
          unitPrice,
          quantity: qty,
          lineTotal,
        });
      }

      const shippingFee = 0;
      const totalAmount = subtotal;

      const s_ID = generateId('ord');
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      const newOrder = new OrderModel({
        s_ID,
        s_order_id: orderNumber,
        s_user_id: 'guest',
        status,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        payment_transaction_id: paymentStatus === 'paid' ? `ADMIN_MANUAL_${Date.now()}` : '',
        payment_paid_at: paymentStatus === 'paid' ? new Date() : null,
        subtotal,
        discount_amount: 0,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        voucher_code: voucherCode || '',
        note: note || customerInfo.note || '',
        recipient_name: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email || '',
        address_line: customerInfo.address,
        city: customerInfo.city || 'TP. Hà Nội',
        district: customerInfo.district || '',
        ward: customerInfo.ward || '',
      });

      await newOrder.save();

      // Lưu chi tiết đơn hàng
      for (const item of orderItemsDetail) {
        const detail = new OrderDetailModel({
          s_ID: generateId('ord_dt'),
          s_order_id: newOrder.s_ID,
          s_product_id: item.productId,
          product_name: item.productName,
          selected_color: item.selectedColor,
          image_url: item.imageUrl,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          line_total: item.lineTotal,
        });
        await detail.save();
      }

      return sendSuccess(res, 'Tạo đơn hàng mới thành công', newOrder, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo đơn hàng', 500);
    }
  }

  /**
   * GET /api/v1/admin/orders/:id
   * Xem chi tiết thông tin đơn hàng và danh sách sản phẩm
   */
  static async getOrderDetail(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const order = await OrderModel.findOne({
        $or: [{ s_order_id: id }, { s_ID: id }],
      }).lean();

      if (!order) {
        return sendError(res, 'Không tìm thấy đơn hàng', 404);
      }

      const details = await OrderDetailModel.find({ s_order_id: order.s_ID }).lean();

      const formatted = {
        id: order.s_order_id,
        s_ID: order.s_ID,
        createdAt: order.dt_created ? new Date(order.dt_created).toISOString() : '',
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        paymentTransactionId: order.payment_transaction_id,
        paymentPaidAt: order.payment_paid_at ? new Date(order.payment_paid_at).toISOString() : null,
        subtotal: order.subtotal,
        discountAmount: order.discount_amount || 0,
        shippingFee: order.shipping_fee || 0,
        totalAmount: order.total_amount,
        voucherCode: order.voucher_code || '',
        recipient_name: order.recipient_name,
        phone: order.phone,
        email: order.email || '',
        address_line: order.address_line,
        city: order.city || '',
        district: order.district || '',
        ward: order.ward || '',
        note: order.note || '',
        items: details.map((d) => ({
          id: d.s_ID,
          productId: d.s_product_id,
          productName: d.product_name,
          selectedColor: d.selected_color || '',
          imageUrl: d.image_url || '',
          unitPrice: d.unit_price,
          quantity: d.quantity,
          lineTotal: d.line_total,
        })),
      };

      return sendSuccess(res, 'Lấy chi tiết đơn hàng thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy chi tiết đơn hàng', 500);
    }
  }

  /**
   * PATCH /api/v1/admin/orders/:id/status
   */
  static async updateOrderStatus(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { status, paymentStatus } = req.body;

      const order = await OrderModel.findOne({ $or: [{ s_ID: id }, { s_order_id: id }] });
      if (!order) {
        return sendError(res, 'Không tìm thấy đơn hàng', 404);
      }

      // Khóa không cho thay đổi nếu đơn đã bị hủy
      if (order.status === 'cancelled') {
        return sendError(res, 'Đơn hàng này đã bị hủy, không thể thay đổi trạng thái nữa', 400);
      }

      if (status) {
        order.status = status;
        if (status === 'completed' && order.payment_status === 'unpaid') {
          order.payment_status = 'paid';
          order.payment_paid_at = new Date();
        }
      }

      if (paymentStatus) {
        order.payment_status = paymentStatus;
        if (paymentStatus === 'paid' && !order.payment_paid_at) {
          order.payment_paid_at = new Date();
        }
      }

      await order.save();

      return sendSuccess(res, 'Cập nhật trạng thái đơn hàng thành công', order);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi cập nhật đơn hàng', 500);
    }
  }

  /**
   * PUT /api/v1/admin/orders/:id
   * Cho phép Admin sửa toàn bộ thông tin đơn hàng:
   * Khách hàng (tên, sđt, email, địa chỉ), Trạng thái đơn, Thanh toán, Voucher, Phí ship, Hàng hóa, Ghi chú
   */
  static async updateOrder(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const {
        recipient_name,
        phone,
        email,
        address_line,
        district,
        city,
        note,
        status,
        paymentMethod,
        paymentStatus,
        paymentTransactionId,
        voucherCode,
        discountAmount,
        shippingFee,
        items,
      } = req.body;

      const order = await OrderModel.findOne({ $or: [{ s_ID: id }, { s_order_id: id }] });
      if (!order) {
        return sendError(res, 'Không tìm thấy đơn hàng', 404);
      }

      // 1. Cập nhật thông tin khách hàng & địa chỉ giao nhận
      if (recipient_name !== undefined) order.recipient_name = String(recipient_name).trim();
      if (phone !== undefined) order.phone = String(phone).trim();
      if (email !== undefined) order.email = String(email).trim();
      if (address_line !== undefined) order.address_line = String(address_line).trim();
      if (district !== undefined) order.district = String(district).trim();
      if (city !== undefined) order.city = String(city).trim();
      if (note !== undefined) order.note = String(note).trim();

      // 2. Cập nhật trạng thái đơn hàng & phương thức thanh toán
      if (status !== undefined) order.status = status;
      if (paymentMethod !== undefined) order.payment_method = paymentMethod;
      if (paymentStatus !== undefined) {
        order.payment_status = paymentStatus;
        if (paymentStatus === 'paid' && !order.payment_paid_at) {
          order.payment_paid_at = new Date();
        }
      }
      if (paymentTransactionId !== undefined) order.payment_transaction_id = String(paymentTransactionId).trim();
      if (voucherCode !== undefined) order.voucher_code = String(voucherCode).trim();
      if (discountAmount !== undefined) order.discount_amount = Math.max(0, parseInt(discountAmount) || 0);

      // 3. Cập nhật danh sách sản phẩm
      let subtotal = order.subtotal;
      if (Array.isArray(items) && items.length > 0) {
        await OrderDetailModel.deleteMany({ s_order_id: order.s_ID });

        subtotal = 0;
        const detailsToInsert = items.map((it: any) => {
          const qty = Math.max(1, parseInt(it.quantity) || 1);
          const price = Math.max(0, parseInt(it.unitPrice) || 0);
          const lineTotal = qty * price;
          subtotal += lineTotal;

          return {
            s_ID: generateId('ord_dt'),
            s_order_id: order.s_ID,
            s_product_id: it.productId || it.s_product_id || it.id || generateId('prod'),
            product_name: it.productName || it.name || 'Sản phẩm',
            selected_color: it.selectedColor || it.selected_color || '',
            image_url: it.imageUrl || it.image_url || '',
            unit_price: price,
            quantity: qty,
            line_total: lineTotal,
          };
        });

        await OrderDetailModel.insertMany(detailsToInsert);
        order.subtotal = subtotal;
      }

      // 4. Cập nhật phí vận chuyển & tổng tiền thanh toán
      if (shippingFee !== undefined) {
        order.shipping_fee = Math.max(0, parseInt(shippingFee) || 0);
      }

      const totalAmount = Math.max(0, order.subtotal - (order.discount_amount || 0) + (order.shipping_fee || 0));
      order.total_amount = totalAmount;

      await order.save();

      // Lấy chi tiết mới nhất để phản hồi cho UI
      const details = await OrderDetailModel.find({ s_order_id: order.s_ID }).lean();
      const formatted = {
        id: order.s_order_id,
        s_ID: order.s_ID,
        createdAt: order.dt_created ? new Date(order.dt_created).toISOString() : '',
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        paymentTransactionId: order.payment_transaction_id,
        paymentPaidAt: order.payment_paid_at ? new Date(order.payment_paid_at).toISOString() : null,
        subtotal: order.subtotal,
        discountAmount: order.discount_amount || 0,
        shippingFee: order.shipping_fee || 0,
        totalAmount: order.total_amount,
        voucherCode: order.voucher_code || undefined,
        recipient_name: order.recipient_name,
        phone: order.phone,
        email: order.email,
        address_line: order.address_line,
        district: order.district,
        city: order.city,
        note: order.note,
        items: details.map((d: any) => ({
          id: d.s_ID,
          productId: d.s_product_id,
          productName: d.product_name,
          selectedColor: d.selected_color,
          unitPrice: d.unit_price,
          quantity: d.quantity,
          lineTotal: d.line_total,
          imageUrl: d.image_url,
        })),
      };

      return sendSuccess(res, 'Cập nhật đơn hàng thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi cập nhật đơn hàng', 500);
    }
  }

  /**
   * GET /api/v1/admin/users
   */
  static async getUsers(req: AuthRequest, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = (req.query.search as string || '').trim();

      const query: any = {};
      if (search) {
        query.$or = [
          { s_user: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await UserModel.countDocuments(query);
      const users = await UserModel.find(query)
        .sort({ dt_create: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      // Thống kê số lượng đơn hàng và tổng tiền đã mua của từng người dùng
      const userIds = users.map((u: any) => u.s_ID);
      const orderCounts = await OrderModel.aggregate([
        { $match: { s_user_id: { $in: userIds } } },
        { $group: { _id: '$s_user_id', count: { $sum: 1 }, totalSpent: { $sum: '$total_amount' } } },
      ]);
      const countMap = new Map<string, { count: number; totalSpent: number }>();
      orderCounts.forEach((oc: any) => {
        countMap.set(oc._id, { count: oc.count, totalSpent: oc.totalSpent });
      });

      const items = users.map((u: any) => {
        const userObj = u.toObject();
        const stats = countMap.get(u.s_ID);
        return {
          ...userObj,
          orderCount: stats ? stats.count : 0,
          totalSpent: stats ? stats.totalSpent : 0,
        };
      });

      return sendSuccess(res, 'Lấy danh sách người dùng thành công', {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi lấy danh sách người dùng', 500);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id/status
   */
  static async toggleUserStatus(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await UserModel.findOne({ s_ID: id });
      if (!user) {
        return sendError(res, 'Không tìm thấy tài khoản người dùng', 404);
      }

      user.status = status;
      await user.save();

      return sendSuccess(res, `Đã ${status ? 'mở khóa' : 'khóa'} tài khoản người dùng`, user);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi cập nhật trạng thái người dùng', 500);
    }
  }

  static async updateUser(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { role, phone, s_user } = req.body;
      const user = await UserModel.findOne({ s_ID: id });
      if (!user) return sendError(res, 'Không tìm thấy người dùng', 404);

      if (role) user.role = role;
      if (phone !== undefined) user.phone = phone;
      if (s_user) user.s_user = s_user;
      await user.save();
      return sendSuccess(res, 'Cập nhật thông tin người dùng thành công', user);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async resetUserPassword(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return sendError(res, 'Mật khẩu mới phải từ 6 ký tự trở lên', 400);
      }
      const user = await UserModel.findOne({ s_ID: id });
      if (!user) return sendError(res, 'Không tìm thấy người dùng', 404);

      const salt = await bcrypt.genSalt(10);
      user.s_PWD = await bcrypt.hash(newPassword, salt);
      await user.save();
      return sendSuccess(res, 'Đã đặt lại mật khẩu cho người dùng');
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async getUserOrders(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const orders = await OrderModel.find({ s_user_id: id }).sort({ dt_created: -1 });
      return sendSuccess(res, 'Lấy danh sách đơn hàng của người dùng thành công', orders);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * CATEGORIES CRUD
   */
  static async getCategories(req: AuthRequest, res: Response): Promise<any> {
    try {
      const categories = await CategoryModel.find().sort({ dt_create: -1 });
      return sendSuccess(res, 'Lấy danh mục thành công', categories);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async createCategory(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { name, description, image_url } = req.body;
      const s_ID = generateId('cat');
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const cat = new CategoryModel({
        s_ID,
        s_Name: name,
        slug,
        description: description || '',
        image_url: image_url || '',
        is_active: true,
      });
      await cat.save();
      return sendSuccess(res, 'Tạo danh mục thành công', cat, 201);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async updateCategory(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, description, image_url } = req.body;
      const cat = await CategoryModel.findOne({ s_ID: id });
      if (!cat) return sendError(res, 'Không tìm thấy danh mục', 404);
      if (name) {
        cat.s_Name = name;
        await ProductModel.updateMany({ category_id: id }, { category_name: name });
      }
      if (description !== undefined) cat.description = description;
      if (image_url !== undefined) cat.image_url = image_url;
      await cat.save();
      return sendSuccess(res, 'Cập nhật danh mục thành công', cat);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async addProductsToCategory(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { productIds } = req.body;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return sendError(res, 'Vui lòng cung cấp danh sách sản phẩm cần thêm', 400);
      }
      const cat = await CategoryModel.findOne({ s_ID: id });
      if (!cat) return sendError(res, 'Không tìm thấy danh mục', 404);

      await ProductModel.updateMany(
        { $or: [{ s_ID: { $in: productIds } }, { id: { $in: productIds } }] },
        { category_id: cat.s_ID, category_name: cat.s_Name }
      );
      return sendSuccess(res, `Đã thêm ${productIds.length} sản phẩm vào danh mục ${cat.s_Name}`);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async removeProductsFromCategory(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { productIds } = req.body;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return sendError(res, 'Vui lòng cung cấp danh sách sản phẩm cần xóa khỏi danh mục', 400);
      }
      await ProductModel.updateMany(
        {
          category_id: id,
          $or: [{ s_ID: { $in: productIds } }, { id: { $in: productIds } }],
        },
        { category_id: '', category_name: '' }
      );
      return sendSuccess(res, `Đã xóa ${productIds.length} sản phẩm khỏi danh mục`);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async deleteCategory(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await CategoryModel.findOneAndDelete({ s_ID: id });
      return sendSuccess(res, 'Xóa danh mục thành công');
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * BANNERS CRUD
   */
  static async getBanners(req: AuthRequest, res: Response): Promise<any> {
    try {
      const banners = await BannerModel.find().sort({ sort_order: 1 });
      return sendSuccess(res, 'Lấy danh sách banner thành công', banners);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async createBanner(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { title, subtitle, image_url, link_url, badge_text, highlights, type, is_active } = req.body;
      const s_ID = generateId('bnr');
      const banner = new BannerModel({
        s_ID,
        title: title || 'Banner',
        subtitle: subtitle || '',
        image_url,
        link_url: link_url || '',
        badge_text: badge_text || '',
        highlights: Array.isArray(highlights) ? highlights : (typeof highlights === 'string' ? highlights.split('\n').map((h: string) => h.trim()).filter(Boolean) : []),
        type: type || 'hero',
        is_active: is_active !== undefined ? is_active : true,
      });
      await banner.save();
      return sendSuccess(res, 'Tạo banner thành công', banner, 201);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async updateBanner(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const data = req.body;
      const banner = await BannerModel.findOne({ s_ID: id });
      if (!banner) return sendError(res, 'Không tìm thấy banner', 404);

      if (data.title) banner.title = data.title;
      if (data.subtitle !== undefined) banner.subtitle = data.subtitle;
      if (data.image_url) banner.image_url = data.image_url;
      if (data.link_url !== undefined) banner.link_url = data.link_url;
      if (data.badge_text !== undefined) banner.badge_text = data.badge_text;
      if (data.highlights !== undefined) {
        banner.highlights = Array.isArray(data.highlights) ? data.highlights : (typeof data.highlights === 'string' ? data.highlights.split('\n').map((h: string) => h.trim()).filter(Boolean) : []);
      }
      if (data.type) banner.type = data.type;
      if (data.is_active !== undefined) banner.is_active = data.is_active;

      await banner.save();
      return sendSuccess(res, 'Cập nhật banner thành công', banner);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async deleteBanner(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await BannerModel.findOneAndDelete({ s_ID: id });
      return sendSuccess(res, 'Xóa banner thành công');
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * VOUCHERS CRUD
   */
  static async getVouchers(req: AuthRequest, res: Response): Promise<any> {
    try {
      const vouchers = await VoucherModel.find().sort({ dt_create: -1 });
      return sendSuccess(res, 'Lấy danh sách voucher thành công', vouchers);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async createVoucher(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { code, name, discount_type, discount_value, min_order_value, max_discount, usage_limit } = req.body;
      const s_ID = generateId('vch');
      const voucher = new VoucherModel({
        s_ID,
        code: code.toUpperCase().trim(),
        name,
        discount_type,
        discount_value,
        min_order_value: min_order_value || 0,
        max_discount: max_discount || 0,
        usage_limit: usage_limit || 100,
        is_active: true,
      });
      await voucher.save();
      return sendSuccess(res, 'Tạo voucher thành công', voucher, 201);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async updateVoucher(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { code, name, discount_type, discount_value, min_order_value, max_discount, usage_limit, is_active } = req.body;
      const updateData: any = {};
      if (code !== undefined) updateData.code = code.toUpperCase().trim();
      if (name !== undefined) updateData.name = name;
      if (discount_type !== undefined) updateData.discount_type = discount_type;
      if (discount_value !== undefined) updateData.discount_value = discount_value;
      if (min_order_value !== undefined) updateData.min_order_value = min_order_value;
      if (max_discount !== undefined) updateData.max_discount = max_discount;
      if (usage_limit !== undefined) updateData.usage_limit = usage_limit;
      if (is_active !== undefined) updateData.is_active = is_active;

      const voucher = await VoucherModel.findOneAndUpdate(
        { $or: [{ s_ID: id }, { code: id }] },
        updateData,
        { new: true }
      );
      if (!voucher) return sendError(res, 'Không tìm thấy voucher', 404);
      return sendSuccess(res, 'Cập nhật voucher thành công', voucher);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async deleteVoucher(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await VoucherModel.findOneAndDelete({ s_ID: id });
      return sendSuccess(res, 'Xóa voucher thành công');
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * REVIEWS MANAGEMENT
   */
  static async getReviews(req: AuthRequest, res: Response): Promise<any> {
    try {
      const reviews = await ReviewModel.find().sort({ dt_create: -1 }).lean();
      const productIds = reviews.map((r) => r.product_id).filter(Boolean);
      const products = await ProductModel.find({ s_ID: { $in: productIds } }).lean();
      const productImages = await ProductImageModel.find({ s_product_ID: { $in: productIds }, is_primary: true }).lean();

      const prodMap = new Map<string, any>();
      products.forEach((p) => prodMap.set(p.s_ID, p));
      const imgMap = new Map<string, string>();
      productImages.forEach((img) => imgMap.set(img.s_product_ID, img.image_url));

      const populated = reviews.map((r) => {
        const p = prodMap.get(r.product_id);
        return {
          ...r,
          product_name: p ? p.s_Name : (r.product_id || ''),
          product_slug: p?.slug || r.product_id,
          product_image: imgMap.get(r.product_id) || '',
        };
      });

      return sendSuccess(res, 'Lấy danh sách đánh giá thành công', populated);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async replyReview(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { reply } = req.body;
      const review = await ReviewModel.findOneAndUpdate({ s_ID: id }, { admin_reply: reply }, { new: true });
      return sendSuccess(res, 'Đã phản hồi đánh giá', review);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async toggleReviewStatus(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const review = await ReviewModel.findOne({ s_ID: id });
      if (!review) return sendError(res, 'Không tìm thấy đánh giá', 404);
      review.is_approved = !review.is_approved;
      await review.save();

      // Cập nhật lại avg_rating của sản phẩm
      const allReviews = await ReviewModel.find({ product_id: review.product_id, is_approved: true });
      if (allReviews.length > 0) {
        const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
        await ProductModel.findOneAndUpdate(
          { s_ID: review.product_id },
          { avg_rating: Number((totalScore / allReviews.length).toFixed(1)), review_count: allReviews.length }
        );
      } else {
        await ProductModel.findOneAndUpdate(
          { s_ID: review.product_id },
          { avg_rating: 5, review_count: 0 }
        );
      }

      return sendSuccess(res, `Đã ${review.is_approved ? 'hiển thị' : 'ẩn'} đánh giá thành công`, review);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async deleteReview(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await ReviewModel.findOneAndDelete({ s_ID: id });
      return sendSuccess(res, 'Xóa đánh giá thành công');
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * SEED MOCK ORDERS
   * Tự động tạo các đơn hàng ảo hoàn thành để làm đẹp biểu đồ 14 ngày
   */
  static async seedMockOrders(_req: AuthRequest, res: Response): Promise<any> {
    try {
      const activeProducts = await ProductModel.find({ is_active: true }).limit(20);
      if (activeProducts.length === 0) {
        return sendError(res, 'Không có sản phẩm nào để tạo đơn mẫu', 400);
      }

      const sampleCustomers = [
        { name: 'Nguyễn Văn An', phone: '0912345678', address: 'Số 18 Hoàng Đạo Thúy, Cầu Giấy', city: 'Hà Nội' },
        { name: 'Trần Thị Thu Trang', phone: '0988776655', address: 'Căn hộ 12B Landmark 81, Bình Thạnh', city: 'TP. Hồ Chí Minh' },
        { name: 'Lê Hoàng Long', phone: '0903123456', address: 'Số 45 Lê Duẩn, Hải Châu', city: 'Đà Nẵng' },
        { name: 'Phạm Minh Đức', phone: '0977889900', address: 'Biệt thự B2 Ciputra, Tây Hồ', city: 'Hà Nội' },
        { name: 'Vũ Thảo Vy', phone: '0944556677', address: 'Số 28 Thảo Điền, Quận 2', city: 'TP. Hồ Chí Minh' },
        { name: 'Đỗ Hữu Nghĩa', phone: '0911223344', address: 'Số 102 Trần Phú, Hà Đông', city: 'Hà Nội' },
        { name: 'Hoàng Kim Yến', phone: '0966554433', address: 'Số 89 Nguyễn Thị Minh Khai, Quận 1', city: 'TP. Hồ Chí Minh' },
        { name: 'Bùi Tuấn Anh', phone: '0933221100', address: 'Khu Đô Thị Ecopark, Văn Giang', city: 'Hưng Yên' },
      ];

      const createdOrders = [];
      const now = Date.now();

      for (let i = 0; i < 14; i++) {
        const daysAgo = i;
        const orderDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 3600000 * 6));
        const customer = sampleCustomers[i % sampleCustomers.length];
        
        const numItems = Math.random() > 0.5 ? 2 : 1;
        const selectedProds: any[] = [];
        for (let j = 0; j < numItems; j++) {
          const p = activeProducts[(i * 2 + j) % activeProducts.length];
          selectedProds.push(p);
        }

        let subtotal = 0;
        const orderDetailsToSave: any[] = [];
        const s_ID = generateId('ord');
        const orderNumber = `ORD-${Date.now().toString().slice(-4)}${i.toString().padStart(2, '0')}`;

        for (const prod of selectedProds) {
          const qty = Math.random() > 0.7 ? 2 : 1;
          const unitPrice = prod.price || 5000000;
          const lineTotal = unitPrice * qty;
          subtotal += lineTotal;

          const img = await ProductImageModel.findOne({ s_product_ID: prod.s_ID, is_primary: true });

          orderDetailsToSave.push({
            s_ID: generateId('ord_dt'),
            s_order_id: s_ID,
            s_product_id: prod.s_ID,
            product_name: prod.s_Name,
            selected_color: 'Tiêu chuẩn',
            image_url: img ? img.image_url : '',
            unit_price: unitPrice,
            quantity: qty,
            line_total: lineTotal,
          });
        }

        const newOrder = new OrderModel({
          s_ID,
          s_order_id: orderNumber,
          s_user_id: 'guest',
          status: 'completed',
          payment_method: 'bank_transfer',
          payment_status: 'paid',
          payment_transaction_id: `SEPAY_AUTO_${Date.now()}_${i}`,
          payment_paid_at: orderDate,
          subtotal,
          discount_amount: 0,
          shippingFee: 0,
          total_amount: subtotal,
          voucher_code: '',
          note: 'Khách yêu cầu lắp đặt tận nơi',
          recipient_name: customer.name,
          phone: customer.phone,
          email: `${customer.phone}@gmail.com`,
          address_line: customer.address,
          city: customer.city,
          dt_created: orderDate,
          dt_edit: orderDate,
        });

        await newOrder.save();

        for (const dt of orderDetailsToSave) {
          const itemDetail = new OrderDetailModel(dt);
          await itemDetail.save();
        }

        createdOrders.push(orderNumber);
      }

      return sendSuccess(res, `Đã tạo thành công ${createdOrders.length} đơn hàng mẫu hoàn thành`, {
        count: createdOrders.length,
        orders: createdOrders,
      });
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * CONTACT & ZALO SETTINGS (100% DB driven - No mock/fallback)
   */
  static async getContactSettings(_req: any, res: Response): Promise<any> {
    try {
      const s = await SettingModel.findOne({ key: 'contact_settings' }).lean();
      return sendSuccess(res, 'Lấy cấu hình liên hệ thành công', s?.value || null);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async updateContactSettings(req: AuthRequest, res: Response): Promise<any> {
    try {
      const data = req.body;
      const updated = await SettingModel.findOneAndUpdate(
        { key: 'contact_settings' },
        {
          key: 'contact_settings',
          value: {
            hotline: (data.hotline || '').trim(),
            hotline2: (data.hotline2 || '').trim(),
            address1: (data.address1 || '').trim(),
            address2: (data.address2 || '').trim(),
            fanpage_url: (data.fanpage_url || '').trim(),
            contacts: Array.isArray(data.contacts) ? data.contacts : [],
          },
        },
        { upsert: true, new: true }
      );
      return sendSuccess(res, 'Cập nhật cấu hình liên hệ thành công', updated.value);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  /**
   * INVOICE TEMPLATE SETTINGS (100% DB driven - No mock/fallback)
   */
  static async getInvoiceSettings(_req: any, res: Response): Promise<any> {
    try {
      const s = await SettingModel.findOne({ key: 'invoice_settings' }).lean();
      return sendSuccess(res, 'Lấy cấu hình mẫu hóa đơn thành công', s?.value || null);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }

  static async updateInvoiceSettings(req: AuthRequest, res: Response): Promise<any> {
    try {
      const data = req.body;
      const updated = await SettingModel.findOneAndUpdate(
        { key: 'invoice_settings' },
        {
          key: 'invoice_settings',
          value: {
            companyName: (data.companyName || '').trim(),
            address: (data.address || '').trim(),
            hotline: (data.hotline || '').trim(),
            taxCode: (data.taxCode || '').trim(),
            email: (data.email || '').trim(),
            website: (data.website || '').trim(),
          },
        },
        { upsert: true, new: true }
      );
      return sendSuccess(res, 'Lưu thông tin mẫu hóa đơn thành công', updated.value);
    } catch (e: any) {
      return sendError(res, e.message, 500);
    }
  }
}
