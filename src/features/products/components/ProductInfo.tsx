import React from "react";
import { CheckOutlined, SafetyCertificateOutlined, CarOutlined } from "@ant-design/icons";
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

  // Helper detection:
  // Check if string contains dimension patterns (e.g. "1.5*0.87*0.98m", "2.1x1.5m", "180x200cm", "2.3*0.87*1.7m")
  const isDimension = (str?: string) => {
    if (!str) return false;
    return /[\d]+(\.[\d]+)?\s*[*xX×]\s*[\d]+/.test(str) || /\b\d+(\.\d+)?m\b/i.test(str);
  };

  const hasMaterialDimensions = variants.some((v) => isDimension(v.material));
  const hasSizeDimensions = variants.some((v) => isDimension(v.size));

  // Determine Primary and Secondary Variant logic:
  // When `material` has dimensions (like in sofas with models and sizes):
  // - Primary = `size` (Model/Kiểu dáng: "văng kéo đơn", "văng kéo đôi", "chữ L")
  // - Secondary = `material` (Dimension/Kích thước: "1.5*0.87*0.98m", "2.1*0.87*0.98m"...)
  //
  // When `size` has dimensions:
  // - Primary = `size` (Dimension/Kích thước: "1m6 x 2m"...)
  // - Secondary = `material` (Chất liệu đệm / vỏ bọc)
  const isMaterialDimension = hasMaterialDimensions;

  // Primary options
  const primaryOptions = [
    ...new Set(variants.map((v) => v.size).filter(Boolean)),
  ] as string[];

  const currentPrimary = selectedVariant?.size || primaryOptions[0] || "";

  // Secondary options DEPEND on the currently selected Primary option!
  // E.g., when "văng kéo đôi" is chosen, ONLY dimensions belonging to "văng kéo đôi" are displayed!
  const availableVariantsForPrimary = variants.filter(
    (v) => !currentPrimary || v.size === currentPrimary
  );

  const secondaryOptions = [
    ...new Set(
      availableVariantsForPrimary
        .map((v) => v.material)
        .filter(Boolean)
    ),
  ] as string[];

  const currentSecondary =
    selectedVariant?.material || secondaryOptions[0] || "";

  // Labels
  const primaryLabel = isMaterialDimension
    ? "Kiểu dáng"
    : hasSizeDimensions
    ? "Kích thước"
    : "Phân loại kiểu dáng";

  const secondaryLabel = isMaterialDimension
    ? "Kích thước"
    : "Chất liệu đệm / vỏ bọc";

  // Select handlers
  const handleSelectPrimary = (val: string) => {
    const matchingVars = variants.filter((v) => v.size === val);
    if (matchingVars.length === 0) return;

    // Try to preserve current secondary selection if available in new group
    const preserved = matchingVars.find((v) => v.material === currentSecondary);
    onSelectVariant?.(preserved || matchingVars[0]);
  };

  const handleSelectSecondary = (val: string) => {
    const match =
      availableVariantsForPrimary.find((v) => v.material === val) ||
      variants.find((v) => v.material === val);
    if (match) {
      onSelectVariant?.(match);
    }
  };

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

  // Dynamic specs preview values
  const displayDimension = isMaterialDimension
    ? selectedVariant?.material || product.dimensions
    : hasSizeDimensions
    ? selectedVariant?.size || product.dimensions
    : product.dimensions;

  const displayStyle = isMaterialDimension
    ? selectedVariant?.size
    : !hasSizeDimensions && selectedVariant?.size
    ? selectedVariant.size
    : undefined;

  const displayMaterial =
    !isMaterialDimension && selectedVariant?.material
      ? selectedVariant.material
      : product.material;

  return (
    <div className="space-y-6">
      {/* Category & Origin */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-brand-coral uppercase tracking-widest">
            {product.categoryName}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500 font-medium">
            Xuất xứ: {product.origin || "LuxDecor"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <RatingStars
            rating={product.rating}
            count={product.reviews ? product.reviews.length : (product.reviewCount || 0)}
            size={16}
          />
          <span className="text-stone-300">|</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckOutlined style={{ fontSize: 13 }} /> Còn {product.stockQuantity || 100} sản phẩm
          </span>
        </div>
      </div>

      {/* Dynamic Price Box */}
      <div className="p-5 rounded-2xl bg-brand-peach/15 border border-brand-peach/30 flex items-baseline gap-4">
        <span className="text-3xl font-bold text-brand-coral tabular-nums">
          {formatVND(activeSalePrice)}
        </span>
        {activeOriginalPrice && activeOriginalPrice > activeSalePrice && (
          <span className="text-base text-stone-400 line-through">
            {formatVND(activeOriginalPrice)}
          </span>
        )}
        {discountPercent && discountPercent > 0 ? (
          <span className="text-xs font-bold bg-brand-coral text-white px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </span>
        ) : null}
      </div>

      {/* Primary Variant Selector (e.g. Kiểu dáng: Văng đơn, Văng đôi, Chữ L) */}
      {primaryOptions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>
              {primaryLabel}:{" "}
              <strong className="text-brand-coral">
                {currentPrimary}
              </strong>
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {primaryOptions.map((opt) => {
              const isSelected = currentPrimary === opt;
              const matchingVars = variants.filter((v) => v.size === opt);
              const minPrice = matchingVars.length > 0
                ? Math.min(...matchingVars.map((v) => v.sale_price))
                : null;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectPrimary(opt)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                    isSelected
                      ? "bg-brand-coral text-white border-brand-coral shadow-sm"
                      : "bg-white text-stone-700 border-stone-200 hover:border-brand-coral hover:text-brand-coral"
                  }`}
                >
                  <span className="capitalize">{opt}</span>
                  {minPrice !== null && (
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? "text-brand-cream" : "text-stone-400"
                      }`}
                    >
                      {formatVND(minPrice)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Secondary Variant Selector (DEPENDENT: Kích thước được lọc theo Kiểu dáng đã chọn) */}
      {secondaryOptions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 block">
            {secondaryLabel}:{" "}
            <span className="text-brand-coral font-bold">
              {currentSecondary}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {secondaryOptions.map((opt) => {
              const isSelected = currentSecondary === opt;
              const matchingVar = availableVariantsForPrimary.find((v) => v.material === opt);

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectSecondary(opt)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-brand-coral text-white border-brand-coral font-bold shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:border-brand-coral hover:text-brand-coral"
                  }`}
                >
                  <span>{opt}</span>
                  {matchingVar && matchingVar.sale_price !== activeSalePrice && isSelected && (
                    <span className="text-[10px] text-brand-cream font-mono">
                      ({formatVND(matchingVar.sale_price)})
                    </span>
                  )}
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
            Màu sắc: <span className="text-brand-coral font-bold">{activeColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(color)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  activeColor === color
                    ? "bg-brand-coral text-white border-brand-coral font-bold"
                    : "bg-white text-stone-700 border-stone-300 hover:border-brand-coral hover:text-brand-coral"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Highlights & specs preview */}
      <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-[#F4F6F5] border border-[#E5EAE7]">
        <div>
          <span className="text-stone-400 block text-[11px]">Kích thước:</span>
          <span className="font-semibold text-stone-800">
            {displayDimension || "Tiêu chuẩn"}
          </span>
        </div>
        {displayStyle && (
          <div>
            <span className="text-stone-400 block text-[11px]">Kiểu dáng:</span>
            <span className="font-semibold text-brand-coral">
              {displayStyle}
            </span>
          </div>
        )}
        <div>
          <span className="text-stone-400 block text-[11px]">Chất liệu:</span>
          <span className="font-semibold text-stone-800 line-clamp-1">
            {displayMaterial || "Cao cấp"}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block text-[11px]">Bảo hành:</span>
          <span className="font-semibold text-brand-coral flex items-center gap-1">
            <SafetyCertificateOutlined style={{ fontSize: 13 }} /> {product.warranty || "Bảo hành 5 năm"}
          </span>
        </div>
        <div className={displayStyle ? "col-span-2" : "col-span-2 sm:col-span-1"}>
          <span className="text-stone-400 block text-[11px]">Vận chuyển:</span>
          <span className="font-semibold text-stone-800 flex items-center gap-1">
            <CarOutlined style={{ fontSize: 13 }} /> Miễn phí & lắp đặt toàn quốc
          </span>
        </div>
      </div>
    </div>
  );
};
