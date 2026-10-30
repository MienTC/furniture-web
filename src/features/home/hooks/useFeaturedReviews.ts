import { useQuery } from '@tanstack/react-query';
import { reviewService } from '~/services/v1/review.service';
import type { FeaturedReview } from '~/types';

export const useFeaturedReviews = () => {
  return useQuery<FeaturedReview[]>({
    queryKey: ['featuredReviews'],
    queryFn: () => reviewService.fetchFeaturedReviews(),
    staleTime: 5 * 60 * 1000,
  });
};
