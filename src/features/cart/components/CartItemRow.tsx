import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import type { CartItem } from '~/types';

interface Props { item: CartItem; onUpdateQty: (id: string, qty: number) => void; onRemove: (id: string) => void; }

export const CartItemRow: React.FC<Props> = ({ item, onUpdateQty, onRemove }) => {
  const itemPrice = item.product.discountPercent ? calculateDiscountPrice(item.product.price, item.product.discountPercent) : item.product.price;
  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <Link to={`/products/${item.product.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 space-y-1 text-center sm:text-left">
        <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">{item.product.categoryName}</span>
        <Link to={`/products/${item.product.slug}`} className="font-bold text-stone-900 hover:text-amber-900 text-sm line-clamp-1 block">{item.product.name}</Link>
        {item.selectedColor && <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">Màu: {item.selectedColor}</span>}
        <div className="text-xs font-bold text-stone-900 pt-1">{formatVND(itemPrice)}</div>
      </div>
      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
        <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="px-2.5 py-1 text-stone-600 hover:bg-stone-200"><Minus size={12} /></button>
        <span className="px-3 font-bold text-xs">{item.quantity}</span>
        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="px-2.5 py-1 text-stone-600 hover:bg-stone-200"><Plus size={12} /></button>
      </div>
      <div className="text-right min-w-[100px]"><span className="text-sm font-bold text-amber-950">{formatVND(itemPrice * item.quantity)}</span></div>
      <button onClick={() => onRemove(item.product.id)} className="p-2 text-stone-400 hover:text-rose-600"><Trash2 size={16} /></button>
    </div>
  );
};
