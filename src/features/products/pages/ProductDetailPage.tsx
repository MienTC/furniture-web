import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '~/contexts/CartContext';
import { useWishlist } from '~/contexts/WishlistContext';
import { ProductGallery } from '~/features/products/components/ProductGallery';
import { ProductInfo } from '~/features/products/components/ProductInfo';
import { ProductActions } from '~/features/products/components/ProductActions';
import { ProductTabs } from '~/features/products/components/ProductTabs';
import { ProductCard } from '~/components/ui/ProductCard';
import { formatVND } from '~/common/utils/formatters';
import { useProductDetail, useProducts } from '../hooks/useProduct';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const { product, isProductLoading } = useProductDetail(slug ?? '');
  const { products: relatedProducts } = useProducts(
    product ? { categoryId: product.categoryId, limit: 5 } : undefined
  );

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<import('~/types').ProductVariant | null>(null);
  const [quantity, setQuantity]           = useState(1);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [slug, product]);

  if (isProductLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="aspect-square bg-stone-200 rounded-2xl w-full" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="size-20 bg-stone-200 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-5 bg-stone-200 rounded w-1/3" />
            <div className="h-10 bg-stone-200 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-stone-100 rounded w-full" />
              <div className="h-4 bg-stone-100 rounded w-5/6" />
              <div className="h-4 bg-stone-100 rounded w-4/6" />
            </div>
            <div className="h-12 bg-stone-200 rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="inline-block bg-[#2B5A50] hover:bg-[#20453D] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const activeImage = selectedImage || product.images[0];
  const activeColor = selectedColor || product.colorOptions?.[0] || 'Tiêu chuẩn';
  const liked       = isWishlisted(product.id);
  const related     = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  const finalPrice = selectedVariant?.sale_price || (product.discountPercent ? Math.round(product.price * (1 - product.discountPercent / 100)) : product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 pb-20 lg:pb-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
        <Link to="/" className="hover:text-brand-coral transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-coral transition-colors">Sản phẩm</Link>
        <span>/</span>
        <Link to={`/products?category=${product.categoryId}`} className="hover:text-brand-coral transition-colors font-medium">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductGallery product={product} activeImage={activeImage} onSelect={setSelectedImage} />
        <div className="space-y-6">
          <ProductInfo
            product={product}
            activeColor={activeColor}
            onSelectColor={setSelectedColor}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
          />
          <ProductActions
            product={product} quantity={quantity} liked={liked}
            onQuantityChange={setQuantity}
            onAddToCart={() => addToCart(product, quantity, activeColor, selectedVariant || undefined, selectedVariant?.sale_price)}
            onBuyNow={() => {
              addToCart(product, quantity, activeColor, selectedVariant || undefined, selectedVariant?.sale_price);
              navigate('/checkout');
            }}
            onToggleWishlist={() => toggleWishlist(product.id)}
          />
        </div>
      </div>
      <ProductTabs product={product} />
      {related.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-stone-900">Sản Phẩm Cùng Danh Mục</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 flex items-center justify-between gap-3 lg:hidden shadow-2xl">
        <div className="min-w-0">
          <p className="text-xs font-bold text-stone-900 truncate">{product.name}</p>
          <p className="text-base font-black text-brand-coral tabular-nums">
            {formatVND(finalPrice)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => addToCart(product, 1, activeColor, selectedVariant || undefined, selectedVariant?.sale_price)}
            className="px-3.5 py-2 rounded-xl border border-brand-coral text-brand-coral font-bold text-xs bg-brand-peach/10 cursor-pointer"
          >
            Thêm giỏ
          </button>
          <button
            type="button"
            onClick={() => {
              addToCart(product, 1, activeColor, selectedVariant || undefined, selectedVariant?.sale_price);
              navigate('/checkout');
            }}
            className="px-4 py-2 rounded-xl bg-[#2B5A50] text-white font-bold text-xs shadow-sm hover:bg-[#20453D] cursor-pointer"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};
