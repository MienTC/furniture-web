import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';

export const useAdminPaymentSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.settings],
    queryFn: () => adminService.getPaymentSettings(),
  });

  const { mutateAsync: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: (payload: any) => adminService.updatePaymentSettings(payload),
    onSuccess: () => {
      toast.success('Đã lưu cấu hình cổng thanh toán thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.settings] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi lưu cấu hình thanh toán');
    },
  });

  return {
    settings,
    isLoading,
    refetch,
    updateSettings,
    isUpdating,
  };
};
