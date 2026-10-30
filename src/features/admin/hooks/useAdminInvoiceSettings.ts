import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import type { InvoiceCompanyInfo } from '~/common/utils/printInvoice';

export const useAdminInvoiceSettings = () => {
  const queryClient = useQueryClient();

  const { data: invoiceSettings, isLoading } = useQuery<InvoiceCompanyInfo | null>({
    queryKey: ['admin', 'invoice-settings'],
    queryFn: () => adminService.getInvoiceSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: InvoiceCompanyInfo) => adminService.updateInvoiceSettings(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(['admin', 'invoice-settings'], saved);
      toast.success('Đã lưu thông tin mẫu hóa đơn thành công vào hệ thống');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  return {
    invoiceSettings,
    isLoading,
    updateInvoiceSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

export default useAdminInvoiceSettings;
