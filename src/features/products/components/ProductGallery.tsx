import React, { useState, useEffect } from "react";
import { Image } from "antd";
import { LeftOutlined, RightOutlined, ExpandOutlined } from "@ant-design/icons";
import type { Product } from "~/types";

interface Props {
  product: Product;
  activeImage: string;
  onSelect: (img: string) => void;
}

export const ProductGallery: React.FC<Props> = ({
  product,
  activeImage,
  onSelect,
}) => {
  const images = product.images && product.images.length > 0 ? product.images : [activeImage];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Sync currentIndex when activeImage prop changes
  useEffect(() => {
    const idx = images.indexOf(activeImage);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  }, [activeImage, images]);

  // Auto-slide effect (every 4 seconds)
  useEffect(() => {
    if (images.length <= 1 || isHovered || previewVisible) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        onSelect(images[next]);
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [images, isHovered, previewVisible, onSelect]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prev);
    onSelect(images[prev]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    onSelect(images[next]);
  };

  const currentImg = images[currentIndex] || activeImage;

  return (
    <div className="space-y-4">
      {/* Main Image Container: Chuẩn tỷ lệ 1:1 vuông khớp ảnh gốc 2000x2000, tràn viền không bị lọt thỏm */}
      <div
        className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F4F6F5] border border-[#E5EAE7] shadow-sm relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setPreviewVisible(true)}
      >
        <img
          src={currentImg}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 block select-none"
        />

        {/* Zoom Hint Overlay Icon in Center */}
        <div className="absolute inset-0 bg-stone-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-stone-900/80 text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
            <ExpandOutlined style={{ fontSize: 13 }} />
            <span>Click để phóng to</span>
          </div>
        </div>

        {/* Discount Tag */}
        {product.discountPercent && (
          <span className="absolute top-3.5 left-3.5 bg-brand-coral text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-md z-10 uppercase tracking-wider">
            GIẢM {product.discountPercent}%
          </span>
        )}

        {/* Slide Counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3.5 right-3.5 bg-stone-900/60 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-xs z-10 pointer-events-none">
            {currentIndex + 1} / {images.length}
          </span>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-stone-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10 cursor-pointer"
            >
              <LeftOutlined style={{ fontSize: 14 }} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-stone-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10 cursor-pointer"
            >
              <RightOutlined style={{ fontSize: 14 }} />
            </button>
          </>
        )}
      </div>

      {/* Hidden Ant Design Image Preview Group for Modal View */}
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            current: currentIndex,
            onChange: (current) => {
              setCurrentIndex(current);
              onSelect(images[current]);
            },
            onVisibleChange: (vis) => {
              setPreviewVisible(vis);
            },
          }}
          items={images}
        >
          {images.map((img, i) => (
            <Image key={i} src={img} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* Thumbnail Bar: Tràn viền vuông 1:1 gọn gàng */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                onSelect(img);
              }}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#F4F6F5] cursor-pointer ${
                currentIndex === idx
                  ? "border-brand-coral ring-2 ring-brand-coral/30 shadow-xs"
                  : "border-[#E5EAE7] opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover block" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
