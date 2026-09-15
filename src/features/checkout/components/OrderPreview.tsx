import React from 'react';
import { Button } from 'antd';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import type { CartItem } from '~/types';

interface Props { cart: CartItem[]; subtotal: number; discountAmount: number; shippingFee: number; totalAmount: number; submitting: boolean; }

export const OrderPreview: React.FC<Props> = ({ cart, subtotal, discountAmount, shippingFee, totalAmount, submitting }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
    <h4 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3">Sản Phẩm ({cart.length})</h4>
    <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
      {cart.map(item => {
        const price = item.product.discountPercent ? calculateDiscountPrice(item.product.price, item.product.discountPercent) : item.product.price;
        return (
          <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
            <div className="flex-1 overflow-hidden text-xs">
              <p className="font-bold text-stone-900 truncate">{item.product.name}</p>
              <p className="text-stone-500">SL: {item.quantity} x {formatVND(price)}</p>
            </div>
            <span className="font-bold text-amber-950 text-xs">{formatVND(price * item.quantity)}</span>
          </div>
        );
      })}
    </div>
    <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-700">
      <div className="flex justify-between"><span>Tạm tính:</span><span>{formatVND(subtotal)}</span></div>
      {discountAmount > 0 && <div className="flex justify-between text-amber-800"><span>Giảm giá:</span><span className="font-bold">-{formatVND(discountAmount)}</span></div>}
      <div className="flex justify-between"><span>Phí vận chuyển:</span><span>{shippingFee === 0 ? <strong className="text-emerald-700">MIỄN PHÍ</strong> : formatVND(shippingFee)}</span></div>
      <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
        <span className="font-bold text-stone-900 text-sm">Tổng cộng:</span>
        <span className="text-2xl font-bold text-amber-950">{formatVND(totalAmount)}</span>
      </div>
    </div>
    <Button type="primary" htmlType="submit" loading={submitting} block size="large" className="!bg-amber-950 hover:!bg-amber-900 font-bold text-xs !rounded-xl !h-12 uppercase tracking-wider">
      Xác Nhận Đặt Hàng Ngay
    </Button>
  </div>
);
