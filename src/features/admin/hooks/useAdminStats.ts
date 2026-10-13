import { useQuery } from '@tanstack/react-query';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';

export const useAdminStats = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.stats],
    queryFn: () => adminService.getStats(),
  });

  return {
    stats,
    isLoading,
    refetch,
  };
};
