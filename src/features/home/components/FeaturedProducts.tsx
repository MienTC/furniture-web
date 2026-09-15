import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import { Skeleton } from 'antd';
import { ProductCard } from '~/components/ui/ProductCard';
import type { Product } from '~/types';

interface Props { products: Product[]; totalCount: number; isLoading: boolean; }

export const FeaturedProducts: React.FC<Props> = ({ products, totalCount, isLoading }) => (
  <section className="max-w-7xl mx-auto px-4 space-y-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-stone-200 pb-4 gap-4">
      <div>
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Flame size={16} className="text-rose-500 animate-bounce" /> Flash Sale Nội Thất Tuần Này
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Sản Phẩm Nổi Bật & Ưu Đãi</h2>
      </div>
      <Link to="/products" className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1">
        Xem Tất Cả ({totalCount}) <ArrowRight size={14} />
      </Link>
    </div>
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i => <Skeleton key={i} active />)}</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 6).map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    )}
  </section>
);
