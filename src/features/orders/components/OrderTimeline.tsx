import React from 'react';
import { Steps } from 'antd';
import type { OrderStatus } from '~/types';

const STEP: Record<string, number> = { pending: 0, processing: 1, shipping: 2, completed: 3 };

export const OrderTimeline: React.FC<{ status: OrderStatus }> = ({ status }) => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
    <h3 className="font-bold text-stone-900 text-sm">Tiến Trình Xử Lý Đơn Hàng</h3>
    <Steps current={STEP[status] ?? 0} items={[
      { title: 'Đặt hàng', description: 'Đã nhận thông tin' },
      { title: 'Xác nhận & Đóng gói', description: 'Chuẩn bị tại kho' },
      { title: 'Đang vận chuyển', description: 'Giao hàng & Lắp đặt' },
      { title: 'Hoàn thành', description: 'Bàn giao sản phẩm' },
    ]} />
  </div>
);
