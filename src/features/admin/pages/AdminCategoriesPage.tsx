import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAdminCategories } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import USearchInput from '~/components/ui/usearch-input';
import UImageUpload from '~/components/ui/uimage-upload';
import CategoryDetailDrawer from '~/features/admin/components/CategoryDetailDrawer';

export const AdminCategoriesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  // Hook tập trung quản lý categories
  const {
    categories,
    isLoading,
    createCategory,
    deleteCategory,
    isCreating,
  } = useAdminCategories();

  const handleFinish = async (values: any) => {
    await createCategory(values);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOpenDetail = (cat: any) => {
    setSelectedCategory(cat);
    setIsDetailDrawerOpen(true);
  };

  const filteredCategories = categories.filter((c: any) =>
    (c.s_Name || c.name || '')
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const columns = [
    {
      title: 'Tên Danh Mục',
      dataIndex: 's_Name',
      render: (name: string, row: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleOpenDetail(row)}
        >
          {row.image_url ? (
            <img
              src={row.image_url}
              alt=""
              className="size-10 rounded-lg object-cover border border-gray-200 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="size-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              <AppstoreOutlined style={{ fontSize: 18 }} />
            </div>
          )}
          <div>
            <p className="font-semibold text-xs text-gray-900 group-hover:text-sky-600 transition-colors m-0">
              {name || row.name}
            </p>
            <p className="text-[11px] text-gray-400 font-mono m-0 mt-0.5">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      render: (desc: string) => (
        <span className="text-xs text-gray-600 line-clamp-1">{desc || '—'}</span>
      ),
    },
    {
      title: 'Thao Tác',
      width: 100,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Tooltip title="Xem chi tiết & danh sách sản phẩm">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined style={{ fontSize: 16, color: '#0ea5e9' }} />}
              onClick={() => handleOpenDetail(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa danh mục này?"
            onConfirm={() => deleteCategory(record.s_ID)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa danh mục">
              <Button
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: 16 }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans h-full">
      <UBreadcrumb
        title="Quản Lý Danh Mục"
        trailing={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalOpen(true);
            }}
            className="!bg-sky-500 hover:!bg-sky-400 !font-semibold !shadow-xs"
          >
            Thêm danh mục mới
          </Button>
        }
      >
        <div className="w-72">
          <USearchInput
            placeholder="Tìm theo tên danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </UBreadcrumb>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex-1 min-h-0 flex flex-col justify-between">
        <Table
          dataSource={filteredCategories}
          rowKey="s_ID"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 8, showTotal: (t) => `Tổng số ${t} danh mục` }}
          size="middle"
          scroll={{ y: 'calc(100vh - 290px)' }}
          onRow={(record) => ({
            onClick: (e) => {
              const target = e.target as HTMLElement;
              if (!target.closest('button') && !target.closest('.ant-popconfirm')) {
                handleOpenDetail(record);
              }
            },
            className: 'cursor-pointer hover:bg-sky-50/30 transition-colors',
          })}
        />
      </div>

      {/* Modal Thêm Danh Mục */}
      <Modal
        title="Thêm Mới Danh Mục"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isCreating}
        okText="Tạo mới"
        cancelText="Đóng"
        width={480}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-3">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Ví dụ: Phòng Khách, Phòng Ngủ, Bếp..." className="!rounded-lg !py-1.5 !w-full" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="image_url" label="Ảnh minh họa danh mục">
            <UImageUpload aspectRatio="square" placeholderText="Chọn ảnh danh mục" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả danh mục">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn về danh mục..." className="!rounded-lg !w-full" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer Chi Tiết Danh Mục & Danh Sách Sản Phẩm */}
      <CategoryDetailDrawer
        open={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        categories={categories.map((c: any) => ({
          id: c.s_ID || c.id,
          name: c.s_Name || c.name,
        }))}
      />
    </div>
  );
};

export default AdminCategoriesPage;
