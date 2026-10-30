import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { flashSaleService } from '~/services/v1/flashsale.service';
import type { FlashSaleConfig, FlashSaleData } from '~/types';

export const useAdminFlashSale = () => {
  const queryClient = useQueryClient();

  const flashSaleQuery = useQuery<FlashSaleData>({
    queryKey: ['adminFlashSale'],
    queryFn: () => flashSaleService.getFlashSale(),
    staleTime: 0,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: FlashSaleConfig) => flashSaleService.updateConfig(payload),
    onSuccess: () => {
      toast.success('Đã lưu cấu hình Flash Sale thành công!');
      queryClient.invalidateQueries({ queryKey: ['adminFlashSale'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleData'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
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
