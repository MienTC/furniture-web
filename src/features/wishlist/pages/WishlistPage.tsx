import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '~/contexts/WishlistContext';
import { ProductCard } from '~/components/ui/ProductCard';
import { Heart, ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '~/features/products/hooks/useProduct';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const { products: allProducts, isProductsLoading } = useProducts();
  const products = allProducts.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Sản Phẩm Yêu Thích</h1>
        <p className="text-xs text-stone-500">Đang có {products.length} sản phẩm được lưu</p>
      </div>
      {isProductsLoading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-stone-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="animate-spin text-amber-900" size={32} />
          <p className="text-sm text-stone-500">Đang tải danh sách yêu thích...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400"><Heart size={32} /></div>
          <h3 className="font-bold text-stone-800 text-lg">Chưa có sản phẩm yêu thích</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">Nhấn vào biểu tượng trái tim để lưu sản phẩm lại xem sau.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-amber-950 hover:bg-amber-900 text-white font-bold px-6 py-3 rounded-full text-xs transition-all">
            Khám Phá Cửa Hàng <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};
