import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';

import type { AdminOrderQueryParams, AdminCreateOrderPayload } from '~/types';

export const useAdminOrders = (params?: AdminOrderQueryParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      ADMIN_QUERY_KEYS.orders.list,
      params?.page,
      params?.status,
      params?.startDate,
      params?.endDate,
      params?.urgentOnly,
      params?.search,
    ],
    queryFn: () => adminService.getOrders(params),
  });

  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useMutation({
    mutationFn: (orderData: AdminCreateOrderPayload) => adminService.createOrder(orderData),
    onSuccess: () => {
      toast.success('Đã tạo đơn hàng mới thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.orders.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || 'Lỗi tạo đơn hàng');
    },
  });

  const { mutateAsync: updateOrderStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái đơn hàng thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.orders.list] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi cập nhật trạng thái đơn hàng');
    },
  });

  return {
    orders: data?.items || [],
    total: data?.pagination?.total || 0,
    urgentCount: data?.urgentCount || 0,
    pagination: data?.pagination,
    isLoading,
    refetch,
    createOrder,
    isCreatingOrder,
    updateOrderStatus,
    isUpdatingStatus,
  };
};
