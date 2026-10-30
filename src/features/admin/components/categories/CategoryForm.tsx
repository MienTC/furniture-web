import React from 'react';
import { Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import UWrapperInput from '~/components/ui/uwrapper-input';
import UImageUpload from '~/components/ui/uimage-upload';
import type { AdminCategoryPayload } from '~/types';

export const CategoryForm: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdminCategoryPayload>();

  return (
    <div className="py-2 font-sans">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Ảnh đại diện bên trái theo pattern Pet_Manager / tev-fe-admin */}
        <div className="flex-none flex flex-col items-center">
          <Controller
            name="image_url"
            control={control}
            render={({ field: { onChange, value } }) => (
              <UWrapperInput label="Hình ảnh danh mục" help="Tỷ lệ 1:1 rõ nét">
                <UImageUpload value={value || null} onChange={(v) => onChange(v || '')} className="!w-32 !h-32" />
              </UWrapperInput>
            )}
          />
        </div>

        {/* Thông tin bên phải */}
        <div className="flex-1 w-full flex flex-col gap-3">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Vui lòng nhập tên danh mục' }}
            render={({ field }) => (
              <UWrapperInput label="Tên danh mục" required error={errors.name?.message}>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Nhập tên danh mục (ví dụ: Sofa & Ghế, Bàn Ăn...)"
                  className="!rounded-lg !py-1.5"
                  status={errors.name ? 'error' : undefined}
                />
              </UWrapperInput>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <UWrapperInput label="Mô tả danh mục">
                <Input.TextArea
                  {...field}
                  value={field.value ?? ''}
                  rows={2}
                  placeholder="Nhập mô tả ngắn cho danh mục..."
                  className="!rounded-lg"
                />
              </UWrapperInput>
            )}
          />
        </div>
      </div>
    </div>
  );
};
