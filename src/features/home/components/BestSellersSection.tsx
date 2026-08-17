import React from 'react';
import { Product } from '~/types';
import { ProductCard } from '~/components/ui/ProductCard';

interface BestSellersSectionProps {
  products: Product[];
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ products }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-red-700">
          Lựa Chọn Hàng Đầu
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900">
          Sản Phẩm Bán Chạy Nhất
        </h2>
        <div className="w-16 h-0.5 bg-red-700 mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
