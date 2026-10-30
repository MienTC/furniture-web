import React from 'react';
import { Modal, Button } from 'antd';
import { IconTicket } from '@tabler/icons-react';
import { CreateVoucherForm, type CreateVoucherFormValues } from './CreateVoucherForm';

interface CreateVoucherModalProps {
  open: boolean;
  initialData?: any;
  onCancel: () => void;
  onSubmit: (values: CreateVoucherFormValues) => Promise<void>;
  loading?: boolean;
}

export const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  open,
  initialData,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const formId = 'admin-create-voucher-form';
  const isEditing = Boolean(initialData);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 font-bold text-base text-gray-900 pb-2 border-b border-stone-100">
          <IconTicket size={20} className="text-[#2B5A50]" />
          <span>{isEditing ? 'Chỉnh Sửa Voucher Giảm Giá' : 'Tạo Mới Voucher Giảm Giá'}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={580}
      centered
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading} className="!rounded-lg !h-9 !px-4">
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          form={formId}
          htmlType="submit"
          loading={loading}
          className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !h-9 !px-5 !rounded-lg cursor-pointer"
        >
          {isEditing ? 'Lưu thay đổi' : 'Tạo voucher'}
        </Button>,
      ]}
    >
      <div className="mt-2 max-h-[68vh] overflow-y-auto px-1 pr-1 custom-scrollbar">
        <CreateVoucherForm id={formId} initialData={initialData} onSubmit={onSubmit} />
      </div>
    </Modal>
  );
};

export default CreateVoucherModal;
