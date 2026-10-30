import React from 'react';
import { Modal, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { CreateOrderForm } from './CreateOrderForm';
import type { AdminCreateOrderPayload } from '~/types';

interface CreateOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: AdminCreateOrderPayload) => Promise<void>;
  loading?: boolean;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const formId = 'admin-create-order-form';

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={
        <div className="flex items-center gap-2 text-stone-800 text-base font-bold pb-2 border-b border-stone-100">
          <ShoppingOutlined className="text-[#2B5A50]" />
          <span>Tạo Đơn Hàng Mới (Cho Khách Quen / Đặt Ngoại Tuyến)</span>
        </div>
      }
      width={760}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading} className="!rounded-lg">
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          form={formId}
          htmlType="submit"
          loading={loading}
          className="!bg-[#2B5A50] hover:!bg-[#20453D] !rounded-lg !font-semibold cursor-pointer"
        >
          Xác Nhận Tạo Đơn
        </Button>,
      ]}
      centered
      destroyOnClose
    >
      <div className="pt-3 max-h-[68vh] overflow-y-auto pr-1 custom-scrollbar">
        <CreateOrderForm id={formId} onSubmit={onSubmit} />
      </div>
    </Modal>
  );
};

export default CreateOrderModal;
