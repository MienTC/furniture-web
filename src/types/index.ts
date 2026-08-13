export type CategoryId = 'phong-khach' | 'phong-ngu' | 'phong-an' | 'phong-lam-viec' | 'den-trang-tri';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
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
  dimensions: string; // e.g. "D200 x R90 x C75 cm"
  material: string;   // e.g. "Gỗ Sồi Tự Nhiên / Da Bò Ý"
  colorOptions: string[];
  origin: string;     // e.g. "Ý", "Việt Nam", "Đan Mạch"
  warranty: string;   // e.g. "36 tháng"
  description: string;
  specifications: Record<string, string>;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Voucher {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  note?: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card';
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customerInfo: OrderCustomerInfo;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  voucherCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}

export interface ProductFilterParams {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
