import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MOCK_CATEGORIES } from '~/mock/data';

export const CategoryShowcase: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-red-700">
          Không Gian Sống
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900">
          Khám Phá Theo Danh Mục Nội Thất
        </h2>
        <div className="w-16 h-0.5 bg-red-700 mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {MOCK_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-4/5 flex flex-col justify-end p-5"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent"></div>
            
            <div className="relative z-10 space-y-1 text-white">
              <h3 className="font-serif-heading font-bold text-lg leading-tight group-hover:text-amber-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-stone-300 font-light">{cat.itemCount}+ Sản phẩm</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Xem ngay <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
