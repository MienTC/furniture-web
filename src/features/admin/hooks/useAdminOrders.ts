import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';

interface UseAdminOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const useAdminOrders = (params?: UseAdminOrdersParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.orders.list, params?.page, params?.status],
    queryFn: () => adminService.getOrders(params),
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
    pagination: data?.pagination,
    isLoading,
    refetch,
    updateOrderStatus,
    isUpdatingStatus,
  };
};
