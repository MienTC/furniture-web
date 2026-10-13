import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconFlame, IconClock, IconArrowRight } from '@tabler/icons-react';
import { formatVND } from '~/common/utils/formatters';
import { useFlashSale } from '~/features/home/hooks/useFlashSale';

export const FlashSaleSection: React.FC = () => {
  const { data: flashSale, isLoading } = useFlashSale();

  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Chỉ hiển thị khi Admin BẬT Flash Sale và có sản phẩm được gán
  if (isLoading || !flashSale?.isActive || !flashSale?.products || flashSale.products.length === 0) {
    return null;
  }

  const { config, products } = flashSale;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Phối màu hài hòa theo hệ thống: Nền Gradient Brand Coral (#DE7272) & Peach (#FFCA88) */}
      <div className="rounded-3xl bg-linear-to-r from-[#DE7272] via-[#e58a8a] to-[#FFCA88] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#DE7272]/20">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-[#FFF6A9] animate-pulse">
              <IconFlame size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  {config.title || 'Flash Sale Hôm Nay'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF6A9] text-[#DE7272] font-extrabold text-[11px] tracking-wide uppercase shadow-xs">
                  {config.discount_badge || 'Giảm tới 45%'}
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5 font-medium">
                {config.description || 'Số lượng có hạn trong khung giờ vàng nội thất'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 self-start sm:self-auto">
            <IconClock size={16} className="text-[#FFF6A9]" />
            <span className="text-xs font-semibold uppercase tracking-wider mr-1 text-white">Kết thúc sau:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-xs">
              <span className="bg-black/30 px-2 py-1 rounded-lg text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black/30 px-2 py-1 rounded-lg text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black/30 px-2 py-1 rounded-lg text-[#FFF6A9]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {products.map((p) => {
            const finalPrice = p.discountPercent
              ? Math.round(p.price * (1 - p.discountPercent / 100))
              : p.price;

            return (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group bg-white rounded-2xl p-3.5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Discount Badge */}
                {p.discountPercent ? (
                  <span className="absolute top-5 left-5 z-10 px-2 py-0.5 rounded-md bg-[#DE7272] text-white font-extrabold text-[10px]">
                    -{p.discountPercent}%
                  </span>
                ) : null}

                {/* Product Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
                  <img
                    src={p.images?.[0] || 'https://placehold.co/400x400?text=LuxDecor'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                  <h3 className="font-semibold text-xs sm:text-sm text-stone-800 line-clamp-2 group-hover:text-[#DE7272] transition-colors leading-snug">
                    {p.name}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-bold text-[#DE7272] text-sm sm:text-base">
                      {formatVND(finalPrice)}
                    </span>
                    {p.discountPercent ? (
                      <span className="text-[11px] text-stone-400 line-through">
                        {formatVND(p.price)}
                      </span>
                    ) : null}
                  </div>

                  {/* Stock progress bar */}
                  <div className="space-y-1 pt-1.5">
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#DE7272] h-full rounded-full w-3/4" />
                    </div>
                    <span className="text-[10px] text-stone-400 block text-right font-medium">
                      Còn {p.stockQuantity || 12} cái
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#FFF6A9] transition-colors uppercase tracking-widest bg-black/10 hover:bg-black/20 px-5 py-2.5 rounded-full"
          >
            <span>Xem tất cả ưu đãi Flash Sale</span>
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
