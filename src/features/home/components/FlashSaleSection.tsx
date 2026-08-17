import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { Product } from '~/types';
import { ProductCard } from '~/components/ui/ProductCard';

interface FlashSaleSectionProps {
  products: Product[];
  totalProductsCount: number;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  totalProductsCount,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-stone-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame size={16} className="text-red-600 animate-bounce" /> Flash Sale Nội Thất Tuần Này
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900">
            Sản Phẩm Nổi Bật & Ưu Đãi
          </h2>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-red-700 hover:text-red-600 flex items-center gap-1"
        >
          Xem Tất Cả ({totalProductsCount}) <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
