import React from "react";
import { Check, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { RatingStars } from "~/components/ui/RatingStars";
import { formatVND, calculateDiscountPrice } from "~/common/utils/formatters";
import type { Product, ProductVariant } from "~/types";

interface Props {
  product: Product;
  activeColor: string;
  onSelectColor: (c: string) => void;
  selectedVariant?: ProductVariant | null;
  onSelectVariant?: (v: ProductVariant) => void;
}

export const ProductInfo: React.FC<Props> = ({
  product,
  activeColor,
  onSelectColor,
  selectedVariant,
  onSelectVariant,
}) => {
  const variants = product.variants || [];

  // Group unique sizes and materials from variants
  const availableSizes = [
    ...new Set(variants.map((v) => v.size).filter(Boolean)),
  ];
  const availableMaterials = [
    ...new Set(variants.map((v) => v.material).filter(Boolean)),
  ];

  // Base price calculation or variant price
  const activeSalePrice = selectedVariant
    ? selectedVariant.sale_price
    : product.discountPercent
    ? calculateDiscountPrice(product.price, product.discountPercent)
    : product.price;

  const activeOriginalPrice = selectedVariant
    ? selectedVariant.list_price
    : product.originalPrice || product.price;

  const discountPercent =
    activeOriginalPrice && activeOriginalPrice > activeSalePrice
      ? Math.round(
          ((activeOriginalPrice - activeSalePrice) / activeOriginalPrice) * 100
        )
      : product.discountPercent;

  return (
    <div className="space-y-6">
      {/* Category & Origin */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
            {product.categoryName}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500 font-medium">
            Xuất xứ: {product.origin || "LuxDecor"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <RatingStars
            rating={product.rating}
            count={product.reviewCount}
            size={16}
          />
          <span className="text-stone-300">|</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <Check size={14} /> Còn {product.stockQuantity || 100} sản phẩm
          </span>
        </div>
      </div>

      {/* Dynamic Price Box */}
      <div className="p-5 rounded-2xl bg-amber-950/5 border border-amber-900/10 flex items-baseline gap-4">
        <span className="text-3xl font-bold text-amber-950 tabular-nums">
          {formatVND(activeSalePrice)}
        </span>
        {activeOriginalPrice && activeOriginalPrice > activeSalePrice && (
          <span className="text-base text-stone-400 line-through">
            {formatVND(activeOriginalPrice)}
          </span>
        )}
        {discountPercent && discountPercent > 0 ? (
          <span className="text-xs font-bold bg-amber-900 text-white px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </span>
        ) : null}
      </div>

      {/* Variant Selector: Sizes (e.g. 1M3, 1M6, 1M9 or 132cm...) */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>
              Kích thước:{" "}
              <strong className="text-amber-900">
                {selectedVariant?.size || availableSizes[0]}
              </strong>
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const matchingVar = variants.find((v) => v.size === size);
              const isSelected = selectedVariant?.size === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => matchingVar && onSelectVariant?.(matchingVar)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-0.5 ${
                    isSelected
                      ? "bg-amber-950 text-white border-amber-950 shadow-sm"
                      : "bg-white text-stone-700 border-stone-200 hover:border-amber-800 hover:text-amber-900"
                  }`}
                >
                  <span>{size}</span>
                  {matchingVar && (
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? "text-amber-200" : "text-stone-400"
                      }`}
                    >
                      {formatVND(matchingVar.sale_price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Variant Selector: Material / Dem options */}
      {availableMaterials.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 block">
            Chất liệu đệm / vỏ bọc:{" "}
            <span className="text-amber-900">
              {selectedVariant?.material || availableMaterials[0]}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableMaterials.map((mat) => {
              const currentSize = selectedVariant?.size || availableSizes[0];
              const matchingVar =
                variants.find(
                  (v) => v.material === mat && (!currentSize || v.size === currentSize)
                ) || variants.find((v) => v.material === mat);

              const isSelected = selectedVariant?.material === mat;
              return (
                <button
                  key={mat}
                  type="button"
                  onClick={() => matchingVar && onSelectVariant?.(matchingVar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-amber-950 text-white border-amber-950 font-bold shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {mat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color options */}
      {product.colorOptions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 block">
            Màu sắc: <span className="text-amber-900">{activeColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(color)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeColor === color
                    ? "bg-amber-950 text-white border-amber-950 font-bold"
                    : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Highlights & specs preview */}
      <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-stone-100/70 border border-stone-200">
        <div>
          <span className="text-stone-400 block text-[11px]">Kích thước:</span>
          <span className="font-semibold text-stone-800">
            {selectedVariant?.size || product.dimensions || "Như hình"}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block text-[11px]">Chất liệu:</span>
          <span className="font-semibold text-stone-800 line-clamp-1">
            {selectedVariant?.material || product.material || "Cao cấp"}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block text-[11px]">Bảo hành:</span>
          <span className="font-semibold text-amber-900 flex items-center gap-1">
            <ShieldCheck size={13} /> {product.warranty || "Bảo hành 5 năm"}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block text-[11px]">Vận chuyển:</span>
          <span className="font-semibold text-stone-800 flex items-center gap-1">
            <Truck size={13} /> Lắp đặt tận nơi
          </span>
        </div>
      </div>
    </div>
  );
};
