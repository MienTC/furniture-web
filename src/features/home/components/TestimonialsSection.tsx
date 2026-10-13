import React from 'react';
import { StarFilled, CheckCircleOutlined } from '@ant-design/icons';
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
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="size-10 rounded-full bg-stone-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-stone-200 rounded w-20" />
                  <div className="h-2.5 bg-stone-100 rounded w-16" />
                </div>
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
        <span className="text-xs font-bold uppercase tracking-widest text-[#DE7272]">
          Khách Hàng Nói Về LuxDecor
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
          Trải Nghiệm Từ Những Không Gian Sống Thực Tế
        </h2>
        <div className="w-16 h-0.5 bg-[#DE7272] mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-lg transition-all duration-300 relative group"
          >
            <div className="text-3xl text-stone-200 group-hover:text-[#FFF6A9] font-serif transition-colors absolute top-4 right-4 leading-none select-none">
              “
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-1 text-[#FFCA88]">
                {[...Array(r.rating || 5)].map((_, idx) => (
                  <StarFilled key={idx} style={{ fontSize: 14, color: '#FFCA88' }} />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                "{r.content}"
              </p>
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] font-medium text-[#DE7272] flex items-center gap-1">
                  <CheckCircleOutlined className="text-[#B4E4D6]" style={{ fontSize: 12 }} /> Đã mua: {r.product}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 mt-4 border-t border-stone-100">
              <div className="w-10 h-10 rounded-full bg-[#B4E4D6]/30 text-[#DE7272] font-bold text-sm flex items-center justify-center border border-[#B4E4D6]">
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">{r.name}</h4>
                <p className="text-[10px] text-stone-400">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
