import { useQuery } from '@tanstack/react-query';
import { paymentService } from '~/services/v1/payment.service';
import { QUERY_KEYS } from '~/common/com-query-key';
import type { IPaymentConfig } from '~/types';

export const usePaymentSettings = () => {
  return useQuery<IPaymentConfig>({
    queryKey: [QUERY_KEYS.payment.settings],
    queryFn: () => paymentService.getPaymentSettings(),
    staleTime: 5 * 60 * 1000,
  });
};

