import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Card, Switch, Input, Select, DatePicker, Button, Divider, Row, Col } from 'antd';
import { SaveOutlined, ThunderboltOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { FlashSaleConfig, FlashSaleFormValues } from '~/types';

interface FlashSaleConfigFormProps {
  initialConfig?: FlashSaleConfig | null;
  products: any[];
  isLoadingProducts?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: FlashSaleConfig) => Promise<void>;
}

export const FlashSaleConfigForm: React.FC<FlashSaleConfigFormProps> = ({
  initialConfig,
  products,
  isLoadingProducts = false,
  isSubmitting = false,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<FlashSaleFormValues>({
    defaultValues: {
      is_active: false,
      title: '',
      discount_badge: '',
      description: '',
      end_time: null,
      product_ids: [],
    },
  });

  const isActive = watch('is_active');
  const watchedProductIds = watch('product_ids') || [];
  const watchedEndTime = watch('end_time');

  useEffect(() => {
    if (initialConfig) {
      reset({
        is_active: Boolean(initialConfig.is_active),
        title: initialConfig.title || '',
        discount_badge: initialConfig.discount_badge || '',
        description: initialConfig.description || '',
        end_time: initialConfig.end_time || null,
        product_ids: initialConfig.product_ids || [],
      });
    }
  }, [initialConfig, reset]);

  const onFormSubmit = async (data: FlashSaleFormValues) => {
    await onSubmit({
      is_active: Boolean(data.is_active),
      title: data.title?.trim() || '',
      discount_badge: data.discount_badge?.trim() || '',
      description: data.description?.trim() || '',
      end_time: data.end_time || null,
      product_ids: data.product_ids || [],
    });
  };

  const productOptions = products.map((p) => ({
    value: p.s_ID || p.id,
    label: `${p.name} - ${p.price?.toLocaleString('vi-VN')}₫ (Giảm: ${p.discountPercent || 0}%)`,
  }));

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onFormSubmit)}
      className="space-y-6"
    >
      <Card
        title={
          <div className="flex items-center gap-2 text-[#DE7272] font-bold text-base">
            <ThunderboltOutlined style={{ fontSize: 20 }} />
            <span>Thiết Lập Chương Trình Flash Sale Trang Chủ</span>
          </div>
        }
        className="rounded-2xl border-stone-200 shadow-xs"
        extra={
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            className="!bg-[#DE7272] hover:!bg-[#c95f5f] font-semibold !rounded-xl"
          >
            Lưu Cấu Hình
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Trạng thái Bật/Tắt Switch */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <p className="font-bold text-stone-800 text-sm m-0">Hiển thị Flash Sale ngoài trang chủ</p>
              <p className="text-xs text-stone-500 m-0 mt-0.5">
                Khi TẮT, khối Flash Sale và bộ đếm ngược trên trang chủ sẽ tự động ẩn
              </p>
            </div>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  checkedChildren="ĐANG BẬT"
                  unCheckedChildren="ĐÃ TẮT"
                  className={field.value ? '!bg-[#DE7272]' : ''}
                />
              )}
            />
          </div>

          {/* Cấu hình Tiêu đề & Badge qua Row/Col và Form.Item Antd */}
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Vui lòng nhập tiêu đề Flash Sale' }}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label={<span className="font-semibold text-stone-700 text-xs">Tiêu đề Flash Sale</span>}
                    required
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                    className="!mb-4"
                  >
                    <Input
                      {...field}
                      placeholder="VD: Flash Sale Cuối Tuần"
                      className="!rounded-lg !py-1.5 !w-full"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24} md={12}>
              <Controller
                name="discount_badge"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label={<span className="font-semibold text-stone-700 text-xs">Badge ưu đãi</span>}
                    className="!mb-4"
                  >
                    <Input
                      {...field}
                      placeholder="VD: Giảm tới 40%"
                      className="!rounded-lg !py-1.5 !w-full"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          {/* Cấu hình Mô tả & Thời gian kết thúc */}
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label={<span className="font-semibold text-stone-700 text-xs">Mô tả phụ</span>}
                    className="!mb-4"
                  >
                    <Input
                      {...field}
                      placeholder="VD: Giờ vàng giá tốt, số lượng có hạn"
                      className="!rounded-lg !py-1.5 !w-full"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col xs={24} md={12}>
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label={
                      <span className="font-semibold text-stone-700 text-xs flex items-center gap-1">
                        <ClockCircleOutlined className="text-[#DE7272]" />
                        Thời gian kết thúc (Đếm ngược)
                      </span>
                    }
                    extra={<span className="text-[11px] text-stone-400">Thời điểm kết thúc đếm ngược hiển thị trên trang chủ</span>}
                    className="!mb-4"
                  >
                    <DatePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="Chọn thời điểm kết thúc đếm ngược..."
                      className="w-full !rounded-lg !py-1.5"
                      style={{ width: '100%' }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? date.toISOString() : null);
                      }}
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          <Divider className="!my-2" />

          {/* Chọn danh sách sản phẩm tham gia Flash Sale */}
          <Controller
            name="product_ids"
            control={control}
            render={({ field }) => (
              <Form.Item
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-stone-700 text-xs">
                      Sản phẩm tham gia Flash Sale ({watchedProductIds.length} sản phẩm đã chọn)
                    </span>
                    <span className="text-xs text-stone-400 font-normal">
                      Chọn lọc sản phẩm từ Database
                    </span>
                  </div>
                }
                extra={<span className="text-[11px] text-stone-400">Chỉ những sản phẩm được Admin chọn ở đây mới hiển thị trong Flash Sale</span>}
                className="!mb-4"
              >
                <Select
                  mode="multiple"
                  allowClear
                  className="w-full !rounded-lg"
                  style={{ width: '100%' }}
                  placeholder="Chọn các sản phẩm hiển thị trong khung Flash Sale..."
                  value={field.value}
                  onChange={field.onChange}
                  loading={isLoadingProducts}
                  options={productOptions}
                  filterOption={(input, option) =>
                    (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
                  }
                  maxTagCount="responsive"
                />
              </Form.Item>
            )}
          />

          {/* Preview Panel ngắn gọn */}
          <div className="p-4 bg-orange-50/50 border border-orange-200/60 rounded-xl flex items-start gap-3">
            <InfoCircleOutlined className="text-[#DE7272] text-lg mt-0.5" />
            <div className="text-xs text-stone-600 space-y-1">
              <p className="font-semibold text-stone-800 m-0">Xem trước tóm tắt Flash Sale:</p>
              <p className="m-0">
                • Trạng thái: <strong className={isActive ? 'text-emerald-600' : 'text-stone-500'}>{isActive ? 'BẬT' : 'TẮT'}</strong>
              </p>
              <p className="m-0">
                • Kết thúc đếm ngược: <strong>{watchedEndTime ? dayjs(watchedEndTime).format('DD/MM/YYYY HH:mm:ss') : 'Chưa thiết lập'}</strong>
              </p>
              <p className="m-0">
                • Số lượng sản phẩm hiển thị: <strong>{watchedProductIds.length}</strong> sản phẩm.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Form>
  );
};

export default FlashSaleConfigForm;
