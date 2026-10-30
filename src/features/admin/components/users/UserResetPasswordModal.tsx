import React from 'react';
import { Modal, Flex, Button, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import UWrapperInput from '~/components/ui/uwrapper-input';
import type { AdminUserResetPasswordPayload } from '~/types';

export interface UserResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (data: AdminUserResetPasswordPayload) => Promise<void>;
  loading?: boolean;
}

export const UserResetPasswordModal: React.FC<UserResetPasswordModalProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUserResetPasswordPayload>({
    defaultValues: {
      newPassword: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onInternalSubmit = async (values: AdminUserResetPasswordPayload) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Modal
      title={`Đặt Lại Mật Khẩu: ${user?.s_user || user?.name || ''}`}
      open={open}
      onCancel={handleClose}
      centered
      destroyOnClose
      width={420}
      footer={null}
    >
      <form onSubmit={handleSubmit(onInternalSubmit)} className="py-2 font-sans">
        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: 'Vui lòng nhập mật khẩu mới',
            minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          }}
          render={({ field }) => (
            <UWrapperInput label="Mật khẩu mới (tối thiểu 6 ký tự)" required error={errors.newPassword?.message}>
              <Input.Password
                {...field}
                value={field.value ?? ''}
                placeholder="Nhập mật khẩu mới..."
                className="!rounded-lg !py-1.5"
                status={errors.newPassword ? 'error' : undefined}
              />
            </UWrapperInput>
          )}
        />

        <Flex justify="end" gap={8} className="pt-3 border-t border-stone-100 mt-4">
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold"
          >
            Cập nhật mật khẩu mới
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};
