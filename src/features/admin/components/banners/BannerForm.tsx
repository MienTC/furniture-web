import React from 'react';
import { Input, Select, Switch, InputNumber, Row, Col } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import UWrapperInput from '~/components/ui/uwrapper-input';
import UImageUpload from '~/components/ui/uimage-upload';
import { BannerLinkPicker } from './BannerLinkPicker';

export interface BannerFormValues {
  title: string;
  subtitle?: string;
  badge_text?: string;
  highlights?: string;
  link_url?: string;
  image_url?: string;
  type: 'hero' | 'showcase' | 'trustbar' | 'promo_img4';
  sort_order: number;
  is_active: boolean;
}

export const BannerForm: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<BannerFormValues>();

  const currentType = watch('type');

  const getImageHelpText = () => {
    switch (currentType) {
      case 'hero':
        return 'Tỉ lệ khuyến nghị 21:9 hoặc 16:7 (1920x600px - 1920x800px)';
      case 'showcase':
        return 'Tỉ lệ khuyến nghị 16:9 (1280x720px hoặc 1920x1080px)';
      case 'promo_img4':
        return 'Tỉ lệ khuyến nghị 4:3 hoặc 16:9';
      case 'trustbar':
        return 'Biểu tượng hoặc hình minh họa nhỏ (tùy chọn)';
      default:
        return 'Định dạng hình ảnh rõ nét (PNG, JPG, WebP)';
    }
  };

  const getImageAspectRatio = (): 'banner' | 'video' | 'square' | 'auto' => {
    if (currentType === 'hero') return 'banner';
    if (currentType === 'showcase') return 'video';
    if (currentType === 'trustbar') return 'auto';
    return 'banner';
  };

  return (
    <div className="py-2 font-sans space-y-4">
      {/* Khối 1: Cấu hình phân loại & Vị trí */}
      <div className="bg-stone-50/60 p-3.5 rounded-xl border border-stone-200/80">
        <Row gutter={[16, 12]} align="middle">
          <Col span={10}>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Vui lòng chọn vị trí hiển thị' }}
              render={({ field }) => (
                <UWrapperInput label="Vị trí hiển thị" required error={errors.type?.message}>
                  <Select
                    {...field}
                    className="w-full !h-9.5"
                    options={[
                      { value: 'hero', label: 'Banner chính đầu trang (Hero Carousel)' },
                      { value: 'showcase', label: 'Bộ Sưu Tập Nổi Bật (Featured Showcase)' },
                      { value: 'trustbar', label: 'Cam Kết & Dịch Vụ (Trust Bar)' },
                      { value: 'promo_img4', label: 'Quảng Bá Ưu Đãi (Promo Section)' },
                    ]}
                  />
                </UWrapperInput>
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="sort_order"
              control={control}
              render={({ field }) => (
                <UWrapperInput label="Thứ tự ưu tiên">
                  <InputNumber
                    {...field}
                    value={field.value ?? 0}
                    min={0}
                    max={999}
                    step={1}
                    className="w-full !h-9.5 !rounded-lg"
                    placeholder="0"
                  />
                </UWrapperInput>
              )}
            />
          </Col>

          <Col span={8}>
            <Controller
              name="is_active"
              control={control}
              render={({ field: { value, onChange } }) => (
                <UWrapperInput label="Trạng thái hiển thị">
                  <div className="flex items-center gap-2.5 h-9.5 px-1">
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className={value ? '!bg-[#2B5A50]' : undefined}
                    />
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        value
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {value ? 'Bật (Đang hiển thị)' : 'Tắt (Tạm ẩn)'}
                    </span>
                  </div>
                </UWrapperInput>
              )}
            />
          </Col>
        </Row>
      </div>

      {/* Khối 2: Tiêu đề chính */}
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Vui lòng nhập tiêu đề banner' }}
        render={({ field }) => (
          <UWrapperInput label="Tiêu đề chính" required error={errors.title?.message}>
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder="Ví dụ: Sinh nhật Phê Decor - SALE ĐẬM TẶNG ĐÃ!"
              className="!rounded-lg !py-2 font-medium"
              status={errors.title ? 'error' : undefined}
            />
          </UWrapperInput>
        )}
      />

      {/* Khối 3: Bộ chọn Đích đến liên kết thông minh 1-Click (Không bắt nhớ hay gõ tay URL) */}
      <Controller
        name="link_url"
        control={control}
        render={({ field }) => (
          <UWrapperInput
            label="Đích đến khi bấm vào Banner (Liên kết điều hướng)"
            help="Chọn sẵn theo danh mục, trang Flash Sale hoặc sản phẩm cụ thể mà không cần nhớ đường dẫn."
          >
            <BannerLinkPicker
              value={field.value}
              onChange={field.onChange}
            />
          </UWrapperInput>
        )}
      />

      {/* Khối 3: Hình ảnh Banner rộng rãi, không bị ép hẹp */}
      <div>
        <Controller
          name="image_url"
          control={control}
          render={({ field: { onChange, value } }) => (
            <UWrapperInput
              label="Hình ảnh Banner"
              help={getImageHelpText()}
            >
              <UImageUpload
                value={value || null}
                onChange={(v) => onChange(v || '')}
                aspectRatio={getImageAspectRatio()}
                placeholderText="Tải file ảnh lên từ máy tính (tự động nén tối ưu) hoặc dán URL"
              />
            </UWrapperInput>
          )}
        />
      </div>

      {/* Khối 4: Mô tả phụ & Huy hiệu */}
      <Row gutter={[16, 12]}>
        <Col span={currentType === 'showcase' ? 15 : 24}>
          <Controller
            name="subtitle"
            control={control}
            render={({ field }) => (
              <UWrapperInput label="Mô tả phụ (Subtitle / Slogan)">
                <Input.TextArea
                  {...field}
                  value={field.value ?? ''}
                  rows={2}
                  placeholder="Nhập câu mô tả ngắn làm nổi bật thông điệp của banner..."
                  className="!rounded-lg !py-2"
                />
              </UWrapperInput>
            )}
          />
        </Col>

        {currentType === 'showcase' && (
          <Col span={9}>
            <Controller
              name="badge_text"
              control={control}
              render={({ field }) => (
                <UWrapperInput label="Nhãn huy hiệu (Badge Text)">
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Ví dụ: ƯU ĐÃI ĐẾN 30%"
                    className="!rounded-lg !py-2"
                  />
                </UWrapperInput>
              )}
            />
          </Col>
        )}

        {/* Khối 5: Điểm nổi bật riêng cho Showcase */}
        {currentType === 'showcase' && (
          <Col span={24}>
            <Controller
              name="highlights"
              control={control}
              render={({ field }) => (
                <UWrapperInput
                  label="Các điểm nổi bật (Highlights)"
                  help="Mỗi dòng là một cam kết hoặc ưu điểm sản phẩm"
                >
                  <Input.TextArea
                    {...field}
                    value={field.value ?? ''}
                    rows={3}
                    placeholder={'Gỗ sồi & óc chó Bắc Âu tự nhiên\nDa bò thuộc Ý cao cấp độ bền 15 năm\nMiễn phí vận chuyển & lắp đặt tại nhà'}
                    className="!rounded-lg !py-2"
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

export default BannerForm;
