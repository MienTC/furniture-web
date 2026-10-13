import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Select } from 'antd';
import { IconPlus, IconTrash, IconTicket } from '@tabler/icons-react';
import { useAdminVouchers } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UTag from '~/components/ui/utag';
import { formatVND } from '~/common/utils/formatters';

export const AdminVouchersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Hook tập trung quản lý vouchers
  const {
    vouchers,
    isLoading,
    createVoucher,
    deleteVoucher,
    isCreating,
  } = useAdminVouchers();

  const handleFinish = async (values: any) => {
    await createVoucher(values);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Mã Giảm Giá',
      dataIndex: 'code',
      render: (code: string, row: any) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-brand-peach/20 text-brand-coral">
            <IconTicket size={16} />
          </div>
          <div>
            <p className="font-mono font-bold text-xs text-gray-900">{code}</p>
            <p className="text-[11px] text-gray-400">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mức Giảm',
      dataIndex: 'discount_value',
      render: (val: number, row: any) => (
        <UTag color="green">
          {row.discount_type === 'percentage' ? `Giảm ${val}%` : `Giảm ${formatVND(val)}`}
        </UTag>
      ),
    },
    {
      title: 'Đơn Tối Thiểu',
      dataIndex: 'min_order_value',
      render: (val: number) => <span className="text-xs text-gray-600">{val ? formatVND(val) : '0 đ'}</span>,
    },
    {
      title: 'Lượt Dùng',
      dataIndex: 'usage_count',
      render: (count: number, row: any) => (
        <span className="text-xs font-semibold text-gray-700">
          {count || 0} / {row.usage_limit || '∞'}
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xác nhận xóa voucher này?"
          onConfirm={() => deleteVoucher(record.s_ID)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button size="small" type="text" danger icon={<IconTrash size={16} />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 font-sans">
      <UBreadcrumb
        title="Quản Lý Voucher Giảm Giá"
        trailing={
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              form.resetFields();
              setIsModalOpen(true);
            }}
            className="!bg-sky-500 hover:!bg-sky-400 !font-semibold !shadow-xs"
          >
            Tạo voucher mới
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5">
        <Table
          dataSource={vouchers}
          rowKey="s_ID"
          columns={columns}
          loading={isLoading}
          pagination={false}
          size="middle"
        />
      </div>

      <Modal
        title="Tạo Mới Voucher"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isCreating}
        okText="Tạo mới"
        cancelText="Đóng"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="code" label="Mã code (Viết hoa)" rules={[{ required: true, message: 'Nhập mã code' }]}>
              <Input placeholder="VÍ DỤ: LUXDECOR20" />
            </Form.Item>
            <Form.Item name="name" label="Tên chương trình" rules={[{ required: true, message: 'Nhập tên' }]}>
              <Input placeholder="Giảm giá khai trương" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="discount_type" label="Loại giảm giá" initialValue="percentage">
              <Select
                options={[
                  { value: 'percentage', label: 'Theo phần trăm (%)' },
                  { value: 'fixed', label: 'Số tiền cố định (VNĐ)' },
                ]}
              />
            </Form.Item>
            <Form.Item name="discount_value" label="Giá trị giảm" rules={[{ required: true, message: 'Nhập mức giảm' }]}>
              <InputNumber className="w-full" min={1} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="min_order_value" label="Đơn tối thiểu (VNĐ)" initialValue={0}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="usage_limit" label="Giới hạn lượt dùng" initialValue={100}>
              <InputNumber className="w-full" min={1} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
