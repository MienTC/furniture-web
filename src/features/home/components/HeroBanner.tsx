import React from 'react';
import { Carousel } from 'antd';
import type { IFBanner } from '~/types';

interface Props { banners: IFBanner[]; isLoading: boolean; }

export const HeroBanner: React.FC<Props> = ({ banners, isLoading }) => {
  if (isLoading || banners.length === 0) {
    return (
      <div className="w-full bg-stone-200 h-[220px] xs:h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] animate-pulse" />
    );
  }
  return (
    <section className="w-full overflow-hidden">
      <div className="w-full bg-stone-100">
        <Carousel autoplay effect="fade" autoplaySpeed={4500}>
          {banners.map((b) => (
            <div key={b.id} className="relative w-full">
              {b.linkUrl ? (
                <a href={b.linkUrl} className="block w-full">
                  <img
                    src={b.imageUrl}
                    alt={b.alt || 'LuxDecor Hero Banner'}
                    className="w-full h-[220px] xs:h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] object-cover mx-auto"
                    loading="eager"
                  />
                </a>
              ) : (
                <img
                  src={b.imageUrl}
                  alt={b.alt || 'LuxDecor Hero Banner'}
                  className="w-full h-[220px] xs:h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] object-cover mx-auto"
                  loading="eager"
                />
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

