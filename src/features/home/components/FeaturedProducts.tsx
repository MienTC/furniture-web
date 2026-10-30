import React from 'react';
import { Link } from 'react-router-dom';
import { FireOutlined, RightOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import { ProductCard } from '~/components/ui/ProductCard';
import type { Product } from '~/types';

interface Props { products: Product[]; totalCount: number; isLoading: boolean; }

export const FeaturedProducts: React.FC<Props> = ({ products, totalCount, isLoading }) => (
  <section className="max-w-7xl mx-auto px-4 space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-stone-200/80 pb-4 gap-4">
      <div>
        <div className="flex items-center gap-1.5 text-brand-coral font-bold text-xs uppercase tracking-wider mb-1">
          <FireOutlined className="text-brand-coral" style={{ fontSize: 15 }} /> Bộ Sưu Tập Nội Thất
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Sản Phẩm Nổi Bật & Ưu Đãi</h2>
      </div>
      <Link
        to="/products"
        className="text-xs font-bold text-brand-coral hover:text-brand-coral/80 flex items-center gap-1 transition-colors"
      >
        Xem Tất Cả ({totalCount}) <RightOutlined style={{ fontSize: 11 }} />
      </Link>
    </div>
    {isLoading ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} active />)}
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    )}
  </section>
);
