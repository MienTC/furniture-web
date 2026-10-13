import type { CartItem, OrderStatus } from './index';

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
