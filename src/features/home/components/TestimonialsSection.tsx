import React from 'react';
import { Link } from 'react-router-dom';
import { StarFilled, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useFeaturedReviews } from '~/features/home/hooks/useFeaturedReviews';

export const TestimonialsSection: React.FC = () => {
  const { data: reviews, isLoading } = useFeaturedReviews();

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 space-y-8 animate-pulse">
        <div className="text-center space-y-2">
          <div className="h-3 bg-stone-200 rounded w-32 mx-auto" />
          <div className="h-6 bg-stone-200 rounded w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4">
              <div className="h-4 bg-stone-200 rounded w-24" />
              <div className="space-y-2">
                <div className="h-3 bg-stone-100 rounded w-full" />
                <div className="h-3 bg-stone-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">
          Khách Hàng Nói Về LuxDecor
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2623] tracking-tight">
          Trải Nghiệm Từ Những Không Gian Sống Thực Tế
        </h2>
        <div className="w-16 h-0.5 bg-brand-coral mx-auto mt-2 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => {
          const productTarget = r.productSlug
            ? `/products/${r.productSlug}`
            : r.productId
            ? `/products/${r.productId}`
            : '/products';

          return (
            <Link
              key={r.id}
              to={productTarget}
              title={`Xem sản phẩm: ${r.product || 'Chi tiết'}`}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#E5EAE7] shadow-2xs hover:border-[#2B5A50] hover:shadow-xl transition-all duration-300 relative group cursor-pointer text-inherit block no-underline"
            >
              <div className="text-3xl text-stone-200 group-hover:text-brand-coral/20 transition-colors absolute top-4 right-4 leading-none select-none">
                “
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-1 text-[#C88A58]">
                  {[...Array(r.rating || 5)].map((_, idx) => (
                    <StarFilled key={idx} style={{ fontSize: 14, color: '#C88A58' }} />
                  ))}
                </div>
                <p className="text-xs text-[#4A5550] leading-relaxed group-hover:text-[#1A2421] transition-colors">
                  "{r.content}"
                </p>
                {r.product && (
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-brand-coral">
                    <span className="text-[11px] font-semibold flex items-center gap-1.5 truncate max-w-[85%]">
                      <CheckCircleOutlined className="text-[#2B5A50] shrink-0" style={{ fontSize: 12 }} />
                      <span className="truncate">Đã mua: {r.product}</span>
                    </span>
                    <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 text-[#C88A58]">
                      <span>Xem</span>
                      <ArrowRightOutlined style={{ fontSize: 10 }} />
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 mt-3 border-t border-stone-100">
                {r.avatar ? (
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D0DBD6] group-hover:border-[#2B5A50] transition-colors"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EDF5F2] text-brand-coral font-bold text-sm flex items-center justify-center border border-[#D0DBD6]">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-[#2D2623]">{r.name}</h4>
                  <p className="text-[10px] text-stone-400 font-medium">{r.role || 'Khách hàng xác thực'}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
