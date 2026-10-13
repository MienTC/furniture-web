import instanceBE from './instance';
import type { ResponseAPI, IPaymentConfig } from '~/types';

export class PaymentService {
  /**
   * Lấy cấu hình thanh toán public (Hiển thị phương thức, thông tin ngân hàng công khai)
   */
  async getPaymentSettings(): Promise<IPaymentConfig> {
    const res = await instanceBE.get<any, ResponseAPI<IPaymentConfig>>('/payment/settings');
    return res.data;
  }
}

export const paymentService = new PaymentService();

