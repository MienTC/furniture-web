import { Response } from 'express';
import { OrderModel } from '../models/Order.model.js';
import { OrderDetailModel } from '../models/OrderDetail.model.js';
import { ProductModel } from '../models/Product.model.js';
import { ProductImageModel } from '../models/ProductImage.model.js';
import { VoucherModel } from '../models/Voucher.model.js';
import { VoucherUsageModel } from '../models/VoucherUsage.model.js';
import { CartModel } from '../models/Cart.model.js';
import { CartItemModel } from '../models/CartItem.model.js';
import { generateId } from '../utils/generateId.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/index.js';

export class OrderController {
  /**
   * POST /api/v1/orders
   * Create new order (Checkout)
   */
  static async createOrder(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID || 'guest';
      const { items, customerInfo, voucherCode } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return sendError(res, 'Giỏ hàng đang trống, không thể tạo đơn', 400);
      }

      if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
        return sendError(res, 'Vui lòng cung cấp đầy đủ thông tin người nhận', 400);
      }

      // 1. Validate items & calculate subtotal
      let subtotal = 0;
      const orderItemsDetail: any[] = [];

      for (const item of items) {
        const prodId = item.product?.id || item.product?.s_ID || item.productId || item.product_id;
        const product = await ProductModel.findOne({
          $or: [{ s_ID: prodId }, { slug: prodId }],
          is_active: true,
        });

        if (!product) {
          return sendError(res, `Sản phẩm ${prodId} không tồn tại hoặc đã ngừng bán`, 400);
        }

        const qty = Number(item.quantity) || 1;
        if (product.stock_quantity < qty) {
          return sendError(res, `Sản phẩm "${product.s_Name}" chỉ còn ${product.stock_quantity} cái trong kho`, 400);
        }

        const lineTotal = product.price * qty;
        subtotal += lineTotal;

        // Fetch primary image
        const img = await ProductImageModel.findOne({ s_product_ID: product.s_ID, is_primary: true });

        orderItemsDetail.push({
          product,
          productId: product.s_ID,
          productName: product.s_Name,
          selectedColor: item.selectedColor || item.selected_color || '',
          imageUrl: img ? img.image_url : '',
          unitPrice: product.price,
          quantity: qty,
          lineTotal,
        });
      }

      // 2. Validate voucher if applied
      let discountAmount = 0;
      let appliedVoucher = null;

      if (voucherCode) {
        appliedVoucher = await VoucherModel.findOne({
          code: voucherCode.trim().toUpperCase(),
          is_active: true,
        });

        if (appliedVoucher) {
          if (subtotal >= appliedVoucher.min_order_value) {
            if (appliedVoucher.discount_type === 'fixed') {
              discountAmount = appliedVoucher.discount_value;
            } else {
              discountAmount = Math.round((subtotal * appliedVoucher.discount_value) / 100);
              if (appliedVoucher.max_discount && discountAmount > appliedVoucher.max_discount) {
                discountAmount = appliedVoucher.max_discount;
              }
            }
          }
        }
      }

      // 3. Shipping fee policy
      const shippingFee = subtotal >= 5000000 ? 0 : 300000;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

      // 4. Create Order document
      const s_ID = generateId('ord');
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      const newOrder = new OrderModel({
        s_ID,
        s_order_id: orderNumber,
        s_user_id: userId,
        status: 'pending',
        payment_method: customerInfo.paymentMethod || 'cod',
        payment_status: 'unpaid',
        subtotal,
        discount_amount: discountAmount,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        voucher_code: voucherCode || '',
        note: customerInfo.note || '',
        recipient_name: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email || '',
        address_line: customerInfo.address,
        city: customerInfo.city || '',
        district: customerInfo.district || '',
        ward: customerInfo.ward || '',
      });

      await newOrder.save();

      // 5. Create OrderDetail & deduct stock
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

        // Deduct inventory
        await ProductModel.findOneAndUpdate(
          { s_ID: item.productId },
          {
            $inc: { stock_quantity: -item.quantity },
          }
        );
      }

      // 6. Record Voucher Usage
      if (appliedVoucher) {
        appliedVoucher.usage_count += 1;
        await appliedVoucher.save();

        const usage = new VoucherUsageModel({
          s_ID: generateId('v_use'),
          voucher_id: appliedVoucher.s_ID,
          user_id: userId,
          order_id: newOrder.s_ID,
          discount_applied: discountAmount,
        });
        await usage.save();
      }

      // 7. Clear user cart if logged in
      if (userId !== 'guest') {
        const cart = await CartModel.findOne({ user_id: userId });
        if (cart) {
          await CartItemModel.deleteMany({ s_cart_id: cart.s_ID });
        }
      }

      return sendSuccess(
        res,
        'Đặt hàng thành công!',
        {
          id: newOrder.s_order_id,
          s_ID: newOrder.s_ID,
          totalAmount: newOrder.total_amount,
          status: newOrder.status,
        },
        201
      );
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi tạo đơn hàng', 500);
    }
  }

  /**
   * GET /api/v1/orders
   * Get orders of current user
   */
  static async getMyOrders(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.s_ID!;
      const orders = await OrderModel.find({ s_user_id: userId }).sort({ dt_created: -1 }).lean();

      const populatedOrders = await Promise.all(
        orders.map(async (ord) => {
          const details = await OrderDetailModel.find({ s_order_id: ord.s_ID }).lean();
          return {
            id: ord.s_order_id,
            s_ID: ord.s_ID,
            createdAt: ord.dt_created ? new Date(ord.dt_created).toISOString() : '',
            status: ord.status,
            subtotal: ord.subtotal,
            discountAmount: ord.discount_amount,
            shippingFee: ord.shipping_fee,
            totalAmount: ord.total_amount,
            voucherCode: ord.voucher_code || undefined,
            customerInfo: {
              fullName: ord.recipient_name,
              phone: ord.phone,
              email: ord.email || '',
              address: ord.address_line,
              city: ord.city,
              district: ord.district,
              note: ord.note || undefined,
              paymentMethod: ord.payment_method,
            },
            items: details.map((d) => ({
              product: {
                id: d.s_product_id,
                name: d.product_name,
                price: d.unit_price,
                images: d.image_url ? [d.image_url] : [],
              },
              quantity: d.quantity,
              selectedColor: d.selected_color || undefined,
            })),
          };
        })
      );

      return sendSuccess(res, 'Lấy danh sách đơn hàng thành công', populatedOrders);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy đơn hàng', 500);
    }
  }

  /**
   * GET /api/v1/orders/:id
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
        subtotal: order.subtotal,
        discountAmount: order.discount_amount,
        shippingFee: order.shipping_fee,
        totalAmount: order.total_amount,
        voucherCode: order.voucher_code || undefined,
        customerInfo: {
          fullName: order.recipient_name,
          phone: order.phone,
          email: order.email || '',
          address: order.address_line,
          city: order.city,
          district: order.district,
          note: order.note || undefined,
          paymentMethod: order.payment_method,
        },
        items: details.map((d) => ({
          product: {
            id: d.s_product_id,
            name: d.product_name,
            price: d.unit_price,
            images: d.image_url ? [d.image_url] : [],
          },
          quantity: d.quantity,
          selectedColor: d.selected_color || undefined,
        })),
      };

      return sendSuccess(res, 'Lấy chi tiết đơn hàng thành công', formatted);
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi lấy chi tiết đơn hàng', 500);
    }
  }

  /**
   * PATCH /api/v1/orders/:id/cancel
   */
  static async cancelOrder(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const order = await OrderModel.findOne({
        $or: [{ s_order_id: id }, { s_ID: id }],
      });

      if (!order) {
        return sendError(res, 'Không tìm thấy đơn hàng', 404);
      }

      if (order.status !== 'pending') {
        return sendError(res, 'Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xác nhận (pending)', 400);
      }

      order.status = 'cancelled';
      await order.save();

      // Return stock back to inventory
      const details = await OrderDetailModel.find({ s_order_id: order.s_ID });
      for (const d of details) {
        await ProductModel.findOneAndUpdate(
          { s_ID: d.s_product_id },
          { $inc: { stock_quantity: d.quantity } }
        );
      }

      return sendSuccess(res, 'Đã hủy đơn hàng thành công');
    } catch (error: any) {
      return sendError(res, error.message || 'Lỗi khi hủy đơn hàng', 500);
    }
  }
}
