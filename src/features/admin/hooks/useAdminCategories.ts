import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import type { AdminCategoryDto } from '~/types/admin.type';

export const useAdminCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.categories.list],
    queryFn: () => adminService.getCategories(),
  });

  const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (payload: AdminCategoryDto) => adminService.createCategory(payload),
    onSuccess: () => {
      toast.success('Tạo danh mục mới thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.categories.list] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  const { mutateAsync: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminCategoryDto> }) =>
      adminService.updateCategory(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.categories.list] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  const { mutateAsync: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      toast.success('Đã xóa danh mục');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.categories.list] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  return {
    categories,
    isLoading,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  };
};

export default useAdminCategories;
