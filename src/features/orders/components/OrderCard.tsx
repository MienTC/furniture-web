import React from 'react';
import { Link } from 'react-router-dom';
import { ClockCircleOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons';
import { Tag, Button } from 'antd';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import type { Order } from '~/types';

interface OrderCardProps {
  order: Order;
  onReview?: (product: any, orderId: string, customerName?: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onReview }) => {
  const statusInfo = ORDER_STATUS_LABEL[order.status] ?? { label: order.status, color: 'default' };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
          <span className="text-stone-300">•</span>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <ClockCircleOutlined style={{ fontSize: 13 }} /> {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Tag color={statusInfo.color} className="font-bold text-xs px-3 py-0.5 rounded-full">
            {statusInfo.label}
          </Tag>
          <Link
            to={`/orders/${order.id}`}
            className="text-xs font-bold text-[#2B5A50] hover:text-[#20453D] flex items-center gap-1"
          >
            <EyeOutlined style={{ fontSize: 13 }} /> Xem chi tiết
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.product.images[0]}
                alt=""
                className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
              />
              <div className="text-xs min-w-0">
                <h4 className="font-bold text-stone-900 truncate m-0">{item.product.name}</h4>
                <p className="text-stone-500 m-0 mt-0.5">
                  Màu: {item.selectedColor ?? 'Chuẩn'} | SL: {item.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="font-bold text-stone-900 text-xs">
                {formatVND(item.product.price * item.quantity)}
              </span>

              {order.status === 'completed' && onReview && (
                item.isReviewed ? (
                  <Tag color="green" className="text-[11px] font-semibold m-0">
                    Đã đánh giá
                  </Tag>
                ) : (
                  <Button
                    size="small"
                    type="primary"
                    icon={<StarOutlined style={{ fontSize: 12 }} />}
                    className="!bg-[#2B5A50] hover:!bg-[#20453D] font-bold text-xs"
                    onClick={() => onReview(item.product, order.id, order.customerInfo.fullName)}
                  >
                    Đánh giá
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <span className="text-stone-500">
          Người nhận: <strong>{order.customerInfo.fullName}</strong>
        </span>
        <div className="text-right">
          <span className="text-stone-500 mr-2">Tổng thanh toán:</span>
          <strong className="text-lg font-bold text-brand-coral">{formatVND(order.totalAmount)}</strong>
        </div>
      </div>
    </div>
  );
};
