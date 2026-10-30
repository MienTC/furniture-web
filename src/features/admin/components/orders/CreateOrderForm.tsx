import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Input,
  InputNumber,
  Select,
  Button,
  Avatar,
  Card,
  Row,
  Col,
} from 'antd';
import {
  DeleteOutlined,
  UserOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { adminService } from '~/services/v1/admin.service';
import { formatVND } from '~/common/utils/formatters';
import type { AdminCreateOrderPayload, OrderStatus } from '~/types';

interface CreateOrderFormValues {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: 'bank_transfer' | 'cod';
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  note?: string;
}

interface SelectedItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

interface CreateOrderFormProps {
  id?: string;
  onSubmit: (data: AdminCreateOrderPayload) => Promise<void>;
  onItemValidationChange?: (isValid: boolean) => void;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({
  id = 'create-order-form',
  onSubmit,
}) => {
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderFormValues>({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Hà Nội',
      district: 'Quận Cầu Giấy',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'unpaid',
      status: 'pending',
      note: '',
    },
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setFetchingProducts(true);
        const res = await adminService.getProducts({ page: 1, limit: 100 });
        setAvailableProducts(res?.items || []);
      } catch {
        // Handled silently
      } finally {
        setFetchingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddProduct = (productId: string) => {
    const prod = availableProducts.find((p) => p.s_ID === productId || p.id === productId);
    if (!prod) return;

    const existingIdx = selectedItems.findIndex((it) => it.productId === prod.s_ID);
    if (existingIdx >= 0) {
      const updated = [...selectedItems];
      updated[existingIdx].quantity += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          productId: prod.s_ID,
          productName: prod.name,
          imageUrl: prod.images?.[0] || '',
          price: prod.price || 0,
          quantity: 1,
          selectedColor: '',
        },
      ]);
    }
  };

  const handleUpdateQuantity = (idx: number, qty: number | null) => {
    const updated = [...selectedItems];
    updated[idx].quantity = Math.max(1, qty || 1);
    setSelectedItems(updated);
  };

  const handleUpdatePrice = (idx: number, price: number | null) => {
    const updated = [...selectedItems];
    updated[idx].price = Math.max(0, price || 0);
    setSelectedItems(updated);
  };

  const handleRemoveItem = (idx: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== idx));
  };

  const totalAmount = selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const onValidSubmit = async (values: CreateOrderFormValues) => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm vào đơn hàng');
      return;
    }

    const payload = {
      customerInfo: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || '',
        address: values.address,
        city: values.city,
        district: values.district,
      },
      items: selectedItems.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.price,
        selectedColor: it.selectedColor,
      })),
      paymentMethod: values.paymentMethod,
      paymentStatus: values.paymentStatus,
      status: values.status,
      note: values.note || '',
    };

    await onSubmit(payload);
  };

  return (
    <form id={id} onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
      {/* Thông Tin Khách Hàng */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <UserOutlined className="text-[#2B5A50]" /> Thông Tin Người Nhận
          </div>
        }
        className="!rounded-xl border-stone-200"
      >
        <Row gutter={12}>
          <Col span={12}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Họ và tên khách hàng *
              </label>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: 'Vui lòng nhập họ tên' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: Nguyễn Văn Tuấn"
                    className="!h-9 !rounded-lg !w-full"
                    style={{ width: '100%' }}
                    status={errors.fullName ? 'error' : undefined}
                  />
                )}
              />
              {errors.fullName && (
                <span className="text-[11px] text-rose-500">{errors.fullName.message}</span>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Số điện thoại *
              </label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: 'Vui lòng nhập số điện thoại' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: 0912345678"
                    className="!h-9 !rounded-lg !w-full"
                    style={{ width: '100%' }}
                    status={errors.phone ? 'error' : undefined}
                  />
                )}
              />
              {errors.phone && (
                <span className="text-[11px] text-rose-500">{errors.phone.message}</span>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Email (Tùy chọn)
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="khachhang@email.com"
                    className="!h-9 !rounded-lg !w-full"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Địa chỉ nhận hàng *
              </label>
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Vui lòng nhập địa chỉ' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: Căn hộ 1204 Tòa A, Hoàng Cầu"
                    className="!h-9 !rounded-lg !w-full"
                    style={{ width: '100%' }}
                    status={errors.address ? 'error' : undefined}
                  />
                )}
              />
              {errors.address && (
                <span className="text-[11px] text-rose-500">{errors.address.message}</span>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <div className="mb-0">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Tỉnh / Thành phố *
              </label>
              <Controller
                name="city"
                control={control}
                rules={{ required: 'Nhập Tỉnh/Thành' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Tỉnh/Thành"
                    className="!h-9 !rounded-lg !w-full"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-0">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Quận / Huyện *
              </label>
              <Controller
                name="district"
                control={control}
                rules={{ required: 'Nhập Quận/Huyện' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Quận/Huyện"
                    className="!h-9 !rounded-lg !w-full"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Danh Sách Sản Phẩm */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <ShoppingOutlined className="text-[#2B5A50]" /> Danh Sách Sản Phẩm Trong Đơn
          </div>
        }
        className="!rounded-xl border-stone-200"
      >
        <div className="mb-3">
          <Select
            showSearch
            placeholder="🔍 Chọn hoặc tìm kiếm sản phẩm theo tên..."
            loading={fetchingProducts}
            onChange={handleAddProduct}
            value={null}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            options={availableProducts.map((p) => ({
              value: p.s_ID,
              label: `${p.name} - ${formatVND(p.price)}`,
            }))}
            className="!w-full !h-9"
            style={{ width: '100%' }}
          />
        </div>

        {selectedItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-lg">
            Chưa có sản phẩm nào được chọn. Hãy chọn sản phẩm từ dropdown trên.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {selectedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
              >
                <Avatar
                  src={item.imageUrl}
                  shape="square"
                  size={42}
                  className="shrink-0 rounded-md border border-stone-200 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-800 truncate mb-1">
                    {item.productName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">Đơn giá:</span>
                    <InputNumber
                      size="small"
                      value={item.price}
                      min={0}
                      step={10000}
                      onChange={(val) => handleUpdatePrice(idx, val)}
                      className="!w-28 text-xs font-semibold"
                      style={{ width: '110px' }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-stone-500">SL:</span>
                  <InputNumber
                    size="small"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(val) => handleUpdateQuantity(idx, val)}
                    className="!w-16 text-center"
                    style={{ width: '60px' }}
                  />
                </div>

                <div className="text-right shrink-0 min-w-[90px]">
                  <span className="text-xs font-bold text-sky-600 block">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>

                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(idx)}
                  className="shrink-0 cursor-pointer"
                />
              </div>
            ))}

            <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-xs">
              <span className="font-semibold text-stone-600">Tổng tiền sản phẩm:</span>
              <span className="text-sm font-bold text-[#2B5A50]">{formatVND(totalAmount)}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Phương Thức & Trạng Thái */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <CreditCardOutlined className="text-[#2B5A50]" /> Phương Thức & Trạng Thái
          </div>
        }
        className="!rounded-xl border-stone-200"
      >
        <Row gutter={12}>
          <Col span={8}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Hình thức thanh toán
              </label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: 'bank_transfer', label: 'Chuyển khoản (VietQR)' },
                      { value: 'cod', label: 'Thu tiền khi giao (COD)' },
                    ]}
                    className="!w-full !h-9"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </Col>

          <Col span={8}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Trạng thái thanh toán
              </label>
              <Controller
                name="paymentStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: 'unpaid', label: 'Chưa thanh toán' },
                      { value: 'paid', label: 'Đã thanh toán' },
                    ]}
                    className="!w-full !h-9"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </Col>

          <Col span={8}>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Trạng thái đơn hàng
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: 'pending', label: 'Chờ duyệt' },
                      { value: 'processing', label: 'Đang xử lý' },
                      { value: 'shipping', label: 'Đang giao hàng' },
                      { value: 'completed', label: 'Hoàn thành' },
                    ]}
                    className="!w-full !h-9"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </Col>
        </Row>

        <div className="mb-0">
          <label className="text-xs font-medium text-stone-600 block mb-1">
            Ghi chú đơn hàng (Tùy chọn)
          </label>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={2}
                placeholder="VD: Khách dặn giao buổi tối sau 18h..."
                className="!rounded-lg !w-full"
                style={{ width: '100%' }}
              />
            )}
          />
        </div>
      </Card>
    </form>
  );
};

export default CreateOrderForm;
