import React from 'react';
import { Carousel } from 'antd';
import type { IFBanner } from '~/types';

interface Props { banners: IFBanner[]; isLoading: boolean; }

export const HeroBanner: React.FC<Props> = ({ banners, isLoading }) => {
  if (isLoading || banners.length === 0) {
    return (
      <div className="w-full bg-stone-200 h-[280px] sm:h-[400px] md:h-[500px] animate-pulse" />
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
                    alt={b.alt || ''}
                    className="w-full h-auto max-h-[560px] object-contain sm:object-cover mx-auto"
                    loading="eager"
                  />
                </a>
              ) : (
                <img
                  src={b.imageUrl}
                  alt={b.alt || ''}
                  className="w-full h-auto max-h-[560px] object-contain sm:object-cover mx-auto"
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

