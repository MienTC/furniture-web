import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'antd';
import { ArrowRight } from 'lucide-react';

export interface HeroSlideItem {
  id: string;
  image: string;
  alt: string;
  title: React.ReactNode;
  description: string;
  button: {
    to: string;
    text: string;
  };
}

export const HERO_SLIDES: HeroSlideItem[] = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    alt: "Luxury Living Room",
    title: (
      <>
        Kiến Tạo Không Gian Sống{" "}
        <span className="gold-gradient-text font-extrabold">Đẳng Cấp & Sang Trọng</span>
      </>
    ),
    description:
      "Chế tác hoàn hảo từ gỗ sồi Mỹ tuyển chọn và da bò Ý nguyên tấm. Bảo hành 5 năm toàn quốc, miễn phí thiết kế & lắp đặt.",
    button: {
      to: "/products",
      text: "Khám Phá Bộ Sưu Tập",
    },
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
    alt: "Luxury Bedroom",
    title: (
      <>
        Nội Thất Phòng Ngủ{" "}
        <span className="gold-gradient-text font-extrabold">Nordic Royal</span>
      </>
    ),
    description:
      "Đường nét tối giản Bắc Âu mang lại trải nghiệm nghỉ ngơi êm ái và không gian thư giãn tuyệt đối cho gia đình bạn.",
    button: {
      to: "/products?category=phong-ngu",
      text: "Xem Giường Ngủ Gỗ Sồi",
    },
  },
];

export const HeroCarousel: React.FC = () => {
  return (
    <section className="relative bg-stone-950 text-white overflow-hidden">
      <Carousel autoplay effect="fade">
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} className="relative h-[480px] sm:h-[570px]">
            <img
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full space-y-6">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-heading font-bold text-white leading-tight max-w-2xl drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base text-stone-200 max-w-xl font-normal drop-shadow">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to={slide.button.to}
                    className="hero-btn-white px-8 py-3.5 text-sm sm:text-base"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#b91c1c',
                      border: '2px solid #ffffff',
                    }}
                  >
                    <span style={{ color: '#b91c1c', fontWeight: 700 }}>
                      {slide.button.text}
                    </span>
                    <ArrowRight size={18} style={{ color: '#b91c1c' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};
