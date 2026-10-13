import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import instanceBE from '~/services/v1/instance';
import { QUERY_KEYS } from '~/common/com-query-key';
import type { Order, ResponseAPI } from '~/types';
import { orderService } from '~/services/orderService';

export const useOrderDetail = (orderId?: string) => {
  return useQuery<Order | undefined>({
    queryKey: [QUERY_KEYS.order.detail, orderId],
    queryFn: async () => {
      if (!orderId) return undefined;
      const res = await instanceBE.get<any, ResponseAPI<Order>>(`/orders/${orderId}`);
      return res.data;
    },
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.paymentStatus === 'unpaid') {
        return 5000; // Poll mỗi 5 giây cho đến khi nhận được tiền
      }
      return false;
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await instanceBE.patch<any, ResponseAPI<any>>(`/orders/${orderId}/cancel`);
      return res.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order.detail, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order.list] });
    },
  });
};
