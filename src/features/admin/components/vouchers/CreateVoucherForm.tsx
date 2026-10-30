import React, { useEffect } from 'react';
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
  initialData?: any;
  onSubmit: (values: CreateVoucherFormValues) => Promise<void>;
}

export const CreateVoucherForm: React.FC<CreateVoucherFormProps> = ({
  id = 'create-voucher-form',
  initialData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
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

  const discountType = watch('discount_type');

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code || '',
        name: initialData.name || '',
        discount_type: initialData.discount_type || 'percentage',
        discount_value: initialData.discount_value || 10,
        min_order_value: initialData.min_order_value || 0,
        usage_limit: initialData.usage_limit || 100,
      });
    } else {
      reset({
        code: '',
        name: '',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_value: 0,
        usage_limit: 100,
      });
    }
  }, [initialData, reset]);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="font-semibold text-xs text-stone-700 block mb-1">
            Mã voucher (Viết hoa liền không dấu) *
          </label>
          <Controller
            name="code"
            control={control}
            rules={{ required: 'Vui lòng nhập mã code' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="VD: LUXDECOR20, SALE500K..."
                className="!h-9 !rounded-lg font-mono uppercase font-bold !w-full"
                style={{ width: '100%' }}
                status={errors.code ? 'error' : undefined}
                onChange={(e) => field.onChange(e.target.value.toUpperCase().trim())}
              />
            )}
          />
          {errors.code && (
            <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.code.message}</span>
          )}
        </div>

        <div>
          <label className="font-semibold text-xs text-stone-700 block mb-1">
            Tên chương trình voucher *
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Vui lòng nhập tên chương trình' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="VD: Khai xuân giảm 20%, Tri ân khách hàng..."
                className="!h-9 !rounded-lg !w-full"
                style={{ width: '100%' }}
                status={errors.name ? 'error' : undefined}
              />
            )}
          />
          {errors.name && (
            <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.name.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="font-semibold text-xs text-stone-700 block mb-1">
            Loại hình giảm giá
          </label>
          <Controller
            name="discount_type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full !h-9"
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
          <label className="font-semibold text-xs text-stone-700 block mb-1">
            Mức giảm giá *
          </label>
          <Controller
            name="discount_value"
            control={control}
            rules={{ required: 'Vui lòng nhập mức giảm' }}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="!w-full !h-9 !rounded-lg"
                style={{ width: '100%' }}
                min={1}
                max={discountType === 'percentage' ? 100 : 1000000000}
                addonAfter={discountType === 'percentage' ? '%' : 'VNĐ'}
                placeholder={discountType === 'percentage' ? 'VD: 15' : 'VD: 300,000'}
                formatter={(val) =>
                  discountType === 'percentage'
                    ? `${val}`
                    : `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(val) =>
                  Number(val?.replace(/\$\s?|(,*)/g, '') || 0)
                }
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="font-semibold text-xs text-stone-700 block mb-1">
            Giá trị đơn tối thiểu áp dụng
          </label>
          <Controller
            name="min_order_value"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="!w-full !h-9 !rounded-lg"
                style={{ width: '100%' }}
                min={0}
                step={100000}
                addonAfter="VNĐ"
                placeholder="VD: 1,000,000"
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(val) => Number(val?.replace(/\$\s?|(,*)/g, '') || 0)}
              />
            )}
          />
          <span className="text-[11px] text-stone-400 mt-1 block">
            Để 0 đ nếu áp dụng cho mọi giá trị đơn hàng
          </span>
        </div>

        <div>
          <label className="font-semibold text-xs text-stone-700 block mb-1">
            Tổng số lượt sử dụng tối đa
          </label>
          <Controller
            name="usage_limit"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="!w-full !h-9 !rounded-lg"
                style={{ width: '100%' }}
                min={1}
                addonAfter="lượt"
                placeholder="VD: 100"
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(val) => Number(val?.replace(/\$\s?|(,*)/g, '') || 0)}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateVoucherForm;
