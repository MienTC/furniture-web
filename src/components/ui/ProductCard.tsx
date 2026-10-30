import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '~/types';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import { useCart } from '~/contexts/CartContext';
import { useWishlist } from '~/contexts/WishlistContext';
import { RatingStars } from './RatingStars';
import { HeartOutlined, HeartFilled, ShoppingOutlined, EyeOutlined } from '@ant-design/icons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const liked = isWishlisted(product.id);

  const finalPrice = product.discountPercent
    ? calculateDiscountPrice(product.price, product.discountPercent)
    : product.price;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    navigate(`/products/${product.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="product-card-container group relative bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-stone-200 hover:border-brand-coral/40 cursor-pointer"
    >
      {/* Tỷ lệ vuông 1:1 giúp ảnh nội thất gọn gàng, không bị kéo cao chiếm diện tích */}
      <div className="relative w-full aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image-zoom w-full h-full object-cover transition-transform duration-500 ease-out"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPercent && (
            <span className="bg-brand-coral text-white font-extrabold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#E8A87C] text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-xs">
              MỚI
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer ${
            liked
              ? 'bg-brand-coral text-white shadow-md'
              : 'bg-white/95 text-stone-600 hover:text-brand-coral hover:bg-white shadow-xs'
          }`}
          title="Yêu thích"
        >
          {liked ? <HeartFilled style={{ fontSize: 13 }} /> : <HeartOutlined style={{ fontSize: 13 }} />}
        </button>

        {/* Action Overlay */}
        <div className="product-card-actions absolute inset-x-0 bottom-2.5 px-2.5 flex gap-1.5 justify-center z-30 pointer-events-auto">
          <Link
            to={`/products/${product.slug}`}
            className="action-btn-detail flex-1 text-[11px] py-2 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <EyeOutlined className="shrink-0 pointer-events-none" style={{ fontSize: 13 }} />
            <span className="pointer-events-none">Chi tiết</span>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              navigate('/checkout');
            }}
            className="action-btn-buy flex-1 text-[11px] py-2 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ShoppingOutlined className="shrink-0 pointer-events-none" style={{ fontSize: 13 }} />
            <span className="pointer-events-none">Mua ngay</span>
          </button>
        </div>
      </div>

      {/* Content: Padding gọn gàng, tinh gọn chiều cao */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col items-start text-left">
        <span className="text-[11px] font-semibold text-stone-500 tracking-wider uppercase mb-1 block">
          {product.categoryName}
        </span>
        <h3 className="font-bold text-[#2D2623] hover:text-brand-coral transition-colors line-clamp-1 text-xs sm:text-sm leading-snug mb-1.5">
          <Link to={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <div className="mb-2">
          <RatingStars rating={product.rating} count={product.reviewCount} size={13} />
        </div>

        <div className="mt-auto pt-1.5 flex items-baseline gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-black text-brand-coral tabular-nums">
            {formatVND(finalPrice)}
          </span>
          {product.discountPercent && (
            <span className="text-[11px] text-stone-400 line-through font-medium">
              {formatVND(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
