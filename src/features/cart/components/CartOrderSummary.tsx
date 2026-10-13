import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { formatVND } from '~/common/utils/formatters';

interface Props { subtotal: number; discountAmount: number; shippingFee: number; totalAmount: number; onCheckout: () => void; }

export const CartOrderSummary: React.FC<Props> = ({ subtotal, discountAmount, shippingFee, totalAmount, onCheckout }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
    <h4 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3">Tóm Tắt Đơn Hàng</h4>
    <div className="space-y-2.5 text-xs text-stone-700">
      <div className="flex justify-between"><span>Tạm tính:</span><span className="font-semibold text-stone-900">{formatVND(subtotal)}</span></div>
      {discountAmount > 0 && <div className="flex justify-between text-brand-coral"><span>Giảm giá:</span><span className="font-bold">-{formatVND(discountAmount)}</span></div>}
      <div className="flex justify-between"><span>Phí vận chuyển:</span><span>{shippingFee === 0 ? <strong className="text-emerald-600 font-bold">MIỄN PHÍ TOÀN QUỐC</strong> : formatVND(shippingFee)}</span></div>
    </div>
    <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
      <span className="font-bold text-stone-900 text-sm">Tổng thanh toán:</span>
      <span className="text-2xl font-bold text-brand-coral">{formatVND(totalAmount)}</span>
    </div>
    <button onClick={onCheckout} className="w-full bg-brand-coral hover:bg-[#c95f5f] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer">
      Tiến Hành Thanh Toán <RightOutlined style={{ fontSize: 13 }} />
    </button>
  </div>
);
