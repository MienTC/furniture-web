import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/common/com-query-key';
import { ProductService } from '~/services/v1/product.service';

const productService = new ProductService();

export function useCategories() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.category.list],
    queryFn: () => productService.fetchCategories(),
    staleTime: 10 * 60 * 1000,
  });

  return {
    categories: data ?? [],
    isCategoriesLoading: isLoading,
    refetchCategories: refetch,
  };
}
