import React, { useState } from 'react';
import { Card, Table, Tag, Select, message } from 'antd';
import { orderService } from '~/services/orderService';
import { formatVND } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import type { Order, OrderStatus } from '~/types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    orderService.updateOrderStatus(orderId, status);
    setOrders(orderService.getOrders());
    message.success(`Đã cập nhật trạng thái đơn hàng #${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-stone-500">Danh sách các đơn đặt hàng từ khách hàng</p>
      </div>

      <Card className="!rounded-2xl border-stone-200 shadow-2xs">
        <Table
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: 'Mã Đơn',
              dataIndex: 'id',
              render: (id: string) => <span className="font-mono font-bold text-amber-900">#{id}</span>,
            },
            {
              title: 'Khách Hàng',
              dataIndex: 'customerInfo',
              render: (info: any) => (
                <div>
                  <p className="font-semibold text-stone-900 text-xs">{info?.fullName}</p>
                  <p className="text-[11px] text-stone-500">{info?.phone}</p>
                </div>
              ),
            },
            {
              title: 'Ngày Đặt',
              dataIndex: 'createdAt',
              render: (date: string) => (
                <span className="text-xs text-stone-600">
                  {date ? new Date(date).toLocaleDateString('vi-VN') : 'Mới đây'}
                </span>
              ),
            },
            {
              title: 'Tổng Tiền',
              dataIndex: 'totalAmount',
              render: (total: number) => <span className="font-bold text-amber-950 tabular-nums">{formatVND(total)}</span>,
            },
            {
              title: 'Hình Thức',
              dataIndex: 'customerInfo',
              render: (info: any) => (
                <Tag color={info?.paymentMethod === 'bank_transfer' ? 'blue' : 'orange'}>
                  {info?.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'COD'}
                </Tag>
              ),
            },
            {
              title: 'Trạng Thái',
              dataIndex: 'status',
              render: (status: OrderStatus, record: Order) => (
                <Select
                  value={status}
                  size="small"
                  className="w-36"
                  onChange={(val) => handleStatusChange(record.id, val)}
                  options={[
                    { value: 'pending', label: 'Chờ xác nhận' },
                    { value: 'processing', label: 'Đang xử lý' },
                    { value: 'shipping', label: 'Đang giao hàng' },
                    { value: 'completed', label: 'Đã hoàn thành' },
                    { value: 'cancelled', label: 'Đã hủy' },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
