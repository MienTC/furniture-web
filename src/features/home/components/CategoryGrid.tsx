import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import type { Category } from '~/types';

interface Props { categories: Category[]; isLoading: boolean; }

export const CategoryGrid: React.FC<Props> = ({ categories, isLoading }) => {
  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">Không Gian Sống</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Khám Phá Theo Danh Mục Nội Thất</h2>
        <div className="w-12 h-0.5 bg-brand-coral mx-auto mt-2 rounded-full" />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="aspect-4/5 rounded-2xl bg-stone-200 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {rootCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 aspect-4/5 flex flex-col justify-end p-4 sm:p-5 border border-stone-200 hover:border-brand-coral/40"
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent" />
              <div className="relative z-10 space-y-1 text-white">
                <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-brand-coral transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 font-normal">{cat.itemCount || 0}+ Sản phẩm</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Xem ngay <RightOutlined style={{ fontSize: 10 }} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
