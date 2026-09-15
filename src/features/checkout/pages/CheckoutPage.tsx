import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '~/contexts/CartContext';
import { useAuth } from '~/contexts/AuthContext';
import { orderService } from '~/services/orderService';
import { DeliveryForm } from '~/features/checkout/components/DeliveryForm';
import { PaymentSelector } from '~/features/checkout/components/PaymentSelector';
import { OrderPreview } from '~/features/checkout/components/OrderPreview';
import { ArrowLeft } from 'lucide-react';
import { Form, message } from 'antd';
import type { OrderCustomerInfo } from '~/types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, voucherCode, discountAmount, shippingFee, totalAmount, subtotal } = useCart();
  const { user } = useAuth();
  const [form] = Form.useForm<OrderCustomerInfo>();
  const [paymentMethod, setPaymentMethod] = useState<OrderCustomerInfo['paymentMethod']>('bank_transfer');
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không có sản phẩm nào để thanh toán</h2>
        <Link to="/products" className="inline-block bg-amber-950 text-white text-xs font-bold px-6 py-2.5 rounded-lg">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const handleFinish = (values: OrderCustomerInfo) => {
    setSubmitting(true);
    setTimeout(() => {
      const order = orderService.createOrder(cart, { ...values, paymentMethod }, voucherCode);
      setSubmitting(false);
      message.success(`Đặt hàng thành công! Mã đơn: ${order.id}`);
      navigate(`/orders/${order.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-amber-950 mb-2">
          <ArrowLeft size={14} /> Quay lại Giỏ hàng
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Thanh Toán Đơn Hàng</h1>
      </div>
      <Form form={form} layout="vertical" onFinish={handleFinish}
        initialValues={{ fullName: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '', address: user?.address ?? '', city: 'TP. Hà Nội', district: 'Quận Hà Đông' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <DeliveryForm form={form} />
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
          <OrderPreview cart={cart} subtotal={subtotal} discountAmount={discountAmount} shippingFee={shippingFee} totalAmount={totalAmount} submitting={submitting} />
        </div>
      </Form>
    </div>
  );
};
