import React, { useState } from 'react';
import {
  Tabs,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Button,
  Tag,
  Tooltip,
} from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import {
  StarOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import UWrapperInput from '~/components/ui/uwrapper-input';
import UImageUpload from '~/components/ui/uimage-upload';
import WysiwygEditor, { normalizeVideoUrl } from '~/components/ui/WysiwygEditor';
import type { ProductFormValues } from '~/types';

export interface ProductFormProps {
  categories: Array<{ id: string; name: string }>;
}

export const ProductForm: React.FC<ProductFormProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [newUploadedUrl, setNewUploadedUrl] = useState<string | null>(null);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const currentImages = watch('images') || [];
  const watchVideoUrl = watch('videoUrl') || '';
  const embedVideoUrl = normalizeVideoUrl(watchVideoUrl);

  const handleAddUploadedImage = (url: string) => {
    if (url) {
      setValue('images', [...currentImages, url], { shouldValidate: true });
      setNewUploadedUrl(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = currentImages.filter((_, i) => i !== index);
    setValue('images', updated, { shouldValidate: true });
  };

  const handleSetPrimaryImage = (index: number) => {
    const selected = currentImages[index];
    const rest = currentImages.filter((_, i) => i !== index);
    setValue('images', [selected, ...rest], { shouldValidate: true });
  };

  return (
    <div className="py-2 font-sans">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'info',
            label: (
              <span className="flex items-center gap-1.5 font-medium">
                <InfoCircleOutlined /> Thông Tin & Giá Bán
              </span>
            ),
            children: (
              <div className="py-2">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: 'Vui lòng nhập tên sản phẩm' }}
                      render={({ field }) => (
                        <UWrapperInput label="Tên sản phẩm" required error={errors.name?.message}>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nhập tên sản phẩm..."
                            className="!rounded-lg !py-2 !w-full"
                            style={{ width: '100%' }}
                            status={errors.name ? 'error' : undefined}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={12}>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{ required: 'Vui lòng chọn danh mục' }}
                      render={({ field }) => (
                        <UWrapperInput label="Danh mục sản phẩm" required error={errors.categoryId?.message}>
                          <Select
                            {...field}
                            value={field.value || undefined}
                            placeholder="Chọn danh mục"
                            className="w-full !h-10"
                            style={{ width: '100%' }}
                            status={errors.categoryId ? 'error' : undefined}
                          >
                            {categories.map((c) => (
                              <Select.Option key={c.id} value={c.id}>
                                {c.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={12}>
                    <Controller
                      name="stockQuantity"
                      control={control}
                      rules={{
                        required: 'Vui lòng nhập số lượng tồn kho',
                        min: { value: 0, message: 'Số lượng không được âm' },
                      }}
                      render={({ field }) => (
                        <UWrapperInput label="Số lượng tồn kho" required error={errors.stockQuantity?.message}>
                          <InputNumber
                            {...field}
                            value={field.value ?? 0}
                            min={0}
                            placeholder="Nhập số lượng tồn kho"
                            className="!w-full !rounded-lg !h-10 flex items-center"
                            style={{ width: '100%' }}
                            status={errors.stockQuantity ? 'error' : undefined}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={12}>
                    <Controller
                      name="price"
                      control={control}
                      rules={{
                        required: 'Vui lòng nhập giá bán thực tế',
                        min: { value: 1000, message: 'Giá bán phải từ 1.000₫ trở lên' },
                      }}
                      render={({ field }) => (
                        <UWrapperInput label="Giá bán thực tế (VNĐ)" required error={errors.price?.message}>
                          <InputNumber
                            {...field}
                            value={field.value ?? 0}
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => (val ? Number(val.replace(/,/g, '')) : 0)}
                            placeholder="Nhập giá bán (₫)"
                            className="!w-full !rounded-lg !h-10 flex items-center"
                            style={{ width: '100%' }}
                            status={errors.price ? 'error' : undefined}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={12}>
                    <Controller
                      name="originalPrice"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput
                          label="Giá niêm yết gốc (nếu có khuyến mãi)"
                          help="Để gạch giá nếu sản phẩm có ưu đãi giảm giá"
                        >
                          <InputNumber
                            {...field}
                            value={field.value ?? 0}
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => (val ? Number(val.replace(/,/g, '')) : 0)}
                            placeholder="Nhập giá gốc niêm yết (₫)"
                            className="!w-full !rounded-lg !h-10 flex items-center"
                            style={{ width: '100%' }}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={8}>
                    <Controller
                      name="material"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput label="Chất liệu">
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nhập chất liệu sản phẩm"
                            className="!rounded-lg !py-2"
                            style={{ width: '100%' }}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={8}>
                    <Controller
                      name="dimensions"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput label="Kích thước">
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nhập kích thước (D x R x C)"
                            className="!rounded-lg !py-2"
                            style={{ width: '100%' }}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={8}>
                    <Controller
                      name="origin"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput label="Xuất xứ">
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nhập xuất xứ sản phẩm"
                            className="!rounded-lg !py-2"
                            style={{ width: '100%' }}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col xs={24} sm={8}>
                    <Controller
                      name="warranty"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput label="Chính sách bảo hành">
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nhập thời gian bảo hành"
                            className="!rounded-lg !py-2"
                            style={{ width: '100%' }}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'media',
            label: (
              <span className="flex items-center gap-1.5 font-medium">
                <PictureOutlined /> Hình Ảnh Sản Phẩm ({currentImages.length})
              </span>
            ),
            children: (
              <div className="py-2 space-y-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-xs text-stone-900 m-0">
                      Tải lên hình ảnh sản phẩm thực tế từ máy tính
                    </p>
                    <p className="text-[11px] text-stone-500 m-0">
                      Ảnh đầu tiên sẽ là ảnh đại diện hiển thị ra cửa hàng. Hỗ trợ định dạng JPG, PNG, WebP (Tối đa 5MB).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <UImageUpload
                      value={newUploadedUrl}
                      onChange={(url) => {
                        setNewUploadedUrl(url);
                        if (url) handleAddUploadedImage(url);
                      }}
                      className="!w-32 !h-10"
                    />
                  </div>
                </div>

                {currentImages.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-white text-stone-400 text-xs">
                    Chưa có hình ảnh nào được tải lên cho sản phẩm này. Hãy chọn ảnh tải lên ở khung phía trên.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {currentImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl border border-stone-200 overflow-hidden bg-white aspect-square shadow-2xs hover:shadow-md transition-all"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {idx === 0 && (
                          <div className="absolute top-2 left-2 z-10">
                            <Tag color="cyan" className="font-bold text-[10px] m-0 !border-none !shadow-xs">
                              Ảnh đại diện
                            </Tag>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {idx !== 0 && (
                            <Tooltip title="Đặt làm ảnh đại diện">
                              <Button
                                type="primary"
                                size="small"
                                shape="circle"
                                icon={<StarOutlined />}
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="!bg-[#FFCA88] hover:!bg-[#e5b370] !border-none text-stone-900"
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Xóa ảnh này">
                            <Button
                              danger
                              type="primary"
                              size="small"
                              shape="circle"
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveImage(idx)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'video',
            label: (
              <span className="flex items-center gap-1.5 font-medium">
                <VideoCameraOutlined /> Video Trải Nghiệm
              </span>
            ),
            children: (
              <div className="py-2 space-y-4">
                <Controller
                  name="videoUrl"
                  control={control}
                  render={({ field }) => (
                    <UWrapperInput
                      label="Đường dẫn Video Review / Trải nghiệm sản phẩm"
                      help="Hỗ trợ link YouTube, YouTube Shorts hoặc link file video trực tiếp."
                    >
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Nhập link video YouTube (ví dụ: https://www.youtube.com/watch?v=...)"
                        className="!rounded-lg !py-2"
                        style={{ width: '100%' }}
                      />
                    </UWrapperInput>
                  )}
                />

                {embedVideoUrl ? (
                  <div className="rounded-xl overflow-hidden border border-stone-200 bg-black aspect-video max-w-lg mx-auto shadow-md">
                    <iframe
                      src={embedVideoUrl}
                      title="Video preview"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 text-stone-400 text-xs">
                    Nhập đường link video hợp lệ phía trên để xem trước video tại đây.
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'desc',
            label: (
              <span className="flex items-center gap-1.5 font-medium">
                <FileTextOutlined /> Mô Tả Chi Tiết
              </span>
            ),
            children: (
              <div className="py-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <UWrapperInput
                      label="Nội dung bài viết giới thiệu sản phẩm"
                      help="Trình soạn thảo hỗ trợ chèn ảnh, video, danh sách ưu điểm và định dạng văn bản."
                    >
                      <WysiwygEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Mô tả chi tiết kiểu dáng, chất lượng vật liệu, công năng và hướng dẫn sử dụng..."
                      />
                    </UWrapperInput>
                  )}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
