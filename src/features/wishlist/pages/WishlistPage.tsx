import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '~/contexts/WishlistContext';
import { productService } from '~/services/productService';
import { ProductCard } from '~/components/ui/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const allProducts = productService.getProducts();
  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900">
          Danh Sách Sản Phẩm Yêu Thích
        </h1>
        <p className="text-xs text-stone-500">Đang có {wishlistedProducts.length} món đồ nội thất được bạn lưu trữ</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
            <Heart size={32} />
          </div>
          <h3 className="font-bold text-stone-800 text-lg">Chưa có sản phẩm nào trong danh sách yêu thích</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Nhấn vào biểu tượng trái tim ở bất kỳ sản phẩm nào để lưu lại xem sau.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md"
          >
            Khám Phá Cửa Hàng <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
