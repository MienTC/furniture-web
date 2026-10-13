import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import type { AdminBannerDto } from '~/types/admin.type';

export const useAdminBanners = () => {
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.banners.list],
    queryFn: () => adminService.getBanners(),
  });

  const { mutateAsync: createBanner, isPending: isCreating } = useMutation({
    mutationFn: (payload: AdminBannerDto) => adminService.createBanner(payload),
    onSuccess: () => {
      toast.success('Tạo banner mới thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.banners.list] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi tạo banner');
    },
  });

  const { mutateAsync: updateBanner, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminService.updateBanner(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật banner thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.banners.list] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi cập nhật banner');
    },
  });

  const { mutateAsync: deleteBanner, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => {
      toast.success('Đã xóa banner');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.banners.list] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi xóa banner');
    },
  });

  return {
    banners,
    isLoading,
    refetch,
    createBanner,
    updateBanner,
    deleteBanner,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
