import { Request } from 'express';

/**
 * Standard API Response Format (aligned with Pet_Manager)
 */
export interface ResponseAPI<T = any> {
  error: boolean;
  code: number;
  message: string;
  data: T;
  traceId?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Standard Token Pair (aligned with Pet_Manager IFTokens)
 */
export interface IFTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Decoded payload inside JWT
 */
export interface JWTPayload {
  userId: string;
  s_ID: string;
  email: string;
  role: 'customer' | 'admin';
}

/**
 * Extend Express Request to attach authenticated user
 */
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * User Interface (Table Ls_users)
 */
export interface IUser {
  s_ID: string;
  s_user: string;
  s_PWD?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin';
  status: boolean;
  refresh_token?: string;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Address Interface (Table LS_Address)
 */
export interface IAddress {
  s_ID: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address_line: string;
  is_default: boolean;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Category Interface (Table Ls_Categories)
 */
export interface ICategory {
  s_ID: string;
  s_parent_category_id?: string | null;
  s_Name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  item_count?: number;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Product Variant Interface (Table LS_ProductVariants)
 */
export interface IProductVariant {
  s_ID: string;
  s_product_ID: string;
  sku: string;
  variant_name?: string;
  color?: string;
  size?: string;
  image_url?: string;
  list_price: number;
  sale_price: number;
  stock_quantity: number;
  reserved_quantity: number;
  is_active: boolean;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Product Image Interface (Table LS_ProductImages)
 */
export interface IProductImage {
  s_ID: string;
  s_product_ID: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  dt_create: Date;
}

/**
 * Product Interface (Table LS_Products)
 */
export interface IProduct {
  s_ID: string;
  s_Product_ID: string;
  category_id: string;
  category_name?: string;
  s_Name: string;
  slug: string;
  sku: string;
  short_description?: string;
  description?: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  dimensions?: string;
  material?: string;
  color_options?: string[];
  origin?: string;
  warranty?: string;
  specifications?: Record<string, string>;
  avg_rating: number;
  review_count: number;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  stock_quantity: number;
  in_stock: boolean;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Cart Interface (Table LS_Carts)
 */
export interface ICart {
  s_ID: string;
  user_id: string;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Cart Item Interface (Table PR_CartItems)
 */
export interface ICartItem {
  s_ID: string;
  s_cart_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  selected_color?: string;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Wishlist Interface (Table LS_Wishlist)
 */
export interface IWishlist {
  s_ID: string;
  user_id: string;
  product_id: string;
  dt_create: Date;
}

/**
 * Voucher Interface (Table LS_Vouchers)
 */
export interface IVoucher {
  s_ID: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
  start_date?: Date;
  end_date?: Date;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Voucher Usage Interface (Table LS_VoucherUsages)
 */
export interface IVoucherUsage {
  s_ID: string;
  voucher_id: string;
  user_id: string;
  order_id: string;
  discount_applied: number;
  dt_used: Date;
}

/**
 * Order Status
 */
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'credit_card';

/**
 * Order Interface (Table LS_Orders)
 */
export interface IOrder {
  s_ID: string;
  s_order_id: string;
  s_user_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  voucher_code?: string;
  note?: string;
  // Shipping details
  recipient_name: string;
  phone: string;
  email?: string;
  address_line: string;
  city: string;
  district: string;
  ward?: string;
  dt_created: Date;
  dt_edit: Date;
}

/**
 * Order Detail Interface (Table PR_OrderDetail)
 */
export interface IOrderDetail {
  s_ID: string;
  s_order_id: string;
  s_product_id: string;
  s_variant_id?: string;
  product_name: string;
  variant_name?: string;
  selected_color?: string;
  image_url?: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  dt_created: Date;
}

/**
 * Review Interface (Table LS_Reviews)
 */
export interface IReview {
  s_ID: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  order_id?: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  is_approved: boolean;
  dt_create: Date;
  dt_edit: Date;
}

/**
 * Banner Interface (Table LS_Banners)
 */
export interface IBanner {
  s_ID: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  badge_text?: string;
  type: 'hero' | 'showcase' | 'trustbar';
  icon_name?: string;
  sort_order: number;
  is_active: boolean;
  dt_create: Date;
  dt_edit: Date;
}
