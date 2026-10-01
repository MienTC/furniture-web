import type { IFVoucher, ResponseAPI } from '~/types';
import instanceBE from './instance';

export class VoucherService {
  async fetchVouchers(): Promise<IFVoucher[]> {
    try {
      const res = await instanceBE.get<any, ResponseAPI<IFVoucher[]>>('/vouchers');
      return res.data;
    } catch (err: any) {
      throw err;
    }
  }

  async fetchVoucherByCode(code: string): Promise<IFVoucher> {
    try {
      const res = await instanceBE.get<any, ResponseAPI<IFVoucher>>(`/vouchers/${code}`);
      return res.data;
    } catch (err: any) {
      throw new Error(`Mã "${code}" không hợp lệ hoặc đã hết hạn`);
    }
  }

  validateVoucher(voucher: IFVoucher, subtotal: number): { valid: boolean; error?: string } {
    if (subtotal < (voucher.minOrderValue || 0)) {
      return { valid: false, error: `Mã áp dụng cho đơn từ ${(voucher.minOrderValue || 0).toLocaleString('vi-VN')}₫` };
    }
    return { valid: true };
  }

  calculateDiscount(voucher: IFVoucher, subtotal: number): number {
    if (voucher.discountType === 'fixed') return voucher.discountValue;
    const calc = Math.round((subtotal * voucher.discountValue) / 100);
    return voucher.maxDiscount ? Math.min(calc, voucher.maxDiscount) : calc;
  }
}
