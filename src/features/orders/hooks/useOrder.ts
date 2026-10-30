import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderServiceBE } from '~/services/v1/order.service';
import { QUERY_KEYS } from '~/common/com-query-key';
import type { Order } from '~/types';

export const useMyOrders = () => {
  return useQuery<Order[]>({
    queryKey: [QUERY_KEYS.order.list],
    queryFn: () => orderServiceBE.fetchMyOrders(),
  });
};

export const useOrderDetail = (orderId?: string) => {
  return useQuery<Order | undefined>({
    queryKey: [QUERY_KEYS.order.detail, orderId],
    queryFn: async () => {
      if (!orderId) return undefined;
      return await orderServiceBE.fetchOrderDetail(orderId);
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
    mutationFn: (orderId: string) => orderServiceBE.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order.detail, orderId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order.list] });
    },
  });
};
