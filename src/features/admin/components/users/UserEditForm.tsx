import React from 'react';
import { Input, Select, Flex } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import UWrapperInput from '~/components/ui/uwrapper-input';
import type { AdminUserUpdatePayload } from '~/types';

export const UserEditForm: React.FC = () => {
  const { control } = useFormContext<AdminUserUpdatePayload>();

  return (
    <Flex vertical gap={14} className="py-2 font-sans">
      <Controller
        name="s_user"
        control={control}
        render={({ field }) => (
          <UWrapperInput label="Tên người dùng (Username)">
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder="Nhập tên người dùng..."
              className="!rounded-lg !py-1.5"
            />
          </UWrapperInput>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <UWrapperInput label="Số điện thoại">
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder="Nhập số điện thoại..."
              className="!rounded-lg !py-1.5"
            />
          </UWrapperInput>
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <UWrapperInput label="Vai trò tài khoản">
            <Select
              {...field}
              value={field.value ?? 'customer'}
              className="w-full !h-9"
              options={[
                { value: 'customer', label: 'Khách hàng (Customer)' },
                { value: 'admin', label: 'Quản trị viên (Admin)' },
              ]}
            />
          </UWrapperInput>
        )}
      />
    </Flex>
  );
};
