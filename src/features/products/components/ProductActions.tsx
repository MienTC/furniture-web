import React from 'react';
import { ShoppingBag, Heart, Plus, Minus } from 'lucide-react';
import type { Product } from '~/types';

interface Props {
  product: Product; quantity: number; liked: boolean;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void; onBuyNow: () => void; onToggleWishlist: () => void;
}

export const ProductActions: React.FC<Props> = ({ product, quantity, liked, onQuantityChange, onAddToCart, onBuyNow, onToggleWishlist }) => (
  <div className="space-y-4 pt-2">
    <div className="flex items-center gap-4">
      <span className="text-xs font-bold text-stone-800">Số lượng:</span>
      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
        <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"><Minus size={14} /></button>
        <span className="px-4 font-bold text-xs text-stone-900">{quantity}</span>
        <button onClick={() => onQuantityChange(Math.min(product.stockQuantity, quantity + 1))} className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"><Plus size={14} /></button>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <button onClick={onAddToCart} className="flex-1 bg-amber-950 hover:bg-amber-900 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm">
        <ShoppingBag size={18} /> Thêm Vào Giỏ
      </button>
      <button onClick={onBuyNow} className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm">
        Mua Ngay
      </button>
      <button onClick={onToggleWishlist} className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${liked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-stone-300 text-stone-600 hover:bg-stone-100'}`}>
        <Heart size={20} className={liked ? 'fill-current' : ''} />
      </button>
    </div>
  </div>
);
