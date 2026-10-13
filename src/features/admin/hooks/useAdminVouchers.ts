import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import type { AdminVoucherDto } from '~/types/admin.type';

export const useAdminVouchers = () => {
  const queryClient = useQueryClient();

  const { data: vouchers = [], isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.vouchers.list],
    queryFn: () => adminService.getVouchers(),
  });

  const { mutateAsync: createVoucher, isPending: isCreating } = useMutation({
    mutationFn: (payload: AdminVoucherDto) => adminService.createVoucher(payload),
    onSuccess: () => {
      toast.success('Tạo mã voucher thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.vouchers.list] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi tạo mã giảm giá');
    },
  });

  const { mutateAsync: deleteVoucher, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => adminService.deleteVoucher(id),
    onSuccess: () => {
      toast.success('Đã xóa voucher');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.vouchers.list] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi xóa voucher');
    },
  });

  return {
    vouchers,
    isLoading,
    refetch,
    createVoucher,
    deleteVoucher,
    isCreating,
    isDeleting,
  };
};
