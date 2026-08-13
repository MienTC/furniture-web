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
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.discountPercent && (
            <Tag color="error" className="font-bold border-none px-2.5 py-0.5 rounded-full text-xs shadow-sm">
              -{product.discountPercent}%
            </Tag>
          )}
          {product.isNew && (
            <Tag color="gold" className="font-bold border-none px-2.5 py-0.5 rounded-full text-xs shadow-sm">
              MỚI
            </Tag>
          )}
          {product.isBestSeller && (
            <Tag color="volcano" className="font-bold border-none px-2.5 py-0.5 rounded-full text-xs shadow-sm">
              HOT BÁN CHẠY
            </Tag>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            liked
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/90 text-stone-600 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
          title="Yêu thích"
        >
          <Heart size={18} className={liked ? 'fill-current' : ''} />
        </button>

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-center">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 bg-white/90 hover:bg-white text-stone-800 font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md backdrop-blur-sm transition-all"
          >
            <Eye size={14} /> Chi tiết
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-amber-900 hover:bg-amber-800 text-white font-medium text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <ShoppingBag size={14} /> Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-amber-800 tracking-wide uppercase mb-1 block">
            {product.categoryName}
          </span>
          <Link
            to={`/products/${product.slug}`}
            className="font-medium text-stone-900 hover:text-amber-800 transition-colors line-clamp-2 text-sm leading-snug mb-2"
          >
            {product.name}
          </Link>

          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        {/* Material & Price Footer */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-bold text-amber-950">
              {formatVND(finalPrice)}
            </span>
            {product.discountPercent && (
              <span className="text-xs text-stone-400 line-through">
                {formatVND(product.price)}
              </span>
            )}
          </div>

          <Button
            type="primary"
            size="small"
            icon={<ShoppingBag size={14} />}
            onClick={() => addToCart(product)}
            className="!rounded-lg text-xs"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
