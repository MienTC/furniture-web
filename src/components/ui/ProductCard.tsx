import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '~/types';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import { useCart } from '~/contexts/CartContext';
import { useWishlist } from '~/contexts/WishlistContext';
import { RatingStars } from './RatingStars';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Tag, Button } from 'antd';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const liked = isWishlisted(product.id);

  const finalPrice = product.discountPercent
    ? calculateDiscountPrice(product.price, product.discountPercent)
    : product.price;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-transparent hover:border-amber-100">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Overlay gradient for a premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {product.discountPercent && (
            <span className="bg-amber-900 text-white font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-stone-900 text-amber-100 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider shadow-sm">
              MỚI
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
            liked
              ? 'bg-amber-900 text-white shadow-md'
              : 'bg-white/80 backdrop-blur-md text-stone-600 hover:text-amber-900 hover:bg-white shadow-sm'
          }`}
          title="Yêu thích"
        >
          <Heart size={16} className={liked ? 'fill-current' : ''} />
        </button>

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-x-0 bottom-4 px-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex gap-3 justify-center z-10">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 bg-white hover:bg-stone-50 text-stone-900 font-semibold text-xs py-3 px-4 rounded flex items-center justify-center gap-2 shadow-lg transition-all uppercase tracking-wider"
          >
            <Eye size={14} /> Chi tiết
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-semibold text-xs py-3 px-4 rounded flex items-center justify-center gap-2 shadow-lg transition-all uppercase tracking-wider"
          >
            <ShoppingBag size={14} /> Mua ngay
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
          className="font-bold text-stone-900 hover:text-amber-800 transition-colors line-clamp-2 text-base leading-snug mb-3 px-2"
        >
          {product.name}
        </Link>
        
        <RatingStars rating={product.rating} count={product.reviewCount} />

        <div className="mt-auto pt-4 flex flex-col items-center gap-1">
          <span className="text-lg font-bold text-amber-900 tabular-nums">
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
