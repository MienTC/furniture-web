import type { FeaturedReview, CreateReviewPayload, Review, ResponseAPI } from '~/types';
import instanceBE from './instance';

export class ReviewService {
  async fetchFeaturedReviews(): Promise<FeaturedReview[]> {
    const res = await instanceBE.get<any, ResponseAPI<FeaturedReview[]>>('/reviews/featured');
    return res.data || [];
  }

  async createReview(payload: CreateReviewPayload): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/reviews', payload);
    return res.data;
  }

  async fetchProductReviews(productId: string): Promise<Review[]> {
    const res = await instanceBE.get<any, ResponseAPI<Review[]>>(`/reviews/product/${productId}`);
    return res.data || [];
  }
}

export const reviewService = new ReviewService();
