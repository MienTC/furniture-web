import React from 'react';
import { Row, Col, Table, Spin } from 'antd';
import {
  IconCurrencyDollar,
  IconShoppingBag,
  IconPackage,
  IconUsers,
  IconArrowUpRight,
  IconClock,
  IconChartBar,
  IconChartPie,
} from '@tabler/icons-react';
import { useAdminStats } from '~/features/admin/hooks';
import { formatVND } from '~/common/utils/formatters';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UBadge from '~/components/ui/ubadge';
import UTag from '~/components/ui/utag';
import RevenueChart from '~/features/admin/components/dashboard/RevenueChart';
import OrderStatusPieChart from '~/features/admin/components/dashboard/OrderStatusPieChart';
import CategoryBarChart from '~/features/admin/components/dashboard/CategoryBarChart';

export const AdminDashboardPage: React.FC = () => {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" tip="Đang tải dữ liệu báo cáo..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Doanh thu hệ thống',
      value: formatVND(stats?.totalRevenue || 0),
      icon: IconCurrencyDollar,
      sub: 'Đơn hàng đã thanh toán',
    },
    {
      title: 'Tổng số đơn hàng',
      value: (stats?.totalOrders || 0).toLocaleString(),
      icon: IconShoppingBag,
      sub: 'Bao gồm tất cả trạng thái',
    },
    {
      title: 'Sản phẩm kinh doanh',
      value: (stats?.totalProducts || 0).toLocaleString(),
      icon: IconPackage,
      sub: 'Đang hiển thị trên web',
    },
    {
      title: 'Khách hàng đăng ký',
      value: (stats?.totalUsers || 0).toLocaleString(),
      icon: IconUsers,
      sub: 'Tài khoản người dùng',
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      <UBreadcrumb title="Tổng Quan Bảng Điều Khiển" showBack={false} />

      {/* KPI Cards theo phong cách tev-fe-admin */}
      <Row gutter={[16, 16]}>
        {statCards.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.title}</span>
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <item.icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <IconArrowUpRight size={14} className="text-emerald-500" />
                {item.sub}
              </p>
            </div>
          </Col>
        ))}
      </Row>

      {/* Row Biểu đồ Doanh thu & Trạng thái Đơn hàng */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconChartBar size={18} className="text-sky-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Xu hướng Doanh thu (14 ngày qua)</h3>
              </div>
              <UBadge color="green">Doanh thu trực tuyến</UBadge>
            </div>
            <RevenueChart data={stats?.revenueByDate || []} />
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconChartPie size={18} className="text-sky-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Tỷ lệ Trạng thái Đơn</h3>
              </div>
              <UBadge color="blue">Tổng quan</UBadge>
            </div>
            <OrderStatusPieChart counts={stats?.orderStatusCounts || {}} />
          </div>
        </Col>
      </Row>

      {/* Row Phân bổ danh mục & Đơn hàng gần đây */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconPackage size={18} className="text-sky-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Phân bổ Sản phẩm theo Danh mục</h3>
              </div>
              <UBadge color="orange">Danh mục hàng</UBadge>
            </div>
            <CategoryBarChart data={stats?.categoryDistribution || []} />
          </div>
        </Col>

        <Col xs={24} lg={14}>
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconClock size={18} className="text-sky-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Đơn hàng mới tiếp nhận</h3>
              </div>
              <UBadge color="blue">Thời gian thực</UBadge>
            </div>

            <Table
              dataSource={stats?.recentOrders || []}
              rowKey="_id"
              pagination={false}
              size="middle"
              columns={[
                {
                  title: 'Mã đơn',
                  dataIndex: 's_order_id',
                  render: (id: string) => <span className="font-mono text-xs font-semibold text-gray-700">{id}</span>,
                },
                {
                  title: 'Khách hàng',
                  dataIndex: 'recipient_name',
                  render: (name: string, row: any) => (
                    <div>
                      <p className="font-medium text-xs text-gray-900">{name}</p>
                      <p className="text-[11px] text-gray-400">{row.phone}</p>
                    </div>
                  ),
                },
                {
                  title: 'Tổng tiền',
                  dataIndex: 'total_amount',
                  render: (amount: number) => <span className="font-bold text-sky-600 text-xs">{formatVND(amount)}</span>,
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: (status: string) => {
                    const statusMap: Record<string, { label: string; color: any }> = {
                      pending: { label: 'Chờ duyệt', color: 'orange' },
                      processing: { label: 'Đang xử lý', color: 'blue' },
                      shipping: { label: 'Đang giao', color: 'cyan' },
                      completed: { label: 'Hoàn thành', color: 'green' },
                      cancelled: { label: 'Đã hủy', color: 'red' },
                    };
                    const cur = statusMap[status] || { label: status, color: 'default' };
                    return <UTag color={cur.color}>{cur.label}</UTag>;
                  },
                },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
