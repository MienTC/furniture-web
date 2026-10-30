import React, { useEffect } from 'react';
import { Modal, Flex, Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { UserEditForm } from './UserEditForm';
import type { AdminUserUpdatePayload } from '~/types';

export interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (data: AdminUserUpdatePayload) => Promise<void>;
  loading?: boolean;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading = false,
}) => {
  const formMethods = useForm<AdminUserUpdatePayload>({
    defaultValues: {
      s_user: '',
      phone: '',
      role: 'customer',
    },
  });

  useEffect(() => {
    if (open && user) {
      formMethods.reset({
        s_user: user.s_user || user.name || '',
        phone: user.phone || '',
        role: user.role || 'customer',
      });
    }
  }, [open, user, formMethods]);

  const handleClose = () => {
    formMethods.reset();
    onClose();
  };

  const onInternalSubmit = async (values: AdminUserUpdatePayload) => {
    await onSubmit(values);
  };

  return (
    <Modal
      title="Chỉnh Sửa Thông Tin Người Dùng"
      open={open}
      onCancel={handleClose}
      centered
      destroyOnClose
      width={460}
      footer={null}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onInternalSubmit)}>
          <UserEditForm />
          <Flex justify="end" gap={8} className="pt-3 border-t border-stone-100 mt-4">
            <Button onClick={handleClose} disabled={loading}>
              Đóng
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold"
            >
              Lưu thay đổi
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Modal>
  );
};
