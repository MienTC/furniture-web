import instanceBE from './instance';
import type { ResponseAPI, IPaymentConfig, ICreateVNPayResponse } from '~/types';

export class PaymentService {
  /**
   * Lấy cấu hình thanh toán public (Hiển thị phương thức, thông tin ngân hàng công khai)
   */
  async getPaymentSettings(): Promise<IPaymentConfig> {
    const res = await instanceBE.get<any, ResponseAPI<IPaymentConfig>>('/payment/settings');
    return res.data;
  }

  /**
   * Tạo đường dẫn thanh toán trực tuyến VNPay
   */
  async createVNPayUrl(orderId: string): Promise<ICreateVNPayResponse> {
    const res = await instanceBE.post<any, ResponseAPI<ICreateVNPayResponse>>('/payment/vnpay/create-url', {
      orderId,
    });
    return res.data;
  }
}

export const paymentService = new PaymentService();
