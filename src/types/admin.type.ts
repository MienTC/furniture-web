export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminPaginatedResponse<T> {
  items: T[];
  pagination: AdminPagination;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  orderStatusCounts: Record<string, number>;
  revenueByDate?: Array<{ date: string; revenue: number; orders: number }>;
  categoryDistribution?: Array<{ name: string; count: number }>;
  recentOrders: any[];
}

export type AdminProductPayload = AdminProductDto;

export interface AdminProductDto {
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stockQuantity: number;
  images: string[];
  description?: string;
  material?: string;
  dimensions?: string;
  origin?: string;
  warranty?: string;
  videoUrl?: string;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface AdminCategoryDto {
  name: string;
  description?: string;
  image_url?: string;
}

export interface AdminBannerDto {
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  badge_text?: string;
  highlights?: string[];
  type?: 'hero' | 'showcase' | 'trustbar' | 'promo_img4';
}

export interface AdminVoucherDto {
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
}

export interface AdminReviewReplyDto {
  id: string;
  reply: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
  zaloUrl: string;
}

export interface ContactSettingsData {
  hotline?: string;
  hotline2?: string;
  address1?: string;
  address2?: string;
  fanpage_url?: string;
  contacts?: ContactPerson[];
}
