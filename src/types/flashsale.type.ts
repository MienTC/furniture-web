import type { Product } from './index';

export interface FlashSaleConfig {
  is_active: boolean;
  title: string;
  discount_badge: string;
  description: string;
  end_time?: string | null;
  product_ids: string[];
}

export interface FlashSaleData {
  isActive: boolean;
  config: FlashSaleConfig;
  products: Product[];
}

export interface FlashSaleFormValues {
  is_active: boolean;
  title: string;
  discount_badge: string;
  description: string;
  end_time?: string | null;
  product_ids: string[];
}
