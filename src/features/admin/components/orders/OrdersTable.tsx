import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Select, Tag, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { formatVND, formatDate } from '~/common/utils/formatters';
import UTag from '~/components/ui/utag';
import UBadge from '~/components/ui/ubadge';
import UCopyButton from '~/components/ui/ubutton-copy';
import { StatusBadge } from '~/components/shared/StatusBadge';
import { ORDER_STATUS_OPTIONS } from '~/common/constants';
import type { AdminOrderSummaryItem } from '~/types';

interface OrdersTableProps {
  orders: AdminOrderSummaryItem[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: string) => void;
  pagination?: any;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading,
  onUpdateStatus,
  pagination,
}) => {
  const navigate = useNavigate();

  const isOrderUrgent = (order: any) => {
    if (!order.dt_created) return false;
    if (order.status !== 'pending' && order.status !== 'processing') return false;
    const createdTime = new Date(order.dt_created).getTime();
    return Date.now() - createdTime > 3 * 24 * 60 * 60 * 1000;
  };

  const columns = [
    {
      title: 'Mã Đơn & Ngày Đặt',
      dataIndex: 's_order_id',
      render: (id: string, row: any) => {
        const urgent = isOrderUrgent(row);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-gray-800">
              <span
                onClick={() => navigate(`/admin/orders/${id}`)}
                className="cursor-pointer hover:text-[#2B5A50] hover:underline"
              >
                {id}
              </span>
              <UCopyButton value={id} size={14} />
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1">
              <ClockCircleOutlined style={{ fontSize: 10 }} />
              {row.dt_created ? formatDate(row.dt_created) : '—'}
            </div>
            {urgent && (
              <Tag color="error" className="!font-bold !text-[10px] !border-rose-300 !bg-rose-50 !text-rose-700 m-0">
                ⚠️ Cần giao gấp (&gt; 3 ngày)
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'recipient_name',
      render: (name: string, row: any) => (
        <div>
          <p className="font-semibold text-xs text-gray-900 m-0">{name}</p>
          <p className="text-[11px] text-gray-400 m-0">{row.phone}</p>
        </div>
      ),
    },
    {
      title: 'Địa Chỉ Nhận Hàng',
      dataIndex: 'address_line',
      render: (addr: string, row: any) => (
        <span className="text-xs text-gray-600 truncate max-w-xs block">
          {[addr, row.district, row.city].filter(Boolean).join(', ')}
        </span>
      ),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'total_amount',
      render: (amount: number) => (
        <span className="font-bold text-sky-600 text-xs">{formatVND(amount || 0)}</span>
      ),
    },
    {
      title: 'Hình Thức TT',
      dataIndex: 'payment_method',
      render: (pm: string) => (
        <UBadge color={pm === 'bank_transfer' ? 'indigo' : 'gray'}>
          {pm === 'bank_transfer' ? 'VIETQR' : pm?.toUpperCase()}
        </UBadge>
      ),
    },
    {
      title: 'Thanh Toán',
      dataIndex: 'payment_status',
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Trạng Thái Đơn',
      dataIndex: 'status',
      render: (status: string, record: any) => {
        if (status === 'cancelled') {
          return (
            <Tag color="red" className="!font-semibold !px-2.5 !py-0.5 !rounded-md">
              ĐÃ HỦY ĐƠN
            </Tag>
          );
        }
        return (
          <Select
            value={status}
            size="small"
            className="w-36 text-xs"
            style={{ width: '144px' }}
            onChange={(newVal) =>
              onUpdateStatus(record.s_ID || record.s_order_id, newVal)
            }
            options={ORDER_STATUS_OPTIONS}
          />
        );
      },
    },
    {
      title: 'Thao Tác',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          size="small"
          type="primary"
          onClick={() => navigate(`/admin/orders/${record.s_order_id || record.s_ID}`)}
          className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-medium !text-xs !h-7 !px-2.5 !rounded-md cursor-pointer"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      rowKey={(r) => r.s_ID || r.s_order_id}
      columns={columns}
      loading={isLoading}
      pagination={pagination || false}
      size="middle"
      scroll={{ x: 'max-content' }}
      rowClassName={(record) => (isOrderUrgent(record) ? 'bg-rose-50/30' : '')}
    />
  );
};

export default OrdersTable;
