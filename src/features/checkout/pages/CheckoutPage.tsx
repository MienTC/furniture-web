import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '~/contexts/CartContext';
import { useAuth } from '~/contexts/AuthContext';
import { orderService } from '~/services/orderService';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import { OrderCustomerInfo } from '~/types';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowLeft, 
  CheckCircle2 
} from 'lucide-react';
import { Input, Radio, Button, Form, message } from 'antd';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, voucherCode, discountAmount, shippingFee, totalAmount, subtotal } = useCart();
  const { user } = useAuth();

  const [form] = Form.useForm<OrderCustomerInfo>();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'credit_card'>('bank_transfer');
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không có sản phẩm nào để thanh toán</h2>
        <Link to="/products" className="inline-block bg-amber-950 text-white text-xs font-bold px-6 py-2.5 rounded-lg">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleFinish = (values: OrderCustomerInfo) => {
    setSubmitting(true);
    setTimeout(() => {
      const customerInfo: OrderCustomerInfo = {
        ...values,
        paymentMethod,
      };

      const createdOrder = orderService.createOrder(cart, customerInfo, voucherCode);
      setSubmitting(false);
      message.success(`Đặt hàng thành công! Mã đơn hàng: ${createdOrder.id}`);
      navigate(`/orders/${createdOrder.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-amber-950 mb-2">
          <ArrowLeft size={14} /> Quay lại Giỏ hàng
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900">
          Thanh Toán Đơn Hàng Nội Thất
        </h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          fullName: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          address: user?.address || '',
          city: 'TP. Hồ Chí Minh',
          district: 'Bình Thạnh',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <h3 className="text-lg font-serif-heading font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <Truck size={20} className="text-amber-800" /> 1. Thông Tin Nhận Hàng & Lắp Đặt
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  name="fullName"
                  label={<span className="text-xs font-bold text-stone-700">Họ và tên người nhận</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                  <Input placeholder="Nguyễn Văn A" className="!rounded-lg text-xs" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={<span className="text-xs font-bold text-stone-700">Số điện thoại liên hệ</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input placeholder="0988 888 888" className="!rounded-lg text-xs" />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={<span className="text-xs font-bold text-stone-700">Địa chỉ Email</span>}
                rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
              >
                <Input placeholder="customer@example.com" className="!rounded-lg text-xs" />
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  name="city"
                  label={<span className="text-xs font-bold text-stone-700">Tỉnh / Thành phố</span>}
                  rules={[{ required: true, message: 'Chọn Tỉnh / Thành' }]}
                >
                  <Input placeholder="TP. Hồ Chí Minh" className="!rounded-lg text-xs" />
                </Form.Item>

                <Form.Item
                  name="district"
                  label={<span className="text-xs font-bold text-stone-700">Quận / Huyện</span>}
                  rules={[{ required: true, message: 'Chọn Quận / Huyện' }]}
                >
                  <Input placeholder="Bình Thạnh" className="!rounded-lg text-xs" />
                </Form.Item>
              </div>

              <Form.Item
                name="address"
                label={<span className="text-xs font-bold text-stone-700">Địa chỉ nhà / Căn hộ cụ thể</span>}
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
              >
                <Input placeholder="Số 720A Điện Biên Phủ, Phường 22, Tháp Landmark 81..." className="!rounded-lg text-xs" />
              </Form.Item>

              <Form.Item
                name="note"
                label={<span className="text-xs font-bold text-stone-700">Ghi chú giao hàng & Lắp đặt (Tùy chọn)</span>}
              >
                <Input.TextArea rows={3} placeholder="Ví dụ: Giao sau 17h chiều, nhà có thang máy..." className="!rounded-lg text-xs" />
              </Form.Item>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <h3 className="text-lg font-serif-heading font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <CreditCard size={20} className="text-amber-800" /> 2. Phương Thức Thanh Toán
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-900 bg-amber-950/5 ring-1 ring-amber-900'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <QrCode size={24} className="text-amber-800 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900 text-xs">Chuyển Khoản Ngân Hàng Qua Mã QR Code</h4>
                    <p className="text-[11px] text-stone-500">Tự động xác nhận giao dịch & ưu đãi xử lý đơn nhanh nhất</p>
                  </div>
                  <Radio checked={paymentMethod === 'bank_transfer'} />
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-900 bg-amber-950/5 ring-1 ring-amber-900'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Banknote size={24} className="text-amber-800 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900 text-xs">Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)</h4>
                    <p className="text-[11px] text-stone-500">Kiểm tra sản phẩm tận nhà trước khi thanh toán</p>
                  </div>
                  <Radio checked={paymentMethod === 'cod'} />
                </label>
              </div>

              {/* QR Code preview box if Bank transfer selected */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2 text-amber-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-amber-800" /> Hệ thống sẽ hiển thị mã QR kèm nội dung chuyển khoản tự động ngay sau khi hoàn tất đặt hàng.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <h4 className="font-serif-heading font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
                Sản Phẩm Trong Đơn ({cart.length})
              </h4>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cart.map((item) => {
                  const itemPrice = item.product.discountPercent
                    ? calculateDiscountPrice(item.product.price, item.product.discountPercent)
                    : item.product.price;
                  return (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                      <div className="flex-1 overflow-hidden text-xs">
                        <p className="font-bold text-stone-900 truncate">{item.product.name}</p>
                        <p className="text-stone-500">SL: {item.quantity} x {formatVND(itemPrice)}</p>
                      </div>
                      <span className="font-bold text-amber-950 text-xs">{formatVND(itemPrice * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Giảm giá voucher:</span>
                    <span className="font-bold">-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển & lắp đặt:</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">MIỄN PHÍ</strong> : formatVND(shippingFee)}</span>
                </div>
                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 text-sm">Tổng cộng:</span>
                  <span className="text-2xl font-bold font-serif-heading text-amber-950">
                    {formatVND(totalAmount)}
                  </span>
                </div>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                size="large"
                className="!bg-amber-950 hover:!bg-amber-900 font-bold text-xs !rounded-xl !h-12 uppercase tracking-wider"
              >
                Xác Nhận Đặt Hàng Ngay
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
