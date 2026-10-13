import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import { useForm, Controller } from 'react-hook-form';
import {
  PlusOutlined,
  DeleteOutlined,
  StarOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import UWrapperInput from '~/components/ui/uwrapper-input';
import UImageUpload from '~/components/ui/uimage-upload';
import WysiwygEditor, { normalizeVideoUrl } from '~/components/ui/WysiwygEditor';
import type { AdminProductDto } from '~/types/admin.type';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AdminProductDto) => Promise<void>;
  initialData?: any;
  categories: Array<{ id: string; name: string }>;
  loading?: boolean;
}

interface FormValues {
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  material?: string;
  dimensions?: string;
  origin?: string;
  warranty?: string;
  videoUrl?: string;
  description?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [images, setImages] = useState<string[]>([]);
  const [uploadedNewImg, setUploadedNewImg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      categoryId: '',
      price: 0,
      originalPrice: 0,
      stockQuantity: 10,
      material: '',
      dimensions: '',
      origin: 'Việt Nam',
      warranty: '12 tháng',
      videoUrl: '',
      description: '',
    },
  });

  const watchVideoUrl = watch('videoUrl');
  const embedVideoUrl = normalizeVideoUrl(watchVideoUrl || '');

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          categoryId: initialData.categoryId || '',
          price: initialData.price || 0,
          originalPrice: initialData.originalPrice || 0,
          stockQuantity: initialData.stockQuantity || 0,
          material: initialData.material || '',
          dimensions: initialData.dimensions || '',
          origin: initialData.origin || 'Việt Nam',
          warranty: initialData.warranty || '12 tháng',
          videoUrl: initialData.videoUrl || initialData.video_url || '',
          description: initialData.description || '',
        });
        setImages(initialData.images || []);
      } else {
        reset({
          name: '',
          categoryId: categories[0]?.id || '',
          price: 0,
          originalPrice: 0,
          stockQuantity: 10,
          material: '',
          dimensions: '',
          origin: 'Việt Nam',
          warranty: '12 tháng',
          videoUrl: '',
          description: '',
        });
        setImages([
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        ]);
      }
      setActiveTab('info');
      setUploadedNewImg(null);
    }
  }, [open, initialData, categories, reset]);

  const handleAddUploadedImage = (url: string) => {
    if (url) {
      setImages((prev) => [...prev, url]);
      setUploadedNewImg(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const onFormSubmit = async (data: FormValues) => {
    const payload: AdminProductDto = {
      name: data.name.trim(),
      categoryId: data.categoryId,
      price: Number(data.price),
      originalPrice: Number(data.originalPrice || 0),
      stockQuantity: Number(data.stockQuantity || 0),
      material: data.material?.trim() || '',
      dimensions: data.dimensions?.trim() || '',
      origin: data.origin?.trim() || '',
      warranty: data.warranty?.trim() || '',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
      videoUrl: data.videoUrl?.trim() || '',
      description: data.description || '',
    };
    await onSubmit(payload);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 font-sans">
          <span className="text-base font-bold text-gray-900">
            {initialData ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Mới Sản Phẩm'}
          </span>
          {initialData?.s_ID && (
            <Tag color="blue" className="font-mono text-xs">
              {initialData.s_ID}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={940}
      centered
      destroyOnClose
      footer={
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-sans">
          <div className="text-xs text-gray-400">
            * Bắt buộc điền đủ tên, danh mục và giá bán
          </div>
          <Space>
            <Button onClick={onClose} disabled={loading}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit(onFormSubmit)}
              className="!bg-sky-500 hover:!bg-sky-400 !font-semibold"
            >
              {initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
            </Button>
          </Space>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="py-2 font-sans">
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
                              placeholder="Ví dụ: Ghế da thư giãn cao cấp LuxDecor..."
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
                        name="price"
                        control={control}
                        rules={{ required: 'Vui lòng nhập giá bán', min: { value: 1000, message: 'Giá bán tối thiểu 1.000 VNĐ' } }}
                        render={({ field }) => (
                          <UWrapperInput label="Giá bán (VND)" required error={errors.price?.message}>
                            <InputNumber
                              {...field}
                              className="!w-full !rounded-lg"
                              style={{ width: '100%' }}
                              min={0}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                          <UWrapperInput label="Giá gốc niêm yết (nếu có giảm giá)">
                            <InputNumber
                              {...field}
                              className="!w-full !rounded-lg"
                              style={{ width: '100%' }}
                              min={0}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                          </UWrapperInput>
                        )}
                      />
                    </Col>

                    <Col xs={24} sm={12}>
                      <Controller
                        name="stockQuantity"
                        control={control}
                        render={({ field }) => (
                          <UWrapperInput label="Số lượng trong kho">
                            <InputNumber {...field} className="!w-full !rounded-lg" style={{ width: '100%' }} min={0} />
                          </UWrapperInput>
                        )}
                      />
                    </Col>

                    <Col xs={24} sm={12}>
                      <Controller
                        name="material"
                        control={control}
                        render={({ field }) => (
                          <UWrapperInput label="Chất liệu cấu tạo">
                            <Input {...field} placeholder="Gỗ sồi, Da bọc cao cấp, Khung thép..." className="!rounded-lg !w-full" style={{ width: '100%' }} />
                          </UWrapperInput>
                        )}
                      />
                    </Col>

                    <Col xs={24} sm={12}>
                      <Controller
                        name="dimensions"
                        control={control}
                        render={({ field }) => (
                          <UWrapperInput label="Kích thước tiêu chuẩn">
                            <Input {...field} placeholder="D120 x R60 x C75 cm" className="!rounded-lg !w-full" style={{ width: '100%' }} />
                          </UWrapperInput>
                        )}
                      />
                    </Col>

                    <Col xs={24} sm={12}>
                      <Controller
                        name="origin"
                        control={control}
                        render={({ field }) => (
                          <UWrapperInput label="Xuất xứ">
                            <Input {...field} placeholder="Việt Nam, Ý, Hàn Quốc..." className="!rounded-lg !w-full" style={{ width: '100%' }} />
                          </UWrapperInput>
                        )}
                      />
                    </Col>

                    <Col xs={24} sm={12}>
                      <Controller
                        name="warranty"
                        control={control}
                        render={({ field }) => (
                          <UWrapperInput label="Chế độ bảo hành">
                            <Input {...field} placeholder="12 tháng chính hãng" className="!rounded-lg !w-full" style={{ width: '100%' }} />
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
                  <PictureOutlined /> Hình Ảnh & Video YouTube
                </span>
              ),
              children: (
                <div className="py-2 space-y-6">
                  {/* Quản lý ảnh */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800">
                        Bộ sưu tập hình ảnh sản phẩm ({images.length} ảnh)
                      </label>
                      <span className="text-[11px] text-gray-400">
                        Ảnh đầu tiên là ảnh đại diện chính của sản phẩm
                      </span>
                    </div>

                    <div className="max-w-md">
                      <UImageUpload
                        value={uploadedNewImg}
                        onChange={handleAddUploadedImage}
                        aspectRatio="video"
                        placeholderText="Thêm ảnh mới vào bộ sưu tập"
                      />
                    </div>

                    {images.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-xs">
                        Chưa có hình ảnh nào. Tải ảnh lên ở khung bên trên.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`group relative rounded-xl overflow-hidden border-2 transition-all bg-gray-50 ${
                              idx === 0
                                ? 'border-sky-500 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full aspect-square object-cover"
                            />
                            {idx === 0 && (
                              <span className="absolute top-1.5 left-1.5 bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                Ảnh chính
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                              {idx !== 0 && (
                                <Tooltip title="Đặt làm ảnh chính">
                                  <Button
                                    size="small"
                                    type="primary"
                                    icon={<StarOutlined />}
                                    onClick={() => handleSetPrimaryImage(idx)}
                                    className="!bg-brand-coral hover:!bg-[#c95f5f] !p-1 !h-7 !w-7 !min-w-0"
                                  />
                                </Tooltip>
                              )}
                              <Tooltip title="Xóa ảnh">
                                <Button
                                  size="small"
                                  danger
                                  type="primary"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemoveImage(idx)}
                                  className="!p-1 !h-7 !w-7 !min-w-0"
                                />
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nhúng Video Giới Thiệu YouTube */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <VideoCameraOutlined style={{ fontSize: 18, color: '#ef4444' }} />
                      <label className="text-xs font-bold text-gray-800">
                        Nhúng Video Giới Thiệu từ YouTube
                      </label>
                    </div>

                    <Controller
                      name="videoUrl"
                      control={control}
                      render={({ field }) => (
                        <UWrapperInput error={errors.videoUrl?.message}>
                          <Input
                            {...field}
                            placeholder="Dán link video YouTube (VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
                            className="!rounded-lg !py-2 !w-full"
                            style={{ width: '100%' }}
                            allowClear
                          />
                        </UWrapperInput>
                      )}
                    />

                    {embedVideoUrl ? (
                      <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video max-w-lg mx-auto shadow-md">
                        <iframe
                          src={embedVideoUrl}
                          title="YouTube Video Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-xl text-center text-gray-400 text-xs">
                        Chưa có video giới thiệu. Dán đường dẫn YouTube phía trên để xem trước video phát tại đây.
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'desc',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <FileTextOutlined /> Mô Tả Chi Tiết (WYSIWYG)
                </span>
              ),
              children: (
                <div className="py-2 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>
                      Soạn thảo nội dung định dạng phong phú theo mẫu bài viết chuyên nghiệp.
                    </span>
                  </div>

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <WysiwygEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Nhập thông tin giới thiệu chi tiết về sản phẩm, chất lượng gia công, hướng dẫn bảo quản..."
                        minHeight={340}
                      />
                    )}
                  />
                </div>
              ),
            },
          ]}
        />
      </form>
    </Modal>
  );
};

export default ProductFormModal;
