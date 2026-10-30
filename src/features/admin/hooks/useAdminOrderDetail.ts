import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import type { AdminOrderDetail, AdminUpdateOrderPayload } from '~/types';

export const useAdminOrderDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery<AdminOrderDetail>({
    queryKey: ['admin', 'orders', id],
    queryFn: () => adminService.getOrderDetail(id!),
    enabled: Boolean(id),
  });

  const updateOrderMutation = useMutation({
    mutationFn: (payload: AdminUpdateOrderPayload) =>
      adminService.updateOrder(id!, payload),
    onSuccess: (updatedOrder) => {
      toast.success('Cập nhật chi tiết đơn hàng thành công');
      queryClient.setQueryData(['admin', 'orders', id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  return {
    order,
    isLoading,
    isError,
    refetch,
    updateOrder: updateOrderMutation.mutateAsync,
    isUpdatingOrder: updateOrderMutation.isPending,
  };
};

export default useAdminOrderDetail;
