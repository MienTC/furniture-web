export interface IFVoucher {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  label?: string;
  colorClass?: string;
  expiresAt?: string;
}

export const MOCK_VOUCHERS: IFVoucher[] = [
  {
    code: 'LUXURY10', discountType: 'percentage', discountValue: 10,
    minOrderValue: 10000000, maxDiscount: 3000000,
    description: 'Giảm 10% tối đa 3.000.000₫ cho đơn từ 10 triệu',
    label: 'Hôm nay', colorClass: 'bg-rose-600',
  },
  {
    code: 'FREESHIP', discountType: 'fixed', discountValue: 300000,
    minOrderValue: 5000000,
    description: 'Miễn phí vận chuyển tận nhà (Giảm 300.000₫)',
    label: 'Flash Sale', colorClass: 'bg-amber-700',
  },
  {
    code: 'NEWHOME500', discountType: 'fixed', discountValue: 500000,
    minOrderValue: 15000000,
    description: 'Giảm trực tiếp 500.000₫ cho gia chủ làm nhà mới',
    label: 'Sự kiện', colorClass: 'bg-stone-800',
  },
];
