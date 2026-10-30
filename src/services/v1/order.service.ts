import type { Order, ResponseAPI, CheckoutPayload } from '~/types';
import instanceBE from './instance';

export class OrderService {
  async fetchMyOrders(): Promise<Order[]> {
    const res = await instanceBE.get<any, ResponseAPI<Order[]>>('/orders');
    return res.data || [];
  }

  async fetchOrderDetail(id: string): Promise<Order> {
    const res = await instanceBE.get<any, ResponseAPI<Order>>(`/orders/${id}`);
    return res.data;
  }

  async createOrder(payload: CheckoutPayload): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/orders', payload);
    return res.data;
  }

  async cancelOrder(id: string): Promise<any> {
    const res = await instanceBE.patch<any, ResponseAPI<any>>(`/orders/${id}/cancel`);
    return res.data;
  }
}

export const orderServiceBE = new OrderService();
