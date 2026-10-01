import React, { useState, useEffect, useRef } from "react";
import { Tag, Image } from "antd";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
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

  // Auto-slide effect (every 3.5 seconds)
  useEffect(() => {
    if (images.length <= 1 || isHovered || previewVisible) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        onSelect(images[next]);
        return next;
      });
    }, 3500);

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
      {/* Main Image Container */}
      <div
        className="aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-sm relative flex items-center justify-center group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setPreviewVisible(true)}
      >
        {/* Ant Design Image Preview */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <img
            src={currentImg}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Zoom Hint Overlay Icon in Center */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-stone-900/70 text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
            <Maximize2 size={13} />
            <span>Click để phóng to</span>
          </div>
        </div>

        {/* Discount Tag */}
        {product.discountPercent && (
          <Tag
            color="error"
            className="absolute top-4 left-4 font-bold border-none px-3 py-1 text-xs shadow-md z-10"
          >
            GIẢM {product.discountPercent}%
          </Tag>
        )}

        {/* Slide Counter */}
        {images.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-stone-900/60 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-xs z-10 pointer-events-none">
            {currentIndex + 1} / {images.length}
          </span>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-stone-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-stone-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
            >
              <ChevronRight size={20} />
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

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                onSelect(img);
              }}
              className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white p-1 ${
                currentIndex === idx
                  ? "border-amber-900 ring-2 ring-amber-800/30 shadow-xs"
                  : "border-stone-200 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
