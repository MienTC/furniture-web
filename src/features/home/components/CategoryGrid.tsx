import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '~/types';

interface Props {
  categories: Category[];
  isLoading: boolean;
}

export const CategoryGrid: React.FC<Props> = ({ categories, isLoading }) => {
  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">
          Không Gian Sống
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2421] tracking-tight">
          Khám Phá Theo Danh Mục Nội Thất
        </h2>
        <div className="w-14 h-0.5 bg-brand-coral mx-auto mt-2 rounded-full" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-3 animate-pulse">
              <div className="aspect-square rounded-xl bg-stone-100" />
              <div className="h-4 bg-stone-200 rounded w-2/3 mx-auto" />
              <div className="h-3 bg-stone-100 rounded w-1/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {rootCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5EAE7] hover:border-brand-coral/50 hover:shadow-xl transition-all duration-300 flex flex-col p-3.5 cursor-pointer text-inherit block no-underline"
            >
              {/* Khung ảnh danh mục tỷ lệ vuông 1:1, sắc nét, không bị tối mờ */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#F4F6F5] mb-3 relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out block"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 font-bold text-xs uppercase">
                    {cat.name.slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Tên danh mục và số lượng sản phẩm rõ nét 100% trên nền trắng sáng */}
              <div className="space-y-1 text-center pb-0.5">
                <h3 className="font-bold text-sm sm:text-base !text-[#1A2421] group-hover:!text-brand-coral transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {cat.itemCount || 0}+ Sản phẩm
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
