import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/common/com-query-key';
import { productService } from '~/services/productService';

export function useCategories() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.category.list],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
  return { categories: data ?? [], isCategoriesLoading: isLoading };
}
