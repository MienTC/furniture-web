import { useQuery } from '@tanstack/react-query';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import type { AdminStatsParams } from '~/types';

export const useAdminStats = (params?: AdminStatsParams) => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.stats, params],
    queryFn: () => adminService.getStats(params),
  });

  return {
    stats,
    isLoading,
    refetch,
  };
};
