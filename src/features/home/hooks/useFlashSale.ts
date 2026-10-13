import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import instanceBE from '~/services/v1/instance';
import type { ResponseAPI, Product } from '~/types';

export interface FlashSaleConfig {
  is_active: boolean;
  title?: string;
  discount_badge?: string;
  description?: string;
  end_time?: string | null;
  product_ids?: string[];
}

export interface FlashSaleData {
  isActive: boolean;
  config: FlashSaleConfig;
  products: Product[];
}

export const useFlashSale = () => {
  return useQuery<FlashSaleData>({
    queryKey: ['flashSaleData'],
    queryFn: async () => {
      const res = await instanceBE.get<any, ResponseAPI<FlashSaleData>>('/flash-sale');
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateFlashSaleConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FlashSaleConfig) => {
      const res = await instanceBE.put<any, ResponseAPI<any>>('/flash-sale/config', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashSaleData'] });
    },
  });
};
