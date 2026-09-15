import React from 'react';
import { Tag } from 'antd';
import type { Product } from '~/types';

interface Props { product: Product; activeImage: string; onSelect: (img: string) => void; }

export const ProductGallery: React.FC<Props> = ({ product, activeImage, onSelect }) => (
  <div className="space-y-4">
    <div className="aspect-4/3 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm relative">
      <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
      {product.discountPercent && (
        <Tag color="error" className="absolute top-4 left-4 font-bold border-none px-3 py-1 text-xs shadow-md">
          GIẢM {product.discountPercent}%
        </Tag>
      )}
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {product.images.map((img, idx) => (
        <button key={idx} onClick={() => onSelect(img)}
          className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === img ? 'border-amber-900 ring-2 ring-amber-800/30' : 'border-stone-200 opacity-70 hover:opacity-100'}`}>
          <img src={img} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  </div>
);
