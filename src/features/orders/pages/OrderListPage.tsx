import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '~/services/orderService';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { Order } from '~/types';
import { Package, Clock, ArrowRight, Eye, CheckCircle2, QrCode } from 'lucide-react';
import { Tag, Tabs, Card, Button } from 'antd';

export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900">
          Quản Lý Đơn Hàng Của Tôi
        </h1>
        <p className="text-xs text-stone-500">Theo dõi tiến độ giao nhận & lắp đặt sản phẩm nội thất</p>
      </div>

      {/* Tabs Filter */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'all', label: `Tất cả đơn (${orders.length})` },
          { key: 'pending', label: 'Chờ xác nhận' },
          { key: 'processing', label: 'Đang xử lý' },
          { key: 'shipping', label: 'Đang giao hàng' },
          { key: 'completed', label: 'Đã hoàn thành' },
        ]}
      />

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
            <Package size={32} />
          </div>
          <h3 className="font-bold text-stone-800 text-lg">Chưa có đơn hàng nào trong mục này</h3>
          <p className="text-xs text-stone-500">Khám phá các sản phẩm nội thất cao cấp ngay!</p>
          <Link to="/products" className="inline-block bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors">
            Khám phá ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = ORDER_STATUS_LABEL[order.status] || { label: order.status, color: 'default' };
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-red-950 text-sm">{order.id}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock size={14} /> {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Tag color={statusInfo.color} className="font-bold text-xs px-3 py-0.5 rounded-full">
                      {statusInfo.label}
                    </Tag>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs font-bold text-red-700 hover:text-red-600 flex items-center gap-1"
                    >
                      <Eye size={14} /> Xem chi tiết
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <img src={item.product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                      <div className="flex-1 text-xs">
                        <h4 className="font-bold text-stone-900 line-clamp-1">{item.product.name}</h4>
                        <p className="text-stone-500">Màu: {item.selectedColor || 'Chuẩn'} | Số lượng: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-red-700 text-xs">{formatVND(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer total */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Người nhận: <strong>{order.customerInfo.fullName}</strong> ({order.customerInfo.phone})</span>
                  <div className="text-right">
                    <span className="text-stone-500 mr-2">Tổng tiền thanh toán:</span>
                    <strong className="text-lg font-bold font-serif-heading text-red-700">{formatVND(order.totalAmount)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
