import React, { useState, useMemo } from 'react';
import { Table, Switch, Popconfirm, Space, Tooltip, Button } from 'antd';
import {
  EditOutlined,
  KeyOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { useAdminUsers, useTableFilters } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UAvatar from '~/components/ui/uavatar';
import UTag from '~/components/ui/utag';
import UBadge from '~/components/ui/ubadge';
import UButtonCopy from '~/components/ui/ubutton-copy';
import {
  FilterBar,
  FilterSearch,
  FilterSelect,
  FilterResetButton,
} from '~/components/common/filters';
import {
  UserEditModal,
  UserResetPasswordModal,
  UserOrdersDrawer,
} from '~/features/admin/components/users';
import type { AdminUserUpdatePayload, AdminUserResetPasswordPayload } from '~/types';

const ROLE_OPTIONS = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'customer', label: 'Khách hàng' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'locked', label: 'Đã khóa' },
];

export const AdminUsersPage: React.FC = () => {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useTableFilters({
    role: 'all',
    status: 'all',
    limit: 8,
  });

  const [editingUser, setEditingUser] = useState<any>(null);
  const [resettingUser, setResettingUser] = useState<any>(null);
  const [viewingOrdersUser, setViewingOrdersUser] = useState<any>(null);

  const {
    users,
    total,
    isLoading,
    toggleUserStatus,
    isToggling,
    updateUser,
    isUpdating,
    resetPassword,
    isResetting,
  } = useAdminUsers({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    role: filters.role !== 'all' ? filters.role : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
  });

  const handleEditFinish = async (values: AdminUserUpdatePayload) => {
    if (editingUser) {
      await updateUser({ id: editingUser.s_ID, data: values });
      setEditingUser(null);
    }
  };

  const handleResetFinish = async (values: AdminUserResetPasswordPayload) => {
    if (resettingUser) {
      await resetPassword({ id: resettingUser.s_ID, newPassword: values.newPassword });
      setResettingUser(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      if (filters.role !== 'all' && u.role !== filters.role) return false;
      if (filters.status === 'active' && !u.status) return false;
      if (filters.status === 'locked' && u.status) return false;
      return true;
    });
  }, [users, filters.role, filters.status]);

  const columns = [
    {
      title: 'Người Dùng',
      dataIndex: 's_user',
      render: (_: string, row: any) => (
        <div className="flex items-center gap-3">
          <UAvatar
            src={row.avatar_url}
            nickname={row.s_user || row.name}
            size={36}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-gray-900 m-0">
                {row.s_user || row.name}
              </span>
              <UButtonCopy copyValue={row.s_user || row.email} />
            </div>
            <p className="text-[11px] text-gray-400 font-mono m-0 mt-0.5">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      width: 140,
      render: (phone: string) => (
        <span className="text-xs text-gray-600 font-mono">
          {phone || <span className="text-slate-400">-</span>}
        </span>
      ),
    },
    {
      title: 'Đơn Đã Đặt',
      dataIndex: 'orderCount',
      width: 120,
      align: 'center' as const,
      render: (count: number, record: any) => (
        <Tooltip title="Xem các đơn hàng của người này">
          <Button
            type="link"
            size="small"
            className="p-0 font-semibold text-[#2B5A50] hover:text-[#1e3e37] cursor-pointer"
            onClick={() => setViewingOrdersUser(record)}
          >
            {count || 0} đơn
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      width: 130,
      render: (role: string) => (
        <UBadge color={role === 'admin' ? 'indigo' : 'blue'}>
          {role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
        </UBadge>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      width: 120,
      render: (status: boolean) => (
        <UBadge color={status ? 'green' : 'red'}>
          {status ? 'Hoạt động' : 'Đã khóa'}
        </UBadge>
      ),
    },
    {
      title: 'Khóa / Mở',
      dataIndex: 'status',
      width: 100,
      render: (status: boolean, record: any) => (
        <Popconfirm
          title={status ? 'Khóa tài khoản này?' : 'Mở khóa tài khoản này?'}
          onConfirm={() => toggleUserStatus({ id: record.s_ID, status: !status })}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Switch checked={status} size="small" loading={isToggling} />
        </Popconfirm>
      ),
    },
    {
      title: 'Thao Tác',
      width: 120,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Tooltip title="Chỉnh sửa thông tin / vai trò">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined style={{ fontSize: 15, color: '#64748b' }} />}
              onClick={() => setEditingUser(record)}
            />
          </Tooltip>

          <Tooltip title="Đặt lại mật khẩu">
            <Button
              size="small"
              type="text"
              icon={<KeyOutlined style={{ fontSize: 15, color: '#FFCA88' }} />}
              onClick={() => setResettingUser(record)}
            />
          </Tooltip>

          <Tooltip title="Xem các đơn hàng của người này">
            <Button
              size="small"
              type="text"
              icon={<ShoppingOutlined style={{ fontSize: 15, color: '#2B5A50' }} />}
              onClick={() => setViewingOrdersUser(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans">
      <UBreadcrumb title="Quản Lý Người Dùng" />

      <FilterBar
        trailing={
          <div className="text-xs text-gray-400 font-medium">
            Hiển thị <strong>{filteredUsers.length}</strong> / <strong>{total}</strong> tài khoản
          </div>
        }
      >
        <FilterSearch
          value={filters.search || ''}
          onChange={(val) => setFilter('search', val)}
          placeholder="Tìm theo username hoặc email..."
          className="w-64"
        />

        <FilterSelect
          value={filters.role}
          onChange={(val) => setFilter('role', val)}
          options={ROLE_OPTIONS}
          className="w-40"
        />

        <FilterSelect
          value={filters.status}
          onChange={(val) => setFilter('status', val)}
          options={STATUS_OPTIONS}
          className="w-36"
        />

        {hasActiveFilters && (
          <FilterResetButton onReset={resetFilters} />
        )}
      </FilterBar>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-col">
        <Table
          dataSource={filteredUsers}
          rowKey={(r) => r.s_ID || r.id}
          columns={columns}
          loading={isLoading}
          size="middle"
          pagination={{
            current: filters.page || 1,
            pageSize: filters.limit || 8,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t) => `Tổng số ${t.toLocaleString()} người dùng`,
            onChange: (page, pageSize) => {
              setFilter('page', page);
              if (pageSize && pageSize !== filters.limit) {
                setFilter('limit', pageSize);
              }
            },
          }}
        />
      </div>

      {editingUser && (
        <UserEditModal
          open={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSubmit={handleEditFinish}
          loading={isUpdating}
        />
      )}

      {resettingUser && (
        <UserResetPasswordModal
          open={Boolean(resettingUser)}
          onClose={() => setResettingUser(null)}
          user={resettingUser}
          onSubmit={handleResetFinish}
          loading={isResetting}
        />
      )}

      {viewingOrdersUser && (
        <UserOrdersDrawer
          user={viewingOrdersUser}
          onClose={() => setViewingOrdersUser(null)}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
