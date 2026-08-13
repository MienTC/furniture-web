import { CartItem, Order, Product, User } from '~/types';
import { MOCK_INITIAL_ORDERS, MOCK_PRODUCTS, MOCK_USERS } from '~/mock/data';

const CART_KEY = 'luxdecor_cart';
const WISHLIST_KEY = 'luxdecor_wishlist';
const ORDERS_KEY = 'luxdecor_orders';
const USER_KEY = 'luxdecor_user';
const PRODUCTS_KEY = 'luxdecor_products';

export const storageService = {
  // Cart
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  // Wishlist
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveWishlist(productIds: string[]): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(productIds));
  },

  // Orders
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(MOCK_INITIAL_ORDERS));
        return MOCK_INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_INITIAL_ORDERS;
    }
  },
  saveOrders(orders: Order[]): void {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  // Custom added or modified Products
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
        return MOCK_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_PRODUCTS;
    }
  },
  saveProducts(products: Product[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  // Current User Session
  getUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : MOCK_USERS[1]; // default customer
    } catch {
      return MOCK_USERS[1];
    }
  },
  saveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }
};
