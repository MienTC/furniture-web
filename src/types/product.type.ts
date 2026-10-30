export type CategoryId = string;

export interface ProductVariant {
  id?: string;
  s_ID?: string;
  s_product_ID?: string;
  sku?: string;
  variant_name: string;
  color?: string;
  size?: string;
  material?: string;
  image_url?: string;
  list_price?: number;
  sale_price: number;
  stock_quantity?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: CategoryId;
  categoryName: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  images: string[];
  dimensions: string;
  material: string;
  colorOptions: string[];
  origin: string;
  warranty: string;
  description: string;
  specifications: Record<string, string>;
  reviews?: import('./review.type').Review[];
  variants?: ProductVariant[];
}

export interface ProductFilterParams {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  flashsale?: boolean;
  ids?: string[];
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface ProductFormValues {
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  material?: string;
  dimensions?: string;
  origin?: string;
  warranty?: string;
  videoUrl?: string;
  description?: string;
  images?: string[];
}
