import React from 'react';
import { Link } from 'react-router-dom';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import type { CartItem } from '~/types';

interface Props {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<Props> = ({ item, onUpdateQty, onRemove }) => {
  const itemPrice =
    item.selectedPrice ??
    item.selectedVariant?.sale_price ??
    (item.product.discountPercent
      ? calculateDiscountPrice(item.product.price, item.product.discountPercent)
      : item.product.price);

  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <Link
        to={`/products/${item.product.slug}`}
        className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200"
      >
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1 space-y-1.5 text-center sm:text-left">
        <span className="text-xs font-bold uppercase text-brand-coral tracking-wider block">
          {item.product.categoryName}
        </span>
        <Link
          to={`/products/${item.product.slug}`}
          className="font-bold text-stone-900 hover:text-brand-coral text-sm sm:text-base line-clamp-1 block"
        >
          {item.product.name}
        </Link>
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 justify-center sm:justify-start">
          {item.selectedColor && (
            <span className="inline-block text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
              Màu: {item.selectedColor}
            </span>
          )}
          {item.selectedVariant?.size && (
            <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#EDF5F2] text-[#2B5A50] font-semibold border border-[#D0DBD6]">
              {item.selectedVariant.size}
            </span>
          )}
          {item.selectedVariant?.material && (
            <span className="inline-block text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
              KT: {item.selectedVariant.material}
            </span>
          )}
        </div>
        <div className="text-sm font-black text-brand-coral pt-1">
          {formatVND(itemPrice)}
        </div>
      </div>
      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
        <button
          onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 cursor-pointer"
        >
          <MinusOutlined style={{ fontSize: 11 }} />
        </button>
        <span className="px-3 font-bold text-xs">{item.quantity}</span>
        <button
          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 cursor-pointer"
        >
          <PlusOutlined style={{ fontSize: 11 }} />
        </button>
      </div>
      <div className="text-right min-w-[100px]">
        <span className="text-sm font-bold text-stone-900">
          {formatVND(itemPrice * item.quantity)}
        </span>
      </div>
      <button
        onClick={() => onRemove(item.product.id)}
        className="p-2 text-stone-400 hover:text-rose-600 cursor-pointer"
      >
        <DeleteOutlined style={{ fontSize: 16 }} />
      </button>
    </div>
  );
};
