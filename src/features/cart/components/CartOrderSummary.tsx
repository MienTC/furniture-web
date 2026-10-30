import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { formatVND } from '~/common/utils/formatters';

interface Props { subtotal: number; discountAmount: number; shippingFee: number; totalAmount: number; onCheckout: () => void; }

export const CartOrderSummary: React.FC<Props> = ({ subtotal, discountAmount, shippingFee, totalAmount, onCheckout }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
    <h2 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3">Tóm Tắt Đơn Hàng</h2>
    <div className="space-y-2.5 text-xs text-stone-700">
      <div className="flex justify-between"><span>Tạm tính:</span><span className="font-semibold text-stone-900">{formatVND(subtotal)}</span></div>
      {discountAmount > 0 && <div className="flex justify-between text-[#B33D3D]"><span>Giảm giá:</span><span className="font-bold">-{formatVND(discountAmount)}</span></div>}
      <div className="flex justify-between items-center">
        <span>Phí vận chuyển:</span>
        <span>
          {shippingFee === 0 ? (
            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-xs">
              MIỄN PHÍ TOÀN QUỐC
            </span>
          ) : (
            formatVND(shippingFee)
          )}
        </span>
      </div>
    </div>
    <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
      <span className="font-bold text-stone-900 text-sm">Tổng thanh toán:</span>
      <span className="text-2xl font-black text-brand-coral">{formatVND(totalAmount)}</span>
    </div>
    <button
      onClick={onCheckout}
      className="w-full bg-[#C84E4E] hover:bg-[#B33D3D] text-white font-black py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer"
    >
      <span>Tiến Hành Thanh Toán</span>
      <RightOutlined style={{ fontSize: 13 }} />
    </button>
  </div>
);
