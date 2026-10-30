import type { Product, ProductVariant } from './product.type';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: ProductVariant;
  selectedPrice?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  note?: string;
  paymentMethod: 'cod' | 'bank_transfer';
}

export interface OrderItem extends CartItem {
  isReviewed?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  customerInfo: OrderCustomerInfo;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  voucherCode?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  paymentTransactionId?: string;
  paymentPaidAt?: string | null;
}

export interface CheckoutPayload {
  items: CartItem[];
  customerInfo: OrderCustomerInfo;
  voucherCode?: string;
}

export interface AdminCreateOrderItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
  selectedColor?: string;
}

export interface AdminCreateOrderCustomerPayload {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
}

export interface AdminCreateOrderPayload {
  customerInfo: AdminCreateOrderCustomerPayload;
  items: AdminCreateOrderItemPayload[];
  paymentMethod: 'bank_transfer' | 'cod';
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  note?: string;
  voucherCode?: string;
}

export interface AdminOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  urgentOnly?: boolean;
  search?: string;
}

export interface AdminOrderSummaryItem {
  s_ID: string;
  s_order_id: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  district: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: OrderStatus;
  dt_created: string;
}

export interface AdminOrderItem {
  id?: string;
  productId: string;
  productName: string;
  selectedColor?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface AdminOrderDetail {
  id: string;
  s_ID: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentTransactionId?: string;
  paymentPaidAt?: string | null;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  voucherCode?: string;
  recipient_name: string;
  phone: string;
  email?: string;
  address_line?: string;
  district?: string;
  city?: string;
  note?: string;
  items: AdminOrderItem[];
}

export interface AdminUpdateOrderPayload {
  recipient_name?: string;
  phone?: string;
  email?: string;
  address_line?: string;
  district?: string;
  city?: string;
  note?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  paymentTransactionId?: string;
  voucherCode?: string;
  discountAmount?: number;
  shippingFee?: number;
  items?: Array<{
    productId: string;
    productName: string;
    selectedColor?: string;
    unitPrice: number;
    quantity: number;
    imageUrl?: string;
  }>;
}
