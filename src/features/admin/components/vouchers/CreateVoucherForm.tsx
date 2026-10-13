import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, InputNumber, Select } from 'antd';

export interface CreateVoucherFormValues {
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  usage_limit?: number;
}

interface CreateVoucherFormProps {
  id?: string;
  onSubmit: (values: CreateVoucherFormValues) => Promise<void>;
}

export const CreateVoucherForm: React.FC<CreateVoucherFormProps> = ({
  id = 'create-voucher-form',
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVoucherFormValues>({
    defaultValues: {
      code: '',
      name: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_value: 0,
      usage_limit: 100,
    },
  });

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-xs text-gray-700 block mb-1">
            Mã code (Viết hoa) *
          </label>
          <Controller
            name="code"
            control={control}
            rules={{ required: 'Nhập mã code' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="VÍ DỤ: LUXDECOR20"
                className="!h-10 !rounded-lg font-mono uppercase font-semibold !w-full"
                style={{ width: '100%' }}
                status={errors.code ? 'error' : undefined}
              />
            )}
          />
          {errors.code && (
            <span className="text-[11px] text-rose-500">{errors.code.message}</span>
          )}
        </div>

        <div>
          <label className="font-semibold text-xs text-gray-700 block mb-1">
            Tên chương trình *
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Nhập tên' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ví dụ: Giảm giá khai trương"
                className="!h-10 !rounded-lg !w-full"
                style={{ width: '100%' }}
                status={errors.name ? 'error' : undefined}
              />
            )}
          />
          {errors.name && (
            <span className="text-[11px] text-rose-500">{errors.name.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-xs text-gray-700 block mb-1">
            Loại giảm giá
          </label>
          <Controller
            name="discount_type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full !h-10"
                style={{ width: '100%' }}
                options={[
                  { value: 'percentage', label: 'Theo phần trăm (%)' },
                  { value: 'fixed', label: 'Số tiền cố định (VNĐ)' },
                ]}
              />
            )}
          />
        </div>

        <div>
          <label className="font-semibold text-xs text-gray-700 block mb-1">
            Giá trị giảm *
          </label>
          <Controller
            name="discount_value"
            control={control}
            rules={{ required: 'Nhập mức giảm' }}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="!w-full !h-10 !rounded-lg"
                style={{ width: '100%' }}
                min={1}
                placeholder="Ví dụ: 10 hoặc 200,000"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-xs text-gray-700 block mb-1">
            Đơn tối thiểu (VNĐ)
          </label>
          <Controller
            name="min_order_value"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="!w-full !h-10 !rounded-lg"
                style={{ width: '100%' }}
                min={0}
                placeholder="Ví dụ: 500,000"
              />
            )}
          />
        </div>

        <div>
          <label className="font-semibold text-xs text-gray-700 block mb-1">
            Giới hạn lượt dùng
          </label>
          <Controller
            name="usage_limit"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="!w-full !h-10 !rounded-lg"
                style={{ width: '100%' }}
                min={1}
                placeholder="Ví dụ: 100"
              />
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateVoucherForm;
