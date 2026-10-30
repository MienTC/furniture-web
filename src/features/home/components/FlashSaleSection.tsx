import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconFlame, IconClock, IconArrowRight } from '@tabler/icons-react';
import { formatVND } from '~/common/utils/formatters';
import { useFlashSale } from '~/features/home/hooks/useFlashSale';

export const FlashSaleSection: React.FC = () => {
  const { data: flashSale, isLoading } = useFlashSale();

  const calculateTimeLeft = () => {
    if (!flashSale?.config?.end_time) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const diff = new Date(flashSale.config.end_time).getTime() - new Date().getTime();
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale?.config?.end_time]);

  const isExpired = !flashSale?.config?.end_time || new Date(flashSale.config.end_time).getTime() <= Date.now();

  // Chỉ hiển thị khi Admin BẬT Flash Sale, chưa hết hạn, và có sản phẩm được gán
  if (isLoading || !flashSale?.isActive || isExpired || !flashSale?.products || flashSale.products.length === 0) {
    return null;
  }

  const { config, products } = flashSale;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Container phong cách Tone sáng ấm cao cấp, hài hòa với tổng thể website */}
      <div className="rounded-3xl bg-linear-to-br from-[#F7F9F8] via-[#F2F6F4] to-[#EBF2EE] p-6 sm:p-8 text-stone-900 shadow-md relative overflow-hidden border border-[#2B5A50]/20">
        {/* Subtle warm glow background */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#2B5A50]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#C88A58]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2B5A50]/10 border border-[#2B5A50]/25 flex items-center justify-center text-[#2B5A50] shadow-xs">
              <IconFlame size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-stone-900">
                  {config.title}
                </h2>
                {config.discount_badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2B5A50] text-white font-extrabold text-[11px] tracking-wide uppercase shadow-xs">
                    {config.discount_badge}
                  </span>
                )}
              </div>
              {config.description && (
                <p className="text-xs text-stone-500 mt-0.5 font-medium">
                  {config.description}
                </p>
              )}
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2.5 bg-white/90 border border-stone-200/80 px-4 py-2 rounded-2xl self-start sm:self-auto shadow-xs backdrop-blur-xs">
            <IconClock size={16} className="text-[#2B5A50]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">Kết thúc sau:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
              <span className="bg-stone-900 px-2 py-1 rounded-lg text-white min-w-[28px] text-center shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-stone-400 font-bold">:</span>
              <span className="bg-stone-900 px-2 py-1 rounded-lg text-white min-w-[28px] text-center shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-stone-400 font-bold">:</span>
              <span className="bg-[#2B5A50] px-2 py-1 rounded-lg text-white font-black min-w-[28px] text-center shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid: Tự động dàn đều gọn gàng */}
        <div className={`grid gap-4 sm:gap-6 relative z-10 ${
          products.length >= 5
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-2 md:grid-cols-4'
        }`}>
          {products.map((p) => {
            const finalPrice = p.discountPercent
              ? Math.round(p.price * (1 - p.discountPercent / 100))
              : p.price;

            return (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group bg-white rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative border border-stone-200/80 hover:border-[#2B5A50]/50 cursor-pointer shadow-xs"
              >
                {/* Discount Badge */}
                {p.discountPercent ? (
                  <span className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-md bg-[#C88A58] text-white font-extrabold text-xs shadow-xs">
                    -{p.discountPercent}%
                  </span>
                ) : null}

                {/* Product Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-50 mb-3 border border-stone-100">
                  <img
                    src={p.images?.[0] || ''}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-end text-left">
                  <h3 className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-2 group-hover:text-[#2B5A50] transition-colors leading-snug">
                    {p.name}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-bold text-[#2B5A50] text-sm sm:text-base tabular-nums">
                      {formatVND(finalPrice)}
                    </span>
                    {p.discountPercent ? (
                      <span className="text-xs text-stone-500 line-through tabular-nums font-medium">
                        {formatVND(p.price)}
                      </span>
                    ) : null}
                  </div>

                  {/* Stock progress bar */}
                  <div className="space-y-1 pt-1.5">
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#2B5A50] h-full rounded-full w-3/4" />
                    </div>
                    <span className="text-xs text-stone-500 block text-right font-medium">
                      Còn {p.stockQuantity || 12} cái
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center relative z-10">
          <Link
            to="/products?flashsale=true"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2B5A50] hover:text-white bg-white hover:bg-[#2B5A50] px-6 py-2.5 rounded-full border border-[#2B5A50]/60 shadow-xs transition-all uppercase tracking-wider"
          >
            <span>Xem tất cả ưu đãi Flash Sale</span>
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
