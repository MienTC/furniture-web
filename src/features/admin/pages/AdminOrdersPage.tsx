import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { PlusOutlined, AlertOutlined } from '@ant-design/icons';
import { useAdminOrders, useTableFilters } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '~/common/constants';
import {
  FilterBar,
  FilterSearch,
  FilterSelect,
  FilterDateRange,
  FilterResetButton,
} from '~/components/common/filters';
import {
  OrderUrgentAlert,
  OrdersTable,
  CreateOrderModal,
} from '~/features/admin/components/orders';
import type { AdminCreateOrderPayload } from '~/types';

export const AdminOrdersPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { filters, setFilter, resetFilters, hasActiveFilters } = useTableFilters({
    paymentStatus: 'all',
    limit: 8,
  });

  const {
    orders,
    total,
    urgentCount,
    isLoading,
    updateOrderStatus,
    createOrder,
    isCreatingOrder,
  } = useAdminOrders({
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
    urgentOnly: filters.urgentOnly,
    search: filters.search,
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((ord: any) => {
      if (filters.paymentStatus !== 'all' && ord.payment_status !== filters.paymentStatus) {
        return false;
      }
      return true;
    });
  }, [orders, filters.paymentStatus]);

  const handleCreateOrderSubmit = async (payload: AdminCreateOrderPayload) => {
    await createOrder(payload);
    setIsCreateModalOpen(false);
  };

  const handleDateRangeChange = (range: [string, string] | null) => {
    setFilter('startDate', range ? range[0] : undefined);
    setFilter('endDate', range ? range[1] : undefined);
  };

  return (
    <div className="flex flex-col gap-4 font-sans">
      <UBreadcrumb
        title="Quản Lý Đơn Hàng"
        trailing={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !h-9 !px-4 !rounded-lg !shadow-xs cursor-pointer"
          >
            + Tạo đơn hàng mới
          </Button>
        }
      />

      <OrderUrgentAlert
        urgentCount={urgentCount}
        urgentOnly={Boolean(filters.urgentOnly)}
        onToggleUrgent={() => setFilter('urgentOnly', !filters.urgentOnly)}
      />

      <FilterBar>
        <FilterSearch
          value={filters.search || ''}
          onChange={(val) => setFilter('search', val)}
          placeholder="Tìm theo mã đơn, tên, SĐT..."
          width={240}
        />

        <FilterDateRange
          value={
            filters.startDate && filters.endDate
              ? [filters.startDate, filters.endDate]
              : null
          }
          onChange={handleDateRangeChange}
          placeholder={['Từ ngày đặt', 'Đến ngày đặt']}
          width={240}
        />

        <FilterSelect
          value={filters.status}
          onChange={(val) => setFilter('status', val)}
          options={ORDER_STATUS_OPTIONS}
          placeholder="Trạng thái đơn hàng"
          width={160}
        />

        <FilterSelect
          value={filters.paymentStatus}
          onChange={(val) => setFilter('paymentStatus', val)}
          options={PAYMENT_STATUS_OPTIONS}
          placeholder="Thanh toán"
          allowClear={false}
          width={160}
        />

        <Button
          type={filters.urgentOnly ? 'primary' : 'default'}
          danger={Boolean(filters.urgentOnly)}
          icon={<AlertOutlined />}
          onClick={() => setFilter('urgentOnly', !filters.urgentOnly)}
          className={`!h-9 !text-xs !font-semibold !rounded-lg cursor-pointer ${
            filters.urgentOnly
              ? '!bg-rose-600 text-white'
              : 'border-rose-300 text-rose-600 hover:!border-rose-500'
          }`}
        >
          {filters.urgentOnly ? 'Đang lọc: Cần xử lý gấp' : 'Đơn cần xử lý gấp'}
        </Button>

        <FilterResetButton onReset={resetFilters} visible={hasActiveFilters} />

        <div className="ml-auto text-xs text-gray-400 font-medium">
          Hiển thị <strong>{filteredOrders.length}</strong> / <strong>{total}</strong> đơn hàng
        </div>
      </FilterBar>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-col w-full">
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onUpdateStatus={(id, status) => updateOrderStatus({ id, status })}
          pagination={{
            current: filters.page || 1,
            pageSize: filters.limit || 8,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t: number) => `Tổng số ${t.toLocaleString()} đơn hàng`,
            onChange: (page: number, pageSize: number) => {
              setFilter('page', page);
              if (pageSize && pageSize !== filters.limit) {
                setFilter('limit', pageSize);
              }
            },
          }}
        />
      </div>

      <CreateOrderModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrderSubmit}
        loading={isCreatingOrder}
      />
    </div>
  );
};

export default AdminOrdersPage;
