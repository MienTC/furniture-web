import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '~/services/orderService';
import { OrderCard } from '~/features/orders/components/OrderCard';
import { Package } from 'lucide-react';
import { Tabs } from 'antd';
import type { Order } from '~/types';

export const OrderListPage: React.FC = () => {
  const [orders]    = useState<Order[]>(() => orderService.getOrders());
  const [activeTab, setActiveTab] = useState('all');
  const filtered = orders.filter(o => activeTab === 'all' || o.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-stone-500">Theo dõi tiến độ giao nhận & lắp đặt sản phẩm nội thất</p>
      </div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
        { key: 'all',        label: `Tất cả (${orders.length})` },
        { key: 'pending',    label: 'Chờ xác nhận' },
        { key: 'processing', label: 'Đang xử lý' },
        { key: 'shipping',   label: 'Đang giao hàng' },
        { key: 'completed',  label: 'Đã hoàn thành' },
      ]} />
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400"><Package size={32} /></div>
          <h3 className="font-bold text-stone-800 text-lg">Chưa có đơn hàng nào trong mục này</h3>
          <Link to="/products" className="inline-block bg-amber-950 text-white text-xs font-bold px-6 py-2.5 rounded-lg">Khám phá ngay</Link>
        </div>
      ) : (
        <div className="space-y-4">{filtered.map(o => <OrderCard key={o.id} order={o} />)}</div>
      )}
    </div>
  );
};
