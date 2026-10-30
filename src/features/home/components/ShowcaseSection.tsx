import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
      {/* Banner phong cách Nordic Warm Sand & Emerald Luxury (Không dùng khối đen/rêu xì tối tăm) */}
      <div className="bg-gradient-to-br from-[#F6F1E9] via-[#EFE8DC] to-[#E6DC Flora, #E5DAC8] rounded-3xl overflow-hidden border border-[#E2D7C7] text-[#1A2421] grid grid-cols-1 lg:grid-cols-2 items-center shadow-lg">
        <div className="p-8 sm:p-14 space-y-6">
          {badgeText && (
            <div className="flex flex-wrap gap-2">
              <span
                style={{ backgroundColor: '#C88A58', color: '#ffffff' }}
                className="text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wider shadow-xs uppercase inline-block"
              >
                {badgeText}
              </span>
            </div>
          )}

          {showcase.title && (
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-[#1A2421] tracking-tight">
              {showcase.title}
            </h2>
          )}

          {(showcase.description || (showcase as any).subtitle) && (
            <p className="text-[#55605B] text-xs sm:text-sm leading-relaxed font-normal">
              {showcase.description || (showcase as any).subtitle}
            </p>
          )}

          {showcase.highlights && showcase.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {showcase.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#DCD1C0] text-xs font-medium text-[#2B3832] shadow-2xs"
                >
                  <CheckCircleOutlined className="text-[#C88A58]" style={{ fontSize: 13, color: '#C88A58' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {ctaLink && (
            <div className="pt-2">
              <Link
                to={ctaLink}
                style={{ backgroundColor: '#2B5A50', color: '#ffffff' }}
                className="hover:!bg-[#1E433B] font-bold px-8 py-3.5 rounded-full text-xs inline-flex items-center gap-2.5 transition-all shadow-md hover:shadow-lg cursor-pointer text-white no-underline group"
              >
                <span className="text-white font-bold text-xs tracking-wide">{ctaLabel}</span>
                <RightOutlined style={{ fontSize: 11, color: '#ffffff' }} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="relative h-80 lg:h-full min-h-[380px] bg-stone-100">
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
