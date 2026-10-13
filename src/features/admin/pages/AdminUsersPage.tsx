import React, { useState } from 'react';
import {
  Table,
  Switch,
  Popconfirm,
  Pagination,
  Select,
  Button,
  Modal,
  Form,
  Input,
  Drawer,
  Space,
  Tooltip,
  Tag,
} from 'antd';
import {
  EditOutlined,
  KeyOutlined,
  ShoppingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAdminUsers } from '~/features/admin/hooks';
import { adminService } from '~/services/v1/admin.service';
import { formatVND } from '~/common/utils/formatters';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import USearchInput from '~/components/ui/usearch-input';
import UAvatar from '~/components/ui/uavatar';
import UTag from '~/components/ui/utag';
import UBadge from '~/components/ui/ubadge';

export const AdminUsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Drawer State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<any>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [viewingOrdersUser, setViewingOrdersUser] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [editForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  // Hook tập trung quản lý user
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
    page: currentPage,
    limit: 10,
    search: search || undefined,
  });

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      s_user: user.s_user,
      phone: user.phone,
      role: user.role || 'customer',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenReset = (user: any) => {
    setResettingUser(user);
    resetForm.resetFields();
    setIsResetModalOpen(true);
  };

  const handleOpenOrders = async (user: any) => {
    setViewingOrdersUser(user);
    setOrdersLoading(true);
    try {
      const res = await adminService.getUserOrders(user.s_ID);
      setUserOrders(res || []);
    } catch {
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleEditFinish = async (values: any) => {
    if (editingUser) {
      await updateUser({ id: editingUser.s_ID, data: values });
      setIsEditModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleResetFinish = async (values: any) => {
    if (resettingUser) {
      await resetPassword({ id: resettingUser.s_ID, newPassword: values.newPassword });
      setIsResetModalOpen(false);
      setResettingUser(null);
    }
  };

  const filteredUsers = users.filter((u: any) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter === 'active' && !u.status) return false;
    if (statusFilter === 'locked' && u.status) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search) || roleFilter !== 'all' || statusFilter !== 'all';

  const columns = [
    {
      title: 'Người Dùng',
      dataIndex: 's_user',
      render: (username: string, row: any) => (
        <div className="flex items-center gap-3">
          <UAvatar size={34} nickname={username} src={row.avatar_url} />
          <div>
            <p className="font-semibold text-xs text-gray-900 m-0">{username}</p>
            <p className="text-[11px] text-gray-400 m-0">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      render: (phone: string) => <span className="text-xs text-gray-600">{phone || '—'}</span>,
    },
    {
      title: 'Điểm Tích Lũy',
      dataIndex: 'loyalty_points',
      width: 110,
      render: (pts: number) => <span className="text-xs font-bold text-brand-coral">{pts || 0} pts</span>,
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      width: 120,
      render: (role: string) => (
        <UTag color={role === 'admin' ? 'rose' : 'sky'}>
          {role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
        </UTag>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      width: 100,
      render: (status: boolean) => (
        <UBadge color={status ? 'green' : 'red'}>
          {status ? 'Hoạt động' : 'Đã khóa'}
        </UBadge>
      ),
    },
    {
      title: 'Khóa / Mở',
      dataIndex: 'status',
      width: 90,
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
      width: 110,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Tooltip title="Chỉnh sửa thông tin / vai trò">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined style={{ fontSize: 15, color: '#64748b' }} />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Đặt lại mật khẩu">
            <Button
              size="small"
              type="text"
              icon={<KeyOutlined style={{ fontSize: 15, color: '#f59e0b' }} />}
              onClick={() => handleOpenReset(record)}
            />
          </Tooltip>

          <Tooltip title="Xem các đơn hàng của người này">
            <Button
              size="small"
              type="text"
              icon={<ShoppingOutlined style={{ fontSize: 15, color: '#0ea5e9' }} />}
              onClick={() => handleOpenOrders(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans h-full">
      <UBreadcrumb title="Quản Lý Người Dùng" />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-3 flex flex-wrap items-center gap-3">
        <div className="w-64">
          <USearchInput
            placeholder="Tìm theo username hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Select
          value={roleFilter}
          onChange={(val) => setRoleFilter(val)}
          className="w-40 !h-9"
          options={[
            { value: 'all', label: 'Tất cả vai trò' },
            { value: 'admin', label: 'Quản trị viên' },
            { value: 'customer', label: 'Khách hàng' },
          ]}
        />

        <Select
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-40 !h-9"
          options={[
            { value: 'all', label: 'Tất cả trạng thái' },
            { value: 'active', label: 'Đang hoạt động' },
            { value: 'locked', label: 'Đã bị khóa' },
          ]}
        />

        {hasActiveFilters && (
          <Button
            type="dashed"
            icon={<ReloadOutlined style={{ fontSize: 13 }} />}
            onClick={handleResetFilters}
            className="!text-xs text-gray-500"
          >
            Đặt lại
          </Button>
        )}

        <div className="ml-auto text-xs text-gray-400 font-medium">
          Hiển thị <strong>{filteredUsers.length}</strong> / <strong>{total}</strong> tài khoản
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex-1 min-h-0 flex flex-col justify-between">
        <Table
          dataSource={filteredUsers}
          rowKey={(r) => r.s_ID || r._id}
          columns={columns}
          loading={isLoading}
          pagination={false}
          size="middle"
          scroll={{ y: 'calc(100vh - 290px)' }}
        />

        <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={total}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(t) => `Tổng số ${t} người dùng`}
          />
        </div>
      </div>

      {/* Modal Chỉnh Sửa Thông Tin & Vai Trò */}
      <Modal
        title="Chỉnh Sửa Thông Tin Người Dùng"
        open={isEditModalOpen}
        onOk={() => editForm.submit()}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        confirmLoading={isUpdating}
        okText="Lưu thay đổi"
        cancelText="Đóng"
        centered
        destroyOnClose
        width={440}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditFinish} className="mt-3">
          <Form.Item name="s_user" label="Tên người dùng">
            <Input className="!rounded-lg !py-1.5" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input className="!rounded-lg !py-1.5" />
          </Form.Item>
          <Form.Item name="role" label="Vai trò tài khoản">
            <Select
              className="w-full !h-9"
              options={[
                { value: 'customer', label: 'Khách hàng (Customer)' },
                { value: 'admin', label: 'Quản trị viên (Admin)' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Đặt Lại Mật Khẩu */}
      <Modal
        title={`Đặt Lại Mật Khẩu: ${resettingUser?.s_user}`}
        open={isResetModalOpen}
        onOk={() => resetForm.submit()}
        onCancel={() => {
          setIsResetModalOpen(false);
          setResettingUser(null);
        }}
        confirmLoading={isResetting}
        okText="Cập nhật mật khẩu mới"
        cancelText="Hủy"
        centered
        destroyOnClose
        width={420}
      >
        <Form form={resetForm} layout="vertical" onFinish={handleResetFinish} className="mt-3">
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới (tối thiểu 6 ký tự)"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới..." className="!rounded-lg !py-1.5" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer Xem Đơn Hàng Của Người Dùng */}
      <Drawer
        title={
          <div>
            <h4 className="text-sm font-bold text-gray-900 m-0">
              Đơn hàng của: {viewingOrdersUser?.s_user}
            </h4>
            <p className="text-xs text-gray-400 m-0 mt-0.5">{viewingOrdersUser?.email}</p>
          </div>
        }
        open={Boolean(viewingOrdersUser)}
        onClose={() => setViewingOrdersUser(null)}
        width={680}
      >
        <Table
          dataSource={userOrders}
          rowKey={(r) => r.s_ID || r.s_order_id}
          loading={ordersLoading}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Mã đơn',
              dataIndex: 's_order_id',
              render: (id: string) => <span className="font-mono text-xs font-semibold">{id}</span>,
            },
            {
              title: 'Ngày đặt',
              dataIndex: 'dt_created',
              render: (d: string) => <span className="text-xs text-gray-500">{d ? new Date(d).toLocaleDateString('vi-VN') : '—'}</span>,
            },
            {
              title: 'Tổng tiền',
              dataIndex: 'total_amount',
              render: (a: number) => <span className="font-bold text-sky-600 text-xs">{formatVND(a)}</span>,
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (st: string) => <UTag color="sky">{st?.toUpperCase()}</UTag>,
            },
          ]}
        />
      </Drawer>
    </div>
  );
};

export default AdminUsersPage;
