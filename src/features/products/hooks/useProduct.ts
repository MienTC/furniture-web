import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { QUERY_KEYS } from '~/common/com-query-key';
import { ProductService } from '~/services/v1/product.service';
import type { Product, ProductFilterParams } from '~/types';

const productService = new ProductService();

export function useProducts(params?: ProductFilterParams) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.product.list, params],
    queryFn: () => productService.fetchProducts(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    products: data ?? [],
    isProductsLoading: isLoading,
    refetchProducts: refetch,
  };
}

export function useProductDetail(slug: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.product.detail, slug],
    queryFn: () => productService.fetchProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: (body: Partial<Product>) => {
      if (!data?.id) throw new Error('Product ID not found');
      return productService.updateProduct(data.id, body);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.product.list] });
      message.success('Cập nhật sản phẩm thành công!');
    },
    onError: (err: any) => {
      message.error(err.message || 'Lỗi cập nhật sản phẩm');
    },
  });

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      if (!data?.id) throw new Error('Product ID not found');
      return productService.deleteProduct(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.product.list] });
      message.success('Xóa sản phẩm thành công!');
    },
    onError: (err: any) => {
      message.error(err.message || 'Lỗi xóa sản phẩm');
    },
  });

  return {
    product: data,
    isProductLoading: isLoading,
    refetchProduct: refetch,
    updateProduct,
    isUpdating,
    deleteProduct,
    isDeleting,
  };
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
    mutationFn: (body: Partial<Product>) => productService.createProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.product.list] });
      message.success('Tạo sản phẩm thành công!');
    },
    onError: (err: any) => {
      message.error(err.message || 'Lỗi tạo sản phẩm');
    },
  });

  return {
    createProduct,
    isCreating,
  };
}
