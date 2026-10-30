import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '~/features/orders/hooks';
import { OrderCard } from '~/features/orders/components/OrderCard';
import { ReviewModal } from '~/features/products/components/ReviewModal';
import { InboxOutlined } from '@ant-design/icons';
import { Tabs, Spin } from 'antd';
import { useQueryClient } from '@tanstack/react-query';

export const OrderListPage: React.FC = () => {
  const { data: orders = [], isLoading } = useMyOrders();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const [reviewState, setReviewState] = useState<{
    open: boolean;
    product: any;
    orderId: string;
    customerName?: string;
  }>({
    open: false,
    product: null,
    orderId: '',
  });

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipping: orders.filter((o) => o.status === 'shipping').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => activeTab === 'all' || o.status === activeTab);
  }, [orders, activeTab]);

  const handleOpenReview = (product: any, orderId: string, customerName?: string) => {
    setReviewState({
      open: true,
      product,
      orderId,
      customerName,
    });
  };

  const handleCloseReview = () => {
    setReviewState({ open: false, product: null, orderId: '' });
    queryClient.invalidateQueries({ queryKey: ['myOrders'] });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Spin size="large" tip="Đang tải danh sách đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-stone-500">Theo dõi tiến độ giao nhận & lắp đặt sản phẩm nội thất</p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'all', label: `Tất cả (${counts.all})` },
          { key: 'pending', label: `Chờ xác nhận (${counts.pending})` },
          { key: 'processing', label: `Đang xử lý (${counts.processing})` },
          { key: 'shipping', label: `Đang giao hàng (${counts.shipping})` },
          { key: 'completed', label: `Đã hoàn thành (${counts.completed})` },
          { key: 'cancelled', label: `Đã hủy (${counts.cancelled})` },
        ]}
      />

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
            <InboxOutlined style={{ fontSize: 32 }} />
          </div>
          <h3 className="font-bold text-stone-800 text-lg">Chưa có đơn hàng nào trong mục này</h3>
          <p className="text-xs text-stone-500">Khám phá các sản phẩm nội thất cao cấp của chúng tôi ngay hôm nay</p>
          <Link
            to="/products"
            className="inline-block bg-[#2B5A50] hover:bg-[#20453D] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            Khám phá ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} onReview={handleOpenReview} />
          ))}
        </div>
      )}

      {reviewState.open && reviewState.product && (
        <ReviewModal
          open={reviewState.open}
          product={reviewState.product}
          orderId={reviewState.orderId}
          defaultName={reviewState.customerName}
          onClose={handleCloseReview}
        />
      )}
    </div>
  );
};

export default OrderListPage;
