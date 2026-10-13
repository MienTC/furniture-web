import React from "react";
import { ShoppingOutlined, HeartOutlined, HeartFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import type { Product } from "~/types";

interface Props {
  product: Product;
  quantity: number;
  liked: boolean;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
}

export const ProductActions: React.FC<Props> = ({
  product,
  quantity,
  liked,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}) => (
  <div className="space-y-4 pt-2">
    <div className="flex items-center gap-4">
      <span className="text-xs font-bold text-stone-800">Số lượng:</span>
      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
        >
          <MinusOutlined style={{ fontSize: 13 }} />
        </button>
        <span className="px-4 font-bold text-xs text-stone-900">
          {quantity}
        </span>
        <button
          onClick={() =>
            onQuantityChange(Math.min(product.stockQuantity, quantity + 1))
          }
          className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
        >
          <PlusOutlined style={{ fontSize: 13 }} />
        </button>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full bg-white hover:bg-brand-peach/20 text-stone-900 border-2 border-brand-coral font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all text-sm cursor-pointer"
        >
          <ShoppingOutlined className="text-brand-coral" style={{ fontSize: 18 }} /> Thêm Vào Giỏ
        </button>
      </div>
      <div className="flex-1">
        <button
          type="button"
          onClick={onBuyNow}
          className="w-full bg-brand-coral hover:bg-[#c95f5f] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm cursor-pointer"
        >
          Mua Ngay
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={onToggleWishlist}
          className={`h-full px-4 py-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${liked ? "bg-brand-coral text-white border-brand-coral" : "border-stone-300 text-stone-600 hover:text-brand-coral hover:bg-stone-50"}`}
        >
          {liked ? <HeartFilled style={{ fontSize: 18 }} /> : <HeartOutlined style={{ fontSize: 18 }} />}
        </button>
      </div>
    </div>
  </div>
);
