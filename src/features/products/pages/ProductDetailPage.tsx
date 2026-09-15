import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '~/services/productService';
import { useCart } from '~/contexts/CartContext';
import { useWishlist } from '~/contexts/WishlistContext';
import { ProductGallery } from '~/features/products/components/ProductGallery';
import { ProductInfo } from '~/features/products/components/ProductInfo';
import { ProductActions } from '~/features/products/components/ProductActions';
import { ProductTabs } from '~/features/products/components/ProductTabs';
import { ProductCard } from '~/components/ui/ProductCard';
import { ArrowLeft } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const product = productService.getProductBySlug(slug ?? '');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity]           = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="inline-block bg-amber-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const activeImage = selectedImage || product.images[0];
  const activeColor = selectedColor || product.colorOptions[0];
  const liked       = isWishlisted(product.id);
  const related     = productService.getProducts({ categoryId: product.categoryId }).filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-amber-900">
        <ArrowLeft size={16} /> Quay lại danh sách sản phẩm
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductGallery product={product} activeImage={activeImage} onSelect={setSelectedImage} />
        <div className="space-y-6">
          <ProductInfo product={product} activeColor={activeColor} onSelectColor={setSelectedColor} />
          <ProductActions
            product={product} quantity={quantity} liked={liked}
            onQuantityChange={setQuantity}
            onAddToCart={() => addToCart(product, quantity, activeColor)}
            onBuyNow={() => { addToCart(product, quantity, activeColor); navigate('/checkout'); }}
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
    </div>
  );
};
