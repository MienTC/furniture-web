import { APP_ENV } from '~/common/com-env';
import { MOCK_VOUCHERS } from '~/mock/vouchers/mock-vouchers';
import type { IFVoucher } from '~/mock/vouchers/mock-vouchers';
import instanceBE from './instance';

export class VoucherService {
  async fetchVouchers(): Promise<IFVoucher[]> {
    if (APP_ENV.useMock) return MOCK_VOUCHERS;
    const res = await instanceBE.get<any, any>('/vouchers');
    return res.data;
  }

  async fetchVoucherByCode(code: string): Promise<IFVoucher> {
    if (APP_ENV.useMock) {
      const v = MOCK_VOUCHERS.find(x => x.code.toUpperCase() === code.toUpperCase());
      if (!v) throw new Error(`Mã "${code}" không tồn tại`);
      return v;
    }
    const res = await instanceBE.get<any, any>(`/vouchers/${code}`);
    return res.data;
  }

  validateVoucher(voucher: IFVoucher, subtotal: number): { valid: boolean; error?: string } {
    if (subtotal < voucher.minOrderValue)
      return { valid: false, error: `Mã áp dụng cho đơn từ ${voucher.minOrderValue.toLocaleString('vi-VN')}₫` };
    return { valid: true };
  }

  calculateDiscount(voucher: IFVoucher, subtotal: number): number {
    if (voucher.discountType === 'fixed') return voucher.discountValue;
    const calc = Math.round((subtotal * voucher.discountValue) / 100);
    return voucher.maxDiscount ? Math.min(calc, voucher.maxDiscount) : calc;
  }
}
