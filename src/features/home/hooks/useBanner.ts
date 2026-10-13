import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/common/com-query-key';
import { BannerService } from '~/services/v1/banner.service';

const bannerService = new BannerService();

export function useBanners() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.banner.list],
    queryFn: () => bannerService.fetchBanners(),
    staleTime: 10 * 60 * 1000,
  });
  return { banners: data ?? [], isBannersLoading: isLoading };
}

export function useTrustBar() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.trustBar.list],
    queryFn: () => bannerService.fetchTrustBar(),
    staleTime: 10 * 60 * 1000,
  });
  return { trustBarItems: data ?? [], isTrustBarLoading: isLoading };
}

export function useShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.showcase.detail],
    queryFn: () => bannerService.fetchShowcase(),
    staleTime: 10 * 60 * 1000,
  });
  return { showcase: data, isShowcaseLoading: isLoading };
}

export function usePromoImg4() {
  const { data, isLoading } = useQuery({
    queryKey: ['promoImg4'],
    queryFn: () => bannerService.fetchPromoImg4(),
    staleTime: 10 * 60 * 1000,
  });
  return { promoImg4: data, isPromoLoading: isLoading };
}

