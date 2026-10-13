import React, { useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { IconPlus, IconTrash, IconTicket } from '@tabler/icons-react';
import { useAdminVouchers } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UTag from '~/components/ui/utag';
import { formatVND } from '~/common/utils/formatters';
import { CreateVoucherModal, type CreateVoucherFormValues } from '~/features/admin/components/vouchers';

export const AdminVouchersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    vouchers,
    isLoading,
    createVoucher,
    deleteVoucher,
    isCreating,
  } = useAdminVouchers();

  const handleCreateSubmit = async (values: CreateVoucherFormValues) => {
    await createVoucher(values);
    setIsModalOpen(false);
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
    <div className="flex flex-col gap-5 font-sans w-full min-h-full pb-16">
      <UBreadcrumb
        title="Quản Lý Voucher Giảm Giá"
        trailing={
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => setIsModalOpen(true)}
            className="!bg-brand-coral hover:!bg-[#c95f5f] !font-bold !h-10 !px-5 !rounded-lg !shadow-xs cursor-pointer"
          >
            Tạo voucher mới
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5 w-full">
        <Table
          dataSource={vouchers}
          rowKey="s_ID"
          columns={columns}
          loading={isLoading}
          pagination={false}
          size="middle"
        />
      </div>

      <CreateVoucherModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={isCreating}
      />
    </div>
  );
};

export default AdminVouchersPage;
