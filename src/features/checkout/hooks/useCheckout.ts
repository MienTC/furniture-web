import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '~/services/orderService';
import { paymentService } from '~/services/v1/payment.service';
import { QUERY_KEYS } from '~/common/com-query-key';
import type { CartItem, OrderCustomerInfo } from '~/types';

interface CheckoutPayload {
  items: CartItem[];
  customerInfo: OrderCustomerInfo;
  voucherCode?: string;
}

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ items, customerInfo, voucherCode }: CheckoutPayload) => {
      // Gọi trực tiếp backend API tạo đơn hàng (Dữ liệu động 100%, không fallback local)
      const backendOrder = await orderService.createOrderApi(items, customerInfo, voucherCode);
      const effectiveOrderId = backendOrder?.s_order_id || backendOrder?.id;

      if (!effectiveOrderId) {
        throw new Error('Không nhận được mã đơn hàng từ hệ thống');
      }

      // Nếu chọn VNPay thì lấy URL thanh toán từ Payment Service
      let paymentUrl: string | null = null;
      if (customerInfo.paymentMethod === 'vnpay') {
        const payRes = await paymentService.createVNPayUrl(effectiveOrderId);
        paymentUrl = payRes?.paymentUrl || null;
      }

      return {
        orderId: effectiveOrderId,
        paymentUrl,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order.list] });
    },
  });
};
