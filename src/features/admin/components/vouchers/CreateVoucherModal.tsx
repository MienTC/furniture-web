import React from 'react';
import { Modal, Button } from 'antd';
import { IconTicket } from '@tabler/icons-react';
import { CreateVoucherForm, type CreateVoucherFormValues } from './CreateVoucherForm';

interface CreateVoucherModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateVoucherFormValues) => Promise<void>;
  loading?: boolean;
}

export const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const formId = 'admin-create-voucher-form';

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 font-bold text-base text-gray-900">
          <IconTicket size={20} className="text-brand-coral" />
          <span>Tạo Mới Voucher Giảm Giá</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={640}
      centered
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading} className="!rounded-lg !h-10 !px-5">
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          form={formId}
          htmlType="submit"
          loading={loading}
          className="!bg-brand-coral hover:!bg-[#c95f5f] !font-bold !h-10 !px-6 !rounded-lg cursor-pointer"
        >
          Tạo voucher
        </Button>,
      ]}
    >
      <div className="mt-4">
        <CreateVoucherForm id={formId} onSubmit={onSubmit} />
      </div>
    </Modal>
  );
};

export default CreateVoucherModal;
