import { Order, OrderStatus, OrderCustomerInfo, CartItem, Voucher, IFVoucher } from '~/types';
import { storageService } from './storageService';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '~/common/constants';
import instanceBE from './v1/instance';

export const orderService = {
  getOrders(): Order[] {
    return storageService.getOrders();
  },

  getOrderById(id: string): Order | undefined {
    return storageService.getOrders().find(o => o.id === id);
  },

  async validateVoucher(code: string, subtotal: number): Promise<{ valid: boolean; voucher?: Voucher; error?: string }> {
    try {
      const res: any = await instanceBE.get(`/vouchers/${code}`);
      const v: IFVoucher = res.data;
      if (!v) return { valid: false, error: 'Mã giảm giá không tồn tại' };

      if (subtotal < (v.minOrderValue || 0)) {
        return { valid: false, error: `Mã áp dụng cho đơn hàng tối thiểu ${(v.minOrderValue || 0).toLocaleString('vi-VN')}₫` };
      }

      return {
        valid: true,
        voucher: {
          code: v.code,
          name: v.name,
          discountType: v.discountType,
          discountValue: v.discountValue,
          minOrderValue: v.minOrderValue,
          maxDiscount: v.maxDiscount,
          description: v.description,
        }
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Mã giảm giá không hợp lệ' };
    }
  },

  calculateDiscount(voucher: Voucher, subtotal: number): number {
    if (voucher.discountType === 'fixed') {
      return voucher.discountValue;
    }
    const calc = Math.round((subtotal * voucher.discountValue) / 100);
    if (voucher.maxDiscount && calc > voucher.maxDiscount) {
      return voucher.maxDiscount;
    }
    return calc;
  },

  createOrder(
    items: CartItem[],
    customerInfo: OrderCustomerInfo,
    voucherCode?: string
  ): Order {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    let discountAmount = 0;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items,
      customerInfo,
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      status: 'pending',
      voucherCode,
    };

    const currentOrders = storageService.getOrders();
    currentOrders.unshift(newOrder);
    storageService.saveOrders(currentOrders);

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const orders = storageService.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return false;

    orders[index].status = status;
    storageService.saveOrders(orders);
    return true;
  }
};
