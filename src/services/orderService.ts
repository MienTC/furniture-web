import { Order, OrderCustomerInfo, CartItem, Voucher, IFVoucher } from '~/types';
import { orderServiceBE } from './v1/order.service';
import { VoucherService } from './v1/voucher.service';

const voucherService = new VoucherService();

export const orderService = {
  async fetchOrderById(id: string): Promise<Order | undefined> {
    try {
      return await orderServiceBE.fetchOrderDetail(id);
    } catch {
      return undefined;
    }
  },

  async validateVoucher(code: string, subtotal: number): Promise<{ valid: boolean; voucher?: Voucher; error?: string }> {
    try {
      const v: IFVoucher = await voucherService.fetchVoucherByCode(code);
      if (!v) return { valid: false, error: 'Mã giảm giá không tồn tại' };

      const validation = voucherService.validateVoucher(v, subtotal);
      if (!validation.valid) {
        return { valid: false, error: validation.error };
      }

      return {
        valid: true,
        voucher: {
          code: v.code,
          name: v.name,
          discountType: v.discountType,
          discountValue: v.discountValue,
          minOrderValue: v.minOrderValue || 0,
          maxDiscount: v.maxDiscount,
          description: v.description || '',
        },
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Mã giảm giá không hợp lệ' };
    }
  },

  calculateDiscount(voucher: Voucher, subtotal: number): number {
    return voucherService.calculateDiscount(voucher as IFVoucher, subtotal);
  },

  async createOrderApi(
    items: CartItem[],
    customerInfo: OrderCustomerInfo,
    voucherCode?: string
  ): Promise<any> {
    return orderServiceBE.createOrder({
      items,
      customerInfo,
      voucherCode,
    });
  },
};
