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
  Table,
  Empty,
  Space,
} from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import {
  StarOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import UWrapperInput from '~/components/ui/uwrapper-input';
import UImageUpload from '~/components/ui/uimage-upload';
import WysiwygEditor, { normalizeVideoUrl } from '~/components/ui/WysiwygEditor';
import CreatableSelect from '~/components/shared/CreatableSelect';
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
  const currentVariants = watch('variants') || [];
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

  const handleAddVariant = (preset?: { name: string; size: string }) => {
    const basePrice = watch('price') || 0;
    const baseOriginalPrice = watch('originalPrice') || 0;
    const newVariant = {
      variant_name: preset?.name || `Phân loại ${currentVariants.length + 1}`,
      size: preset?.size || preset?.name || '',
      material: '',
      color: '',
      sale_price: basePrice,
      list_price: baseOriginalPrice,
      stock_quantity: 10,
    };
    setValue('variants', [...currentVariants, newVariant as any], { shouldValidate: true });
  };

  const handleUpdateVariant = (index: number, field: string, val: any) => {
    const updated = [...currentVariants];
    updated[index] = { ...updated[index], [field]: val };
    setValue('variants', updated, { shouldValidate: true });
  };

  const handleRemoveVariant = (index: number) => {
    const updated = currentVariants.filter((_, i) => i !== index);
    setValue('variants', updated, { shouldValidate: true });
  };

  const variantColumns = [
    {
      title: 'Tên phân loại / Kiểu dáng *',
      dataIndex: 'variant_name',
      key: 'variant_name',
      render: (_: any, record: any, index: number) => (
        <Input
          value={record.variant_name ?? ''}
          onChange={(e) => handleUpdateVariant(index, 'variant_name', e.target.value)}
          placeholder="Ví dụ: Văng đôi 2.1m hoặc 1m6 x 2m"
          className="!rounded-md"
        />
      ),
    },
    {
      title: 'Kích thước chi tiết',
      dataIndex: 'size',
      key: 'size',
      width: 170,
      render: (_: any, record: any, index: number) => (
        <Input
          value={record.size ?? ''}
          onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
          placeholder="Ví dụ: 160 x 200 cm"
          className="!rounded-md"
        />
      ),
    },
    {
      title: 'Giá bán (VNĐ) *',
      dataIndex: 'sale_price',
      key: 'sale_price',
      width: 160,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          value={record.sale_price ?? 0}
          onChange={(val) => handleUpdateVariant(index, 'sale_price', val ?? 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => (val ? Number(val.replace(/,/g, '')) : 0)}
          placeholder="Giá bán (₫)"
          className="!w-full !rounded-md"
        />
      ),
    },
    {
      title: 'Giá niêm yết (VNĐ)',
      dataIndex: 'list_price',
      key: 'list_price',
      width: 160,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          value={record.list_price ?? 0}
          onChange={(val) => handleUpdateVariant(index, 'list_price', val ?? 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => (val ? Number(val.replace(/,/g, '')) : 0)}
          placeholder="Giá niêm yết (₫)"
          className="!w-full !rounded-md"
        />
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      width: 100,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          value={record.stock_quantity ?? 0}
          min={0}
          onChange={(val) => handleUpdateVariant(index, 'stock_quantity', val ?? 0)}
          placeholder="Tồn kho"
          className="!w-full !rounded-md"
        />
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_: any, __: any, index: number) => (
        <Tooltip title="Xóa phân loại này">
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveVariant(index)}
          />
        </Tooltip>
      ),
    },
  ];

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
                        <UWrapperInput label="Chất liệu" help="Chọn hoặc tự gõ thêm chất liệu mới">
                          <CreatableSelect
                            placeholder="Chọn hoặc gõ chất liệu..."
                            value={field.value || undefined}
                            onChange={(val) => field.onChange(val || '')}
                            createPlaceholder="Gõ chất liệu mới..."
                            createBtnText="Thêm"
                            className="!h-10 flex items-center"
                            options={[
                              { value: 'Đệm bọt biển cao cấp, Vải công nghệ', label: 'Đệm bọt biển cao cấp, Vải công nghệ' },
                              { value: 'Gỗ sồi tự nhiên nhập khẩu', label: 'Gỗ sồi tự nhiên nhập khẩu' },
                              { value: 'Gỗ óc chó Bắc Mỹ cao cấp', label: 'Gỗ óc chó Bắc Mỹ cao cấp' },
                              { value: 'Gỗ công nghiệp MDF chống ẩm', label: 'Gỗ công nghiệp MDF chống ẩm' },
                              { value: 'Da Microfiber chống trầy xước', label: 'Da Microfiber chống trầy xước' },
                              { value: 'Da bò tự nhiên Ý nguyên tấm', label: 'Da bò tự nhiên Ý nguyên tấm' },
                              { value: 'Khung thép carbon sơn tĩnh điện', label: 'Khung thép carbon sơn tĩnh điện' },
                              { value: 'Mặt đá Ceramic chống trầy', label: 'Mặt đá Ceramic chống trầy' },
                              { value: 'Mây tre đan tự nhiên cao cấp', label: 'Mây tre đan tự nhiên cao cấp' },
                            ]}
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
                        <UWrapperInput label="Kích thước chung">
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Nhập kích thước (D x R x C)"
                            className="!rounded-lg !py-2 !h-10"
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
                        <UWrapperInput label="Xuất xứ" help="Chọn hoặc tự gõ thêm xuất xứ mới">
                          <CreatableSelect
                            placeholder="Chọn hoặc gõ xuất xứ..."
                            value={field.value || undefined}
                            onChange={(val) => field.onChange(val || '')}
                            createPlaceholder="Gõ xuất xứ mới..."
                            createBtnText="Thêm"
                            className="!h-10 flex items-center"
                            options={[
                              { value: 'Việt Nam (LuxDecor Factory)', label: 'Việt Nam (LuxDecor Factory)' },
                              { value: 'Nhập khẩu Ý (Italy)', label: 'Nhập khẩu Ý (Italy)' },
                              { value: 'Nhập khẩu Đức (Germany)', label: 'Nhập khẩu Đức (Germany)' },
                              { value: 'Nhập khẩu Hàn Quốc', label: 'Nhập khẩu Hàn Quốc' },
                              { value: 'Nhập khẩu Nhật Bản', label: 'Nhập khẩu Nhật Bản' },
                              { value: 'Nhập khẩu Malaysia', label: 'Nhập khẩu Malaysia' },
                              { value: 'Nhập khẩu cao cấp', label: 'Nhập khẩu cao cấp' },
                            ]}
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
                            placeholder="Nhập thời gian bảo hành (ví dụ: Bảo hành 5 năm)"
                            className="!rounded-lg !py-2 !h-10"
                            style={{ width: '100%' }}
                          />
                        </UWrapperInput>
                      )}
                    />
                  </Col>

                  <Col span={24}>
                    <Controller
                      name="colorOptions"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput
                          label="Phân loại Màu sắc sản phẩm"
                          help="Chọn màu có sẵn hoặc gõ màu mới rồi nhấn nút 'Thêm màu' hoặc nhấn Enter (hiển thị để khách chọn ngoài web)"
                        >
                          <CreatableSelect
                            mode="multiple"
                            placeholder="Chọn hoặc tự tạo thêm màu sắc mới..."
                            value={field.value || []}
                            onChange={field.onChange}
                            className="!w-full min-h-[40px]"
                            createPlaceholder="Nhập tên màu mới (ví dụ: Hồng pastel, Xanh olive, Nâu hạt dẻ...)"
                            createBtnText="Thêm màu"
                            options={[
                              { value: 'Trắng kem', label: 'Trắng kem' },
                              { value: 'Be sữa', label: 'Be sữa' },
                              { value: 'Ghi sáng', label: 'Ghi sáng' },
                              { value: 'Xám đậm', label: 'Xám đậm' },
                              { value: 'Nâu da bò', label: 'Nâu da bò' },
                              { value: 'Cam đất', label: 'Cam đất' },
                              { value: 'Xanh rêu', label: 'Xanh rêu' },
                              { value: 'Xanh navy', label: 'Xanh navy' },
                              { value: 'Đen tuyền', label: 'Đen tuyền' },
                              { value: 'Gỗ sồi tự nhiên', label: 'Gỗ sồi tự nhiên' },
                              { value: 'Gỗ óc chó', label: 'Gỗ óc chó' },
                            ]}
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
            key: 'variants',
            label: (
              <span className="flex items-center gap-1.5 font-medium">
                <AppstoreOutlined /> Phân Loại & Biến Thể ({currentVariants.length})
              </span>
            ),
            children: (
              <div className="py-2 space-y-4">
                <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-xs text-sky-950 m-0">
                      Quản lý phân loại kích thước, kiểu dáng & giá bán riêng
                    </p>
                    <p className="text-[11px] text-sky-700 m-0">
                      Cho phép thiết lập các kích thước (1m2, 1m6, 1m8, 2m...) hoặc kiểu dáng (văng đơn, văng đôi, chữ L...) kèm mức giá bán và tồn kho riêng cho từng loại.
                    </p>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddVariant()}
                    className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !h-9 shrink-0 cursor-pointer"
                  >
                    Thêm phân loại
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-stone-500">Gợi ý kích thước nhanh:</span>
                  {[
                    { name: '1m2 x 2m', size: '120 x 200 cm' },
                    { name: '1m4 x 2m', size: '140 x 200 cm' },
                    { name: '1m6 x 2m', size: '160 x 200 cm' },
                    { name: '1m8 x 2m', size: '180 x 200 cm' },
                    { name: '2m x 2m2', size: '200 x 220 cm' },
                    { name: 'Văng đơn 1.5m', size: '150 x 85 x 90 cm' },
                    { name: 'Văng đôi 2.1m', size: '210 x 85 x 90 cm' },
                    { name: 'Bộ góc L 2.8m', size: '280 x 170 x 90 cm' },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      size="small"
                      onClick={() => handleAddVariant(preset)}
                      className="!text-xs !rounded-md cursor-pointer"
                    >
                      + {preset.name}
                    </Button>
                  ))}
                </div>

                {currentVariants.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-white space-y-2">
                    <Empty
                      description="Sản phẩm hiện chưa có phân loại biến thể riêng. Giá bán và số lượng tồn kho sẽ lấy theo thông tin chung ở tab 'Thông Tin & Giá Bán'."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddVariant()}
                      className="!mt-2 cursor-pointer"
                    >
                      Thêm phân loại đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <Table
                      dataSource={currentVariants}
                      columns={variantColumns}
                      rowKey={(_, idx) => String(idx)}
                      pagination={false}
                      size="small"
                      scroll={{ x: 'max-content' }}
                    />
                  </div>
                )}
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
