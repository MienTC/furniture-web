import React from 'react';
import { Carousel } from 'antd';
import type { IFBanner } from '~/mock/banners/mock-banners';

interface Props { banners: IFBanner[]; isLoading: boolean; }

export const HeroBanner: React.FC<Props> = ({ banners, isLoading }) => {
  if (isLoading || banners.length === 0) {
    return <div className="bg-stone-900 h-[400px] sm:h-[560px] animate-pulse" />;
  }
  return (
    <section className="relative bg-stone-900 overflow-hidden">
      <Carousel autoplay effect="fade">
        {banners.map((b) => (
          <div key={b.id} className="relative h-[400px] sm:h-[560px]">
            {b.linkUrl
              ? <a href={b.linkUrl}><img src={b.imageUrl} alt={b.alt} className="absolute inset-0 w-full h-full object-cover" /></a>
              : <img src={b.imageUrl} alt={b.alt} className="absolute inset-0 w-full h-full object-cover" />
            }
          </div>
        ))}
      </Carousel>
    </section>
  );
};
