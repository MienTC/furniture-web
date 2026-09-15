import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { formatVND } from '~/common/utils/formatters';
import type { Order } from '~/types';

export const OrderSummaryPanel: React.FC<{ order: Order }> = ({ order }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs text-xs">
    <h4 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3">Thông Tin Giao Hàng</h4>
    <div className="space-y-3">
      <div><span className="text-stone-400 block">Họ và tên:</span><strong className="text-stone-900 text-sm">{order.customerInfo.fullName}</strong></div>
      <div className="flex items-center gap-1.5"><Phone size={13} className="text-amber-600" /><span className="text-stone-800">{order.customerInfo.phone}</span></div>
      <div className="flex items-start gap-1.5"><MapPin size={13} className="text-amber-600 mt-0.5 shrink-0" /><span className="text-stone-800 leading-normal">{order.customerInfo.address}, {order.customerInfo.district}, {order.customerInfo.city}</span></div>
      {order.customerInfo.note && <div><span className="text-stone-400 block">Ghi chú:</span><span className="text-stone-700 italic">{order.customerInfo.note}</span></div>}
    </div>
    <div className="pt-4 border-t border-stone-200 space-y-2 text-stone-700">
      <div className="flex justify-between"><span>Tạm tính:</span><span>{formatVND(order.subtotal)}</span></div>
      {order.discountAmount > 0 && <div className="flex justify-between text-amber-800"><span>Giảm giá:</span><span className="font-bold">-{formatVND(order.discountAmount)}</span></div>}
      <div className="flex justify-between"><span>Vận chuyển:</span><span>{order.shippingFee === 0 ? <strong className="text-emerald-700">MIỄN PHÍ</strong> : formatVND(order.shippingFee)}</span></div>
      <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
        <span className="font-bold text-stone-900 text-sm">Tổng cộng:</span>
        <span className="text-xl font-bold text-amber-950">{formatVND(order.totalAmount)}</span>
      </div>
    </div>
  </div>
);
