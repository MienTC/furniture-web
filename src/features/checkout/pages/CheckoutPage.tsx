import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '~/contexts/CartContext';
import { useAuth } from '~/contexts/AuthContext';
import { useCheckout } from '~/features/checkout/hooks';
import { DeliveryForm } from '~/features/checkout/components/DeliveryForm';
import { PaymentSelector } from '~/features/checkout/components/PaymentSelector';
import { OrderPreview } from '~/features/checkout/components/OrderPreview';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Form, message } from 'antd';
import type { OrderCustomerInfo } from '~/types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, voucherCode, discountAmount, shippingFee, totalAmount, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [form] = Form.useForm<OrderCustomerInfo>();
  const [paymentMethod, setPaymentMethod] = useState<OrderCustomerInfo['paymentMethod']>('bank_transfer');

  const { mutateAsync: checkoutMutation, isPending: submitting } = useCheckout();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không có sản phẩm nào để thanh toán</h2>
        <Link to="/products" className="inline-block bg-brand-coral hover:bg-[#c95f5f] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleFinish = async (values: OrderCustomerInfo) => {
    try {
      const result = await checkoutMutation({
        items: cart,
        customerInfo: { ...values, paymentMethod },
        voucherCode,
      });

      if (clearCart) {
        clearCart();
      }

      message.success(`Đặt hàng thành công! Mã đơn: ${result.orderId}`);
      navigate(`/orders/${result.orderId}`);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || 'Lỗi khi xử lý đơn hàng');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-coral mb-2">
          <ArrowLeftOutlined style={{ fontSize: 13 }} /> Quay lại Giỏ hàng
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Thanh Toán Đơn Hàng</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          fullName: user?.name ?? '',
          phone: user?.phone ?? '',
          email: user?.email ?? '',
          address: user?.address ?? '',
          city: 'TP. Hà Nội',
          district: 'Quận Hà Đông',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <DeliveryForm form={form} />
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
          <OrderPreview
            cart={cart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            shippingFee={shippingFee}
            totalAmount={totalAmount}
            submitting={submitting}
          />
        </div>
      </Form>
    </div>
  );
};
