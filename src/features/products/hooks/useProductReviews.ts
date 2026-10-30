import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '~/services/v1/review.service';
import type { CreateReviewPayload, Review } from '~/types';

export const useProductReviews = (productId?: string) => {
  return useQuery<Review[]>({
    queryKey: ['product-reviews', productId],
    queryFn: () => (productId ? reviewService.fetchProductReviews(productId) : Promise.resolve([])),
    enabled: Boolean(productId),
  });
};

export const useCreateReview = (productId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(payload),
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      }
      queryClient.invalidateQueries({ queryKey: ['featuredReviews'] });
    },
  });
};
