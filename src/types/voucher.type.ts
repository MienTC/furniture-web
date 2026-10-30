export interface Voucher {
  id?: string;
  code: string;
  name?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export interface IFVoucher {
  id: string;
  code: string;
  name?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount?: number;
  isActive?: boolean;
}

export interface CreateVoucherFormValues {
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  description?: string;
  start_date?: string;
  end_date?: string;
}
