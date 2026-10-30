import React, { useState } from 'react';
import { Table, Button, Tooltip } from 'antd';
import { IconPlus, IconTrash, IconTicket, IconEdit } from '@tabler/icons-react';
import { useAdminVouchers } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UBadge from '~/components/ui/ubadge';
import UButtonCopy from '~/components/ui/ubutton-copy';
import UAlertDialog from '~/components/ui/ualert-dialog';
import { formatVND } from '~/common/utils/formatters';
import { CreateVoucherModal, type CreateVoucherFormValues } from '~/features/admin/components/vouchers';

export const AdminVouchersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);

  const {
    vouchers,
    isLoading,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminVouchers();

  const handleOpenCreate = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (voucher: any) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: CreateVoucherFormValues) => {
    if (editingVoucher) {
      await updateVoucher({
        id: editingVoucher.s_ID,
        payload: values,
      });
    } else {
      await createVoucher(values);
    }
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const columns = [
    {
      title: 'Mã Giảm Giá',
      dataIndex: 'code',
      render: (code: string, row: any) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#2B5A50]/10 text-[#2B5A50]">
            <IconTicket size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-gray-900">{code}</span>
              <UButtonCopy copyValue={code} />
            </div>
            <p className="text-[11px] text-gray-400 m-0">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mức Giảm',
      dataIndex: 'discount_value',
      render: (val: number, row: any) => (
        <UBadge color="green">
          {row.discount_type === 'percentage' ? `Giảm ${val}%` : `Giảm ${formatVND(val)}`}
        </UBadge>
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
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Chỉnh sửa voucher">
            <Button
              size="small"
              type="text"
              icon={<IconEdit size={16} className="text-sky-600" />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <UAlertDialog
            title="Xác nhận xóa voucher?"
            description={`Bạn có chắc chắn muốn xóa mã giảm giá "${record.code}" không?`}
            onDelete={() => deleteVoucher(record.s_ID)}
            loading={isDeleting}
            iconChildren={<IconTrash size={16} className="text-rose-500" />}
            titleTooltip="Xóa voucher"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans w-full">
      <UBreadcrumb
        title="Quản Lý Voucher Giảm Giá"
        trailing={
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleOpenCreate}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !h-9 !px-4 !rounded-lg !shadow-xs cursor-pointer"
          >
            Tạo voucher mới
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 w-full flex flex-col">
        <Table
          dataSource={vouchers}
          rowKey="s_ID"
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t) => `Tổng số ${t} voucher`,
          }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>

      <CreateVoucherModal
        open={isModalOpen}
        initialData={editingVoucher}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingVoucher(null);
        }}
        onSubmit={handleFormSubmit}
        loading={isCreating || isUpdating}
      />
    </div>
  );
};

export default AdminVouchersPage;
