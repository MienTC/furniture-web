import { Order, OrderStatus, OrderCustomerInfo, CartItem, Voucher } from '~/types';
import { storageService } from './storageService';
import { MOCK_VOUCHERS } from '~/mock/data';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '~/common/constants';

export const orderService = {
  getOrders(): Order[] {
    return storageService.getOrders();
  },

  getOrderById(id: string): Order | undefined {
    return storageService.getOrders().find(o => o.id === id);
  },

  validateVoucher(code: string, subtotal: number): { valid: boolean; voucher?: Voucher; error?: string } {
    const voucher = MOCK_VOUCHERS.find(v => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!voucher) {
      return { valid: false, error: 'Mã giảm giá không tồn tại' };
    }

    if (subtotal < voucher.minOrderValue) {
      return { valid: false, error: `Mã áp dụng cho đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}₫` };
    }

    return { valid: true, voucher };
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
    if (voucherCode) {
      const vResult = this.validateVoucher(voucherCode, subtotal);
      if (vResult.valid && vResult.voucher) {
        discountAmount = this.calculateDiscount(vResult.voucher, subtotal);
      }
    }

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

    const orders = storageService.getOrders();
    orders.unshift(newOrder);
    storageService.saveOrders(orders);
    
    // Clear cart after creating order
    storageService.saveCart([]);

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const orders = storageService.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    orders[index].status = status;
    storageService.saveOrders(orders);
    return orders[index];
  }
};
