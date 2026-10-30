import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import { QUERY_KEYS } from '~/common/com-query-key';
import type { ContactSettingsData } from '~/types';

export const useAdminContactSettings = () => {
  const queryClient = useQueryClient();

  const { data: contactSettings, isLoading, refetch } = useQuery<ContactSettingsData | null>({
    queryKey: [ADMIN_QUERY_KEYS.contactSettings],
    queryFn: () => adminService.getContactSettings(),
  });

  const { mutateAsync: updateContactSettings, isPending: isUpdating } = useMutation({
    mutationFn: (payload: ContactSettingsData) => adminService.updateContactSettings(payload),
    onSuccess: () => {
      toast.success('Đã lưu cấu hình liên hệ & Zalo thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.contactSettings] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.contact.settings] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  return {
    contactSettings,
    isLoading,
    refetch,
    updateContactSettings,
    isUpdating,
  };
};

export const usePublicContactSettings = () => {
  return useQuery<ContactSettingsData | null>({
    queryKey: [QUERY_KEYS.contact.settings],
    queryFn: () => adminService.getPublicContactSettings(),
    staleTime: 60 * 1000,
  });
};
