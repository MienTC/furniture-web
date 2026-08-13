import { Product, ProductFilterParams, Category } from '~/types';
import { MOCK_CATEGORIES } from '~/mock/data';
import { storageService } from './storageService';

export const productService = {
  getCategories(): Category[] {
    return MOCK_CATEGORIES;
  },

  getProducts(params?: ProductFilterParams): Product[] {
    let products = storageService.getProducts();

    if (!params) return products;

    if (params.categoryId) {
      products = products.filter(p => p.categoryId === params.categoryId);
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      products = products.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.description.toLowerCase().includes(q) ||
             p.material.toLowerCase().includes(q)
      );
    }

    if (params.minPrice !== undefined) {
      products = products.filter(p => p.price >= (params.minPrice || 0));
    }

    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      products = products.filter(p => p.price <= (params.maxPrice || Infinity));
    }

    if (params.materials && params.materials.length > 0) {
      products = products.filter(p => params.materials?.some(m => p.material.includes(m)));
    }

    if (params.inStockOnly) {
      products = products.filter(p => p.inStock);
    }

    if (params.onSaleOnly) {
      products = products.filter(p => (p.discountPercent || 0) > 0);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'featured':
        default:
          products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return products;
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = storageService.getProducts();
    return products.find(p => p.slug === slug || p.id === slug);
  },

  addProduct(newProduct: Omit<Product, 'id'>): Product {
    const products = storageService.getProducts();
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
    };
    products.unshift(created);
    storageService.saveProducts(products);
    return created;
  },

  updateProduct(id: string, update: Partial<Product>): Product | null {
    const products = storageService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...update };
    storageService.saveProducts(products);
    return products[index];
  },

  deleteProduct(id: string): boolean {
    const products = storageService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    storageService.saveProducts(filtered);
    return true;
  }
};
