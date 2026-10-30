import type { CategoryId } from './product.type';

export interface Category {
  id: CategoryId;
  s_ID?: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface AdminCategoryPayload {
  name: string;
  description?: string;
  image_url?: string;
}
