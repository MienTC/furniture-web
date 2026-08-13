import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Voucher } from '~/types';
import { storageService } from '~/services/storageService';
import { orderService } from '~/services/orderService';
import { message } from 'antd';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  voucherCode: string;
  appliedVoucher: Voucher | null;
  discountAmount: number;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  shippingFee: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedColor) updated[existingIndex].selectedColor = selectedColor;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: selectedColor || product.colorOptions[0] }];
      }
    });
    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    message.info('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setVoucherCode('');
    setAppliedVoucher(null);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const applyVoucher = (code: string): boolean => {
    const res = orderService.validateVoucher(code, subtotal);
    if (!res.valid || !res.voucher) {
      message.error(res.error || 'Mã không hợp lệ');
      return false;
    }
    setVoucherCode(code);
    setAppliedVoucher(res.voucher);
    message.success(`Áp dụng mã ${code} thành công!`);
    return true;
  };

  const removeVoucher = () => {
    setVoucherCode('');
    setAppliedVoucher(null);
    message.info('Đã bỏ áp dụng mã giảm giá');
  };

  const discountAmount = appliedVoucher ? orderService.calculateDiscount(appliedVoucher, subtotal) : 0;
  const shippingFee = subtotal >= 15000000 || subtotal === 0 ? 0 : 300000;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        voucherCode,
        appliedVoucher,
        discountAmount,
        applyVoucher,
        removeVoucher,
        shippingFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
