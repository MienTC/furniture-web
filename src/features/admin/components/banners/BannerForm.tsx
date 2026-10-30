import React from 'react';
import { Input, Select, Switch, Row, Col } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import UWrapperInput from '~/components/ui/uwrapper-input';
import UImageUpload from '~/components/ui/uimage-upload';

export interface BannerFormValues {
  title: string;
  subtitle?: string;
  badge_text?: string;
  highlights?: string;
  link_url?: string;
  image_url?: string;
  type: 'hero' | 'showcase' | 'trust_bar';
  is_active: boolean;
}

export const BannerForm: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<BannerFormValues>();

  const currentType = watch('type');

  return (
    <div className="py-1 font-sans">
      <Row gutter={[16, 12]}>
        {/* Hàng 1: Vị trí hiển thị & Trạng thái */}
        <Col span={14}>
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Vui lòng chọn phân loại banner' }}
            render={({ field }) => (
              <UWrapperInput label="Vị trí hiển thị" required error={errors.type?.message}>
                <Select
                  {...field}
                  className="w-full !h-9"
                  options={[
                    { value: 'hero', label: 'Banner chính đầu trang (Hero Carousel)' },
                    { value: 'showcase', label: 'Bộ Sưu Tập Nổi Bật (Featured Showcase)' },
                    { value: 'trust_bar', label: 'Cam Kết & Dịch Vụ (Trust Bar)' },
                  ]}
                />
              </UWrapperInput>
            )}
          />
        </Col>

        <Col span={10}>
          <Controller
            name="is_active"
            control={control}
            render={({ field: { value, onChange } }) => (
              <UWrapperInput label="Trạng thái">
                <div className="flex items-center gap-2 h-9">
                  <Switch checked={value} onChange={onChange} />
                  <span className="text-xs text-stone-700 font-medium">
                    {value ? 'Đang kích hoạt' : 'Tạm ẩn'}
                  </span>
                </div>
              </UWrapperInput>
            )}
          />
        </Col>

        {/* Hàng 2: Ảnh bên trái, Tiêu đề + Link bên phải */}
        <Col span={8}>
          <Controller
            name="image_url"
            control={control}
            render={({ field: { onChange, value } }) => (
              <UWrapperInput
                label="Hình ảnh banner"
                help={currentType === 'hero' ? 'Tỉ lệ ngang 1920x600' : 'Tỉ lệ 1000x800'}
              >
                <UImageUpload value={value || null} onChange={(v) => onChange(v || '')} className="!w-full !h-28" />
              </UWrapperInput>
            )}
          />
        </Col>

        <Col span={16}>
          <div className="flex flex-col gap-2.5">
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Vui lòng nhập tiêu đề banner' }}
              render={({ field }) => (
                <UWrapperInput label="Tiêu đề chính" required error={errors.title?.message}>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Nhập tiêu đề chính..."
                    className="!rounded-lg !py-1.5"
                    status={errors.title ? 'error' : undefined}
                  />
                </UWrapperInput>
              )}
            />

            <Controller
              name="link_url"
              control={control}
              render={({ field }) => (
                <UWrapperInput label="Đường dẫn liên kết">
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="/products hoặc /products?category=sofa"
                    className="!rounded-lg !py-1.5"
                  />
                </UWrapperInput>
              )}
            />
          </div>
        </Col>

        {/* Hàng 3: Mô tả phụ & Huy hiệu */}
        <Col span={currentType === 'showcase' ? 14 : 24}>
          <Controller
            name="subtitle"
            control={control}
            render={({ field }) => (
              <UWrapperInput label="Mô tả phụ (Subtitle)">
                <Input.TextArea
                  {...field}
                  value={field.value ?? ''}
                  rows={2}
                  placeholder="Nhập mô tả phụ..."
                  className="!rounded-lg"
                />
              </UWrapperInput>
            )}
          />
        </Col>

        {currentType === 'showcase' && (
          <Col span={10}>
            <Controller
              name="badge_text"
              control={control}
              render={({ field }) => (
                <UWrapperInput label="Nhãn huy hiệu (Badge)">
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Ví dụ: BỘ SƯU TẬP 2026"
                    className="!rounded-lg !py-1.5"
                  />
                </UWrapperInput>
              )}
            />
          </Col>
        )}

        {currentType === 'showcase' && (
          <Col span={24}>
            <Controller
              name="highlights"
              control={control}
              render={({ field }) => (
                <UWrapperInput
                  label="Điểm nổi bật (mỗi dòng một ý)"
                  help="Các điểm nhấn sản phẩm (gỗ tự nhiên, bảo hành 5 năm...)"
                >
                  <Input.TextArea
                    {...field}
                    value={field.value ?? ''}
                    rows={2}
                    placeholder="Gỗ tự nhiên nguyên khối&#10;Động cơ nhập khẩu&#10;Bảo hành 5 năm"
                    className="!rounded-lg"
                  />
                </UWrapperInput>
              )}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};
