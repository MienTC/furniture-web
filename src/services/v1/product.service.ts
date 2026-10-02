import type { Product, ProductFilterParams, Category, ResponseAPI, ProductListResponse } from '~/types';
import instanceBE from './instance';

export class ProductService {
  async fetchCategories(): Promise<Category[]> {
    try {
      const response = await instanceBE.get<any, ResponseAPI<Category[]>>('/categories');
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }

  async fetchProducts(params?: ProductFilterParams): Promise<ProductListResponse> {
    try {
      const response = await instanceBE.get<any, ResponseAPI<Product[]>>('/products', {
        params: {
          categoryId: params?.categoryId || undefined,
          search: params?.search || undefined,
          minPrice: params?.minPrice || undefined,
          maxPrice: params?.maxPrice || undefined,
          materials: params?.materials?.length ? params.materials.join(',') : undefined,
          inStockOnly: params?.inStockOnly ? 'true' : undefined,
          onSaleOnly: params?.onSaleOnly ? 'true' : undefined,
          sortBy: params?.sortBy || undefined,
          page: params?.page || 1,
          limit: params?.limit || 12,
        },
      });
      return {
        products: response.data || [],
        pagination: response.pagination || {
          page: params?.page || 1,
          limit: params?.limit || 12,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      };
    } catch (err: any) {
      throw err;
    }
  }

  async fetchProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await instanceBE.get<any, ResponseAPI<Product>>(`/products/${slug}`);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }

  async createProduct(body: Partial<Product>): Promise<Product> {
    try {
      const response = await instanceBE.post<any, ResponseAPI<Product>>('/products', body);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }

  async updateProduct(id: string, body: Partial<Product>): Promise<Product> {
    try {
      const response = await instanceBE.put<any, ResponseAPI<Product>>(`/products/${id}`, body);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await instanceBE.delete<any, ResponseAPI<null>>(`/products/${id}`);
      return true;
    } catch (err: any) {
      throw err;
    }
  }
}
