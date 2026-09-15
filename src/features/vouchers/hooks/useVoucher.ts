import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/common/com-query-key';
import { VoucherService } from '~/services/v1/voucher.service';

const voucherService = new VoucherService();

export function useVouchers() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.voucher.list],
    queryFn: () => voucherService.fetchVouchers(),
    staleTime: 5 * 60 * 1000,
  });
  return { vouchers: data ?? [], isVouchersLoading: isLoading };
}

export { voucherService };
