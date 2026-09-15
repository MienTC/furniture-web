import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/common/com-query-key';
import { productService } from '~/services/productService';
import type { ProductFilterParams } from '~/types';

export function useProducts(params?: ProductFilterParams) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.product.list, params],
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000,
  });
  return { products: data ?? [], isProductsLoading: isLoading };
}
