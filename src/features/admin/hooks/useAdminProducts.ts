import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import type { AdminProductDto } from '~/types';

export interface UseAdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export const useAdminProducts = (params?: UseAdminProductsParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.products.list, params?.page, params?.search, params?.categoryId],
    queryFn: () => adminService.getProducts(params),
  });

  const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
    mutationFn: (payload: AdminProductDto) => adminService.createProduct(payload as any),
    onSuccess: () => {
      toast.success('Thêm sản phẩm mới thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.products.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminProductDto> }) =>
      adminService.updateProduct(id, payload as any),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.products.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.products.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  const { mutateAsync: assignProductsToCategory, isPending: isAssigning } = useMutation({
    mutationFn: ({ categoryId, productIds }: { categoryId: string; productIds: string[] }) =>
      adminService.assignProductsToCategory(categoryId, productIds),
    onSuccess: () => {
      toast.success('Đã thêm sản phẩm vào danh mục');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.products.list] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.categories.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  const { mutateAsync: removeProductsFromCategory, isPending: isRemoving } = useMutation({
    mutationFn: ({ categoryId, productIds }: { categoryId: string; productIds: string[] }) =>
      adminService.removeProductsFromCategory(categoryId, productIds),
    onSuccess: () => {
      toast.success('Đã gỡ sản phẩm khỏi danh mục');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.products.list] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.categories.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  return {
    products: data?.items || [],
    total: data?.pagination?.total || 0,
    pagination: data?.pagination,
    isLoading,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    assignProductsToCategory,
    isAssigning,
    removeProductsFromCategory,
    isRemoving,
    isSubmitting: isCreating || isUpdating,
    isDeleting,
  };
};
