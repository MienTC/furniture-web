import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '~/services/orderService';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { OrderTimeline } from '~/features/orders/components/OrderTimeline';
import { BankTransferBox } from '~/features/orders/components/BankTransferBox';
import { OrderSummaryPanel } from '~/features/orders/components/OrderSummaryPanel';
import { ArrowLeft } from 'lucide-react';
import { Tag } from 'antd';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderService.getOrderById(orderId ?? '');

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không tìm thấy đơn hàng</h2>
        <Link to="/orders" className="inline-block bg-amber-950 text-white text-xs font-bold px-6 py-2.5 rounded-lg">Quay lại</Link>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS_LABEL[order.status] ?? { label: order.status, color: 'default' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-amber-950 mb-2">
          <ArrowLeft size={14} /> Quay lại danh sách đơn hàng
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Chi Tiết Đơn #{order.id}</h1>
            <p className="text-xs text-stone-500">Thời gian: {formatDate(order.createdAt)}</p>
          </div>
          <Tag color={statusInfo.color} className="font-bold text-sm px-4 py-1 rounded-full">{statusInfo.label}</Tag>
        </div>
      </div>

      <OrderTimeline status={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3">Danh Sách Sản Phẩm</h3>
            <div className="space-y-4 divide-y divide-stone-100">
              {order.items.map(item => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex items-center gap-4">
                  <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-stone-900 text-sm">{item.product.name}</h4>
                    <p className="text-stone-500">Màu: {item.selectedColor ?? 'Chuẩn'} | KT: {item.product.dimensions}</p>
                    <p className="text-stone-500">SL: <strong>{item.quantity}</strong> x {formatVND(item.product.price)}</p>
                  </div>
                  <span className="font-bold text-amber-950 text-sm">{formatVND(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
          {order.customerInfo.paymentMethod === 'bank_transfer' && (
            <BankTransferBox orderId={order.id} totalAmount={order.totalAmount} />
          )}
        </div>
        <OrderSummaryPanel order={order} />
      </div>
    </div>
  );
};
