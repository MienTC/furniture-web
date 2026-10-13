import { useQuery } from '@tanstack/react-query';
import instanceBE from '~/services/v1/instance';
import type { ResponseAPI } from '~/types';

export interface FeaturedReview {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  product: string;
}

export const useFeaturedReviews = () => {
  return useQuery<FeaturedReview[]>({
    queryKey: ['featuredReviews'],
    queryFn: async () => {
      const res = await instanceBE.get<any, ResponseAPI<FeaturedReview[]>>('/reviews/featured');
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
