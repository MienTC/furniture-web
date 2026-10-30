import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleService } from '~/services/v1/flashsale.service';
import type { FlashSaleConfig, FlashSaleData } from '~/types';

export const useFlashSale = () => {
  return useQuery<FlashSaleData>({
    queryKey: ['flashSaleData'],
    queryFn: () => flashSaleService.getFlashSale(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateFlashSaleConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FlashSaleConfig) => flashSaleService.updateConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashSaleData'] });
    },
  });
};
