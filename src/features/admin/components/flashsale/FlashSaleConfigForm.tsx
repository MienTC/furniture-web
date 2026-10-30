import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Card, Switch, Input, DatePicker, Row, Col, Badge, Avatar, Button } from 'antd';
import {
  ThunderboltOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatVND } from '~/common/utils/formatters';
import UBadge from '~/components/ui/ubadge';
import { ProductPickerModal, type ProductItem } from '~/components/shared/ProductPickerModal';
import type { FlashSaleConfig, FlashSaleFormValues } from '~/types';

interface FlashSaleConfigFormProps {
  id?: string;
  initialConfig?: FlashSaleConfig | null;
  initialProducts?: any[];
  isSubmitting?: boolean;
  onSubmit: (values: FlashSaleConfig) => Promise<void>;
}

export const FlashSaleConfigForm: React.FC<FlashSaleConfigFormProps> = ({
  id = 'admin-flash-sale-form',
  initialConfig,
  initialProducts = [],
  onSubmit,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedProductMap, setSelectedProductMap] = useState<Map<string, ProductItem>>(new Map());

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
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
  const watchedTitle = watch('title');
  const watchedBadge = watch('discount_badge');
  const watchedDescription = watch('description');
  const watchedProductIds = watch('product_ids') || [];
  const watchedEndTime = watch('end_time');
  const isExpired = Boolean(watchedEndTime && dayjs(watchedEndTime).isBefore(dayjs()));

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

  // Nạp cache thông tin sản phẩm ban đầu từ initialProducts (nếu có từ flashSaleData)
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      const map = new Map<string, ProductItem>();
      initialProducts.forEach((p: any) => {
        const pId = p.s_ID || p.id || '';
        if (pId) map.set(pId, p);
      });
      setSelectedProductMap(map);
    }
  }, [initialProducts]);

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

  // Danh sách chi tiết các sản phẩm đang được chọn
  const selectedProductList: ProductItem[] = watchedProductIds
    .map((id) => selectedProductMap.get(id) || { id, s_ID: id, name: `Sản phẩm ${id}` })
    .filter(Boolean);

  const handleRemoveProduct = (prodId: string) => {
    const updated = watchedProductIds.filter((id) => id !== prodId);
    setValue('product_ids', updated, { shouldDirty: true });
    setSelectedProductMap((prev) => {
      const next = new Map(prev);
      next.delete(prodId);
      return next;
    });
  };

  const handlePickProductsOk = (newSelectedIds: string[], newSelectedProducts: ProductItem[]) => {
    setValue('product_ids', newSelectedIds, { shouldDirty: true });
    const map = new Map<string, ProductItem>();
    (newSelectedProducts || []).forEach((p) => {
      const pId = p.s_ID || p.id || '';
      if (pId) map.set(pId, p);
    });
    setSelectedProductMap(map);
    setIsPickerOpen(false);
  };

  return (
    <>
      <Form
        id={id}
        layout="vertical"
        onFinish={handleSubmit(onFormSubmit)}
        className="font-sans"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
          {/* Cột Trái (7 cols): Cấu hình cài đặt Flash Sale */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card
              title={
                <div className="flex items-center gap-2 text-[#2B5A50] font-bold text-sm">
                  <ThunderboltOutlined style={{ fontSize: 18 }} />
                  <span>Thiết Lập Chương Trình Flash Sale</span>
                </div>
              }
              className="rounded-xl border-stone-200 shadow-2xs"
            >
              <div className="space-y-4">
                {/* Switch Kích Hoạt */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <p className="font-bold text-xs text-[#1A2421] m-0">
                      Trạng Thái Kích Hoạt
                    </p>
                    <p className="text-[11px] text-stone-500 m-0">
                      Bật để hiển thị khối Flash Sale ngoài trang chủ cho khách mua hàng
                    </p>
                  </div>
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        className={field.value ? '!bg-[#2B5A50]' : ''}
                      />
                    )}
                  />
                </div>

                <Row gutter={12}>
                  <Col span={14}>
                    <Form.Item label={<span className="text-xs font-semibold text-stone-700">Tiêu Đề Khối Flash Sale</span>}>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="VD: TUẦN LỄ NỘI THẤT LUXURY SALE"
                            className="!rounded-lg text-xs"
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label={<span className="text-xs font-semibold text-stone-700">Badge Giảm Giá</span>}>
                      <Controller
                        name="discount_badge"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="VD: ƯU ĐÃI TỚI 45%"
                            className="!rounded-lg text-xs"
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={14}>
                    <Form.Item label={<span className="text-xs font-semibold text-stone-700">Mô Tả Ngắn</span>}>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="VD: Số lượng ưu đãi có hạn, áp dụng đến hết tuần này"
                            className="!rounded-lg text-xs"
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label={<span className="text-xs font-semibold text-stone-700">Thời Gian Kết Thúc Đếm Ngược</span>}>
                      <Controller
                        name="end_time"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            className="w-full !rounded-lg text-xs"
                            placeholder="Chọn ngày giờ hết hạn"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) =>
                              field.onChange(date ? date.toISOString() : null)
                            }
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Phần chọn sản phẩm: Nút mở Modal 2 cột chuẩn Pick */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-stone-800">
                        Sản Phẩm Tham Gia Flash Sale
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        Đã chọn ({watchedProductIds.length} sản phẩm)
                      </span>
                    </div>
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      onClick={() => setIsPickerOpen(true)}
                      className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !rounded-lg text-xs !h-8"
                    >
                      Chọn Sản Phẩm
                    </Button>
                  </div>

                  {/* Danh sách các pill sản phẩm đã chọn */}
                  {selectedProductList.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-400">
                      Chưa chọn sản phẩm nào. Nhấp vào <b>"Chọn Sản Phẩm"</b> ở trên để thêm sản phẩm vào Flash Sale.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200 max-h-[140px] overflow-y-auto custom-scrollbar">
                      {selectedProductList.map((p) => {
                        const prodId = p.s_ID || p.id || '';
                        return (
                          <div
                            key={prodId}
                            className="inline-flex items-center gap-1.5 bg-white border border-[#D0DBD6] rounded-full pl-1.5 pr-2 py-0.5 shadow-2xs text-xs"
                          >
                            <Avatar
                              size={20}
                              src={p.images?.[0]}
                              icon={<ShoppingOutlined style={{ fontSize: 12 }} />}
                              className="bg-stone-100 border border-stone-200 shrink-0 text-stone-400"
                            />
                            <span className="max-w-[130px] truncate text-[11px] font-medium text-[#1A2421]">
                              {p.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(prodId)}
                              className="text-stone-400 hover:text-rose-500 cursor-pointer border-0 bg-transparent p-0 flex items-center justify-center ml-0.5"
                              title="Xóa khỏi Flash Sale"
                            >
                              <CloseOutlined style={{ fontSize: 10 }} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Cột Phải (5 cols): Live Preview Khối Flash Sale */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card
              title={
                <div className="flex items-center justify-between text-[#2B5A50] font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <EyeOutlined style={{ fontSize: 18 }} />
                    <span>Xem Trước Khối Flash Sale</span>
                  </div>
                  <UBadge color={!isActive ? 'gray' : isExpired ? 'red' : 'green'}>
                    {!isActive ? 'Đang Tắt' : isExpired ? 'HẾT HẠN (TỰ ĐỘNG ẨN)' : 'Đang Hoạt Động'}
                  </UBadge>
                </div>
              }
              className="rounded-xl border-stone-200 shadow-2xs"
            >
              {isExpired && isActive && (
                <div className="p-3 mb-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <span className="text-base leading-none">⚠️</span>
                  <div className="text-xs">
                    <p className="font-bold text-amber-900 m-0">Chiến dịch Flash Sale đã hết hạn đếm ngược!</p>
                    <p className="text-amber-700 m-0 text-[11px] mt-0.5">
                      Thời gian kết thúc đã qua ({dayjs(watchedEndTime).format('DD/MM/YYYY HH:mm')}). Hệ thống đang <b>tự động ẩn khối Flash Sale</b> ngoài trang chủ và trang sản phẩm để khách hàng không bị nhầm lẫn. Vui lòng gia hạn thêm thời gian hoặc tắt chiến dịch.
                    </p>
                  </div>
                </div>
              )}
              {/* Giả lập giao diện Flash Sale Header */}
              <div className="p-4 rounded-xl bg-[#2B5A50] text-white">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ThunderboltOutlined className="text-amber-300 text-lg" />
                    <h4 className="m-0 text-sm font-black tracking-wide uppercase text-white">
                      {watchedTitle}
                    </h4>
                  </div>
                  {watchedBadge && (
                    <span className="bg-[#C88A58] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                      {watchedBadge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-white/80 mt-1 mb-3">
                  {watchedDescription}
                </p>

                {/* Đồng hồ đếm ngược preview */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/20 text-xs">
                  <ClockCircleOutlined className="text-amber-300" />
                  <span className="text-[11px] text-white/90">
                    {watchedEndTime
                      ? `Hết hạn: ${dayjs(watchedEndTime).format('DD/MM/YYYY HH:mm')}`
                      : 'Chưa đặt thời gian kết thúc'}
                  </span>
                </div>
              </div>

              {/* Danh sách sản phẩm tham gia Flash Sale */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700">
                    Sản phẩm hiển thị ({selectedProductList.length})
                  </span>
                  {selectedProductList.length > 0 && (
                    <span className="text-[10px] text-stone-400">
                      Tối đa hiển thị trên trang chủ
                    </span>
                  )}
                </div>

                {selectedProductList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-100">
                    Chưa có sản phẩm nào được chọn
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                    {selectedProductList.map((prod: any, idx) => (
                      <div
                        key={prod.s_ID || prod.id || idx}
                        className="flex items-center gap-3 p-2 rounded-lg bg-stone-50 hover:bg-[#EDF5F2] border border-stone-200/80 transition-colors"
                      >
                        <Avatar
                          src={prod.images?.[0]}
                          icon={<ShoppingOutlined style={{ fontSize: 20 }} />}
                          shape="square"
                          size={40}
                          className="rounded-lg bg-white border border-stone-200 shrink-0 text-stone-400"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#1A2421] truncate m-0">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#2B5A50]">
                              {formatVND(prod.price || 0)}
                            </span>
                            {prod.discountPercent > 0 && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                -{prod.discountPercent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-[#EDF5F2] rounded-lg border border-[#D0DBD6] text-xs text-stone-600 flex items-start gap-2">
                <CheckCircleOutlined className="text-[#2B5A50] mt-0.5 flex-none" />
                <span>
                  Khi bật, khối Flash Sale trên trang chủ sẽ tự động đếm ngược theo thời gian kết thúc và tự ẩn khi hết giờ.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </Form>

      {/* Modal Pick sản phẩm chuẩn UserPicker của tev-fe-admin với server pagination Antd */}
      <ProductPickerModal
        open={isPickerOpen}
        onCancel={() => setIsPickerOpen(false)}
        onOk={handlePickProductsOk}
        initialSelectedIds={watchedProductIds}
        initialSelectedProducts={selectedProductList}
      />
    </>
  );
};

export default FlashSaleConfigForm;
