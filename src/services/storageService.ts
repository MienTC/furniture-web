import { CartItem, User } from '~/types';

const CART_KEY = 'luxdecor_cart';
const WISHLIST_KEY = 'luxdecor_wishlist';
const USER_KEY = 'luxdecor_user';

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

  // Auth User
  getUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },
};
