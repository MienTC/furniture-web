import React from 'react';
import { Check } from 'lucide-react';
import { RatingStars } from '~/components/ui/RatingStars';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import type { Product } from '~/types';

interface Props { product: Product; activeColor: string; onSelectColor: (c: string) => void; }

export const ProductInfo: React.FC<Props> = ({ product, activeColor, onSelectColor }) => {
  const finalPrice = product.discountPercent ? calculateDiscountPrice(product.price, product.discountPercent) : product.price;
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">{product.categoryName}</span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500">Xuất xứ: {product.origin}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">{product.name}</h1>
        <div className="flex items-center gap-4 mt-3">
          <RatingStars rating={product.rating} count={product.reviewCount} size={16} />
          <span className="text-stone-300">|</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><Check size={14} /> Còn {product.stockQuantity} sản phẩm</span>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-amber-950/5 border border-amber-900/10 flex items-baseline gap-4">
        <span className="text-3xl font-bold text-amber-950">{formatVND(finalPrice)}</span>
        {product.discountPercent && <span className="text-base text-stone-400 line-through">{formatVND(product.price)}</span>}
      </div>
      {product.colorOptions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 block">Tùy chọn: <span className="text-amber-900">{activeColor}</span></label>
          <div className="flex flex-wrap gap-2">
            {product.colorOptions.map(color => (
              <button key={color} onClick={() => onSelectColor(color)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeColor === color ? 'bg-amber-950 text-white border-amber-950 font-bold' : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'}`}>
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-stone-100/70 border border-stone-200">
        <div><span className="text-stone-400 block">Kích thước:</span><span className="font-semibold text-stone-800">{product.dimensions}</span></div>
        <div><span className="text-stone-400 block">Chất liệu:</span><span className="font-semibold text-stone-800">{product.material}</span></div>
        <div><span className="text-stone-400 block">Bảo hành:</span><span className="font-semibold text-amber-900">{product.warranty}</span></div>
        <div><span className="text-stone-400 block">Vận chuyển:</span><span className="font-semibold text-stone-800">Lắp đặt miễn phí</span></div>
      </div>
    </div>
  );
};
