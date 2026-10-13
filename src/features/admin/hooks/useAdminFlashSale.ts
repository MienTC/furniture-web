import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleService } from '~/services/v1/flashsale.service';
import type { FlashSaleConfig, FlashSaleData } from '~/types';

export const useAdminFlashSale = () => {
  const queryClient = useQueryClient();

  const flashSaleQuery = useQuery<FlashSaleData>({
    queryKey: ['adminFlashSale'],
    queryFn: () => flashSaleService.getFlashSale(),
    staleTime: 2 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: FlashSaleConfig) => flashSaleService.updateConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFlashSale'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleData'] });
    },
  });

  return {
    flashSaleData: flashSaleQuery.data,
    isLoading: flashSaleQuery.isLoading,
    isUpdating: updateMutation.isPending,
    updateConfig: updateMutation.mutateAsync,
    refetch: flashSaleQuery.refetch,
  };
};

export default useAdminFlashSale;
