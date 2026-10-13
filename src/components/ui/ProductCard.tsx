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
      className="product-card-container group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-stone-200 hover:border-brand-peach cursor-pointer"
    >
      {/* Full hover hit area */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image-zoom w-full h-full object-cover transition-transform duration-500 ease-out"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.discountPercent && (
            <span className="bg-brand-coral text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-brand-mint text-stone-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-xs">
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
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 cursor-pointer ${
            liked
              ? 'bg-brand-coral text-white shadow-md'
              : 'bg-white/95 text-stone-600 hover:text-brand-coral hover:bg-white shadow-xs'
          }`}
          title="Yêu thích"
        >
          {liked ? <HeartFilled style={{fontSize:15}} /> : <HeartOutlined style={{fontSize:15}} />}
        </button>

        {/* Action Overlay */}
        <div className="product-card-actions absolute inset-x-0 bottom-3 px-3 flex gap-2 justify-center z-30 pointer-events-auto">
          <Link
            to={`/products/${product.slug}`}
            className="action-btn-detail flex-1 text-xs py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider cursor-pointer"
          >
            <EyeOutlined className="shrink-0 pointer-events-none" style={{ fontSize: 15 }} />
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
            className="action-btn-buy flex-1 text-xs py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider cursor-pointer"
          >
            <ShoppingOutlined className="shrink-0 pointer-events-none" style={{ fontSize: 15 }} />
            <span className="pointer-events-none">Mua ngay</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col items-center text-center">
        <span className="text-[10px] font-semibold text-stone-500 tracking-[0.2em] uppercase mb-2 block">
          {product.categoryName}
        </span>
        <Link
          to={`/products/${product.slug}`}
          className="font-bold text-stone-900 hover:!text-brand-coral transition-colors line-clamp-2 text-base leading-snug mb-3 px-2"
        >
          {product.name}
        </Link>
        
        <RatingStars rating={product.rating} count={product.reviewCount} />

        <div className="mt-auto pt-4 flex flex-col items-center gap-1">
          <span className="text-lg font-bold text-brand-coral tabular-nums">
            {formatVND(finalPrice)}
          </span>
          {product.discountPercent && (
            <span className="text-xs text-stone-400 line-through">
              {formatVND(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
