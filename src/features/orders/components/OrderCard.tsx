import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Tag } from 'antd';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import type { Order } from '~/types';

export const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const statusInfo = ORDER_STATUS_LABEL[order.status] ?? { label: order.status, color: 'default' };
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-amber-950 text-sm">{order.id}</span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500 flex items-center gap-1"><Clock size={14} /> {formatDate(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Tag color={statusInfo.color} className="font-bold text-xs px-3 py-0.5 rounded-full">{statusInfo.label}</Tag>
          <Link to={`/orders/${order.id}`} className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"><Eye size={14} /> Xem chi tiết</Link>
        </div>
      </div>
      <div className="space-y-3">
        {order.items.map(item => (
          <div key={item.product.id} className="flex items-center gap-4">
            <img src={item.product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200" />
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-stone-900 line-clamp-1">{item.product.name}</h4>
              <p className="text-stone-500">Màu: {item.selectedColor ?? 'Chuẩn'} | SL: {item.quantity}</p>
            </div>
            <span className="font-bold text-amber-950 text-xs">{formatVND(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <span className="text-stone-500">Người nhận: <strong>{order.customerInfo.fullName}</strong></span>
        <div className="text-right">
          <span className="text-stone-500 mr-2">Tổng:</span>
          <strong className="text-lg font-bold text-amber-950">{formatVND(order.totalAmount)}</strong>
        </div>
      </div>
    </div>
  );
};
