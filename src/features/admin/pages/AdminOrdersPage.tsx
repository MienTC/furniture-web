import React, { useState } from 'react';
import { Table, Select, Pagination, Space, Button, Tag } from 'antd';
import { IconRotateClockwise } from '@tabler/icons-react';
import { useAdminOrders } from '~/features/admin/hooks';
import { formatVND } from '~/common/utils/formatters';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import USearchInput from '~/components/ui/usearch-input';
import UBadge from '~/components/ui/ubadge';
import UTag from '~/components/ui/utag';
import UCopyButton from '~/components/ui/ubutton-copy';

export const AdminOrdersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Hook tập trung quản lý logic orders
  const {
    orders,
    total,
    isLoading,
    updateOrderStatus,
  } = useAdminOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter,
  });

  const filteredOrders = orders.filter((ord: any) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchId = (ord.s_order_id || '').toLowerCase().includes(q);
      const matchName = (ord.recipient_name || '').toLowerCase().includes(q);
      const matchPhone = (ord.phone || '').includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    if (paymentStatusFilter !== 'all' && ord.payment_status !== paymentStatusFilter) {
      return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter(undefined);
    setPaymentStatusFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search) || Boolean(statusFilter) || paymentStatusFilter !== 'all';

  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 's_order_id',
      render: (id: string) => (
        <div className="flex items-center gap-1 font-mono text-xs font-semibold text-gray-800">
          <span>{id}</span>
          <UCopyButton value={id} size={14} />
        </div>
      ),
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'recipient_name',
      render: (name: string, row: any) => (
        <div>
          <p className="font-semibold text-xs text-gray-900">{name}</p>
          <p className="text-[11px] text-gray-400">{row.phone}</p>
        </div>
      ),
    },
    {
      title: 'Địa Chỉ Nhận Hàng',
      dataIndex: 'address_line',
      render: (addr: string, row: any) => (
        <span className="text-xs text-gray-600 truncate max-w-xs block">
          {addr}, {row.district}, {row.city}
        </span>
      ),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'total_amount',
      render: (total: number) => (
        <span className="font-bold text-sky-600 text-xs">{formatVND(total)}</span>
      ),
    },
    {
      title: 'Hình Thức TT',
      dataIndex: 'payment_method',
      render: (pm: string) => <UTag color="slate">{pm?.toUpperCase() || 'COD'}</UTag>,
    },
    {
      title: 'Thanh Toán',
      dataIndex: 'payment_status',
      render: (status: string) => (
        <UBadge color={status === 'paid' ? 'green' : 'red'}>
          {status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </UBadge>
      ),
    },
    {
      title: 'Trạng Thái Đơn',
      dataIndex: 'status',
      render: (status: string, record: any) => (
        <Select
          value={status}
          size="small"
          className="w-36 text-xs"
          onChange={(newVal) =>
            updateOrderStatus({ id: record.s_ID || record.s_order_id, status: newVal })
          }
          options={[
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'processing', label: 'Đang xử lý' },
            { value: 'shipping', label: 'Đang giao hàng' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'cancelled', label: 'Đã hủy' },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 font-sans">
      <UBreadcrumb title="Quản Lý Đơn Hàng" />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-wrap items-center gap-3">
        <div className="w-64">
          <USearchInput
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Select
          placeholder="Trạng thái đơn hàng"
          allowClear
          className="w-44 !h-9"
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          options={[
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'processing', label: 'Đang xử lý' },
            { value: 'shipping', label: 'Đang giao hàng' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'cancelled', label: 'Đã hủy' },
          ]}
        />

        <Select
          value={paymentStatusFilter}
          onChange={(val) => setPaymentStatusFilter(val)}
          className="w-44 !h-9"
          options={[
            { value: 'all', label: 'Tất cả thanh toán' },
            { value: 'paid', label: 'Đã thanh toán' },
            { value: 'unpaid', label: 'Chưa thanh toán' },
          ]}
        />

        {hasActiveFilters && (
          <Button
            type="dashed"
            icon={<IconRotateClockwise size={14} />}
            onClick={handleResetFilters}
            className="!text-xs text-gray-500"
          >
            Đặt lại bộ lọc
          </Button>
        )}

        <div className="ml-auto text-xs text-gray-400 font-medium">
          Hiển thị <strong>{filteredOrders.length}</strong> / <strong>{total}</strong> đơn hàng
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5">
        <Table
          dataSource={filteredOrders}
          rowKey={(r) => r.s_ID || r.s_order_id}
          columns={columns}
          loading={isLoading}
          pagination={false}
          size="middle"
        />

        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={total}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(t) => `Tổng số ${t} đơn hàng`}
          />
        </div>
      </div>
    </div>
  );
};
