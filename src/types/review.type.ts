export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface FeaturedReview {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  product: string;
  productId?: string;
  productSlug?: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
  name?: string;
}

export interface AdminReviewReplyPayload {
  id: string;
  reply: string;
}
