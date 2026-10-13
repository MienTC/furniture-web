import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import type { IFShowcaseSection } from '~/types';

export const ShowcaseSection: React.FC<{ showcase?: IFShowcaseSection | null }> = ({ showcase }) => {
  // 100% dữ liệu động từ Database: Nếu chưa có showcase trong DB hoặc bị tắt, không render khối này
  if (!showcase || (!showcase.imageUrl && !showcase.title)) {
    return null;
  }

  const imageUrl = showcase.imageUrl || (showcase as any).image;
  const ctaLink = showcase.ctaLink || (showcase as any).linkUrl || '/products';
  const ctaLabel = showcase.ctaLabel || (showcase as any).linkText || 'Khám Phá Bộ Sưu Tập';
  const badgeText = (showcase as any).badgeText || (showcase.badges && showcase.badges[0]?.label);

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="bg-stone-900 rounded-3xl overflow-hidden border border-brand-coral/30 text-white grid grid-cols-1 lg:grid-cols-2 items-center shadow-xl">
        <div className="p-8 sm:p-14 space-y-6">
          {badgeText && (
            <div className="flex flex-wrap gap-2">
              <span className="bg-brand-coral text-white text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wide shadow-xs">
                {badgeText}
              </span>
            </div>
          )}

          {showcase.title && (
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug">{showcase.title}</h2>
          )}

          {(showcase.description || (showcase as any).subtitle) && (
            <p className="text-stone-300 text-sm leading-relaxed font-light">
              {showcase.description || (showcase as any).subtitle}
            </p>
          )}

          {showcase.highlights && showcase.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {showcase.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-stone-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-coral" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {ctaLink && (
            <div>
              <Link
                to={ctaLink}
                className="bg-brand-coral hover:bg-[#c95f5f] text-white font-bold px-7 py-3.5 rounded-full text-xs inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>{ctaLabel}</span>
                <RightOutlined style={{ fontSize: 12 }} />
              </Link>
            </div>
          )}
        </div>

        <div className="relative h-80 lg:h-full min-h-[350px]">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={showcase.title || 'Bộ sưu tập'}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
};
