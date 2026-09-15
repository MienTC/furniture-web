import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '~/contexts/CartContext';
import { CartItemRow } from '~/features/cart/components/CartItemRow';
import { FreeShippingBar } from '~/features/cart/components/FreeShippingBar';
import { VoucherBox } from '~/features/cart/components/VoucherBox';
import { CartOrderSummary } from '~/features/cart/components/CartOrderSummary';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { MOCK_VOUCHERS } from '~/mock/data';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, appliedVoucher, discountAmount, applyVoucher, removeVoucher, shippingFee, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400"><ShoppingBag size={40} /></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-stone-900">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">Chưa có sản phẩm nào. Hãy khám phá bộ sưu tập của chúng tôi!</p>
        </div>
        <Link to="/products" className="inline-flex items-center gap-2 bg-amber-950 hover:bg-amber-900 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md transition-all">
          Khám Phá Cửa Hàng <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-stone-500">Đang có {cart.length} sản phẩm được chọn</p>
        </div>
        <button onClick={clearCart} className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
          <Trash2 size={14} /> Xóa toàn bộ
        </button>
      </div>
      <FreeShippingBar subtotal={subtotal} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
            {cart.map(item => <CartItemRow key={item.product.id} item={item} onUpdateQty={updateQuantity} onRemove={removeFromCart} />)}
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline pt-2">
            <ArrowLeft size={14} /> Tiếp tục mua sắm
          </Link>
        </div>
        <div className="space-y-6">
          <VoucherBox appliedVoucher={appliedVoucher} suggestedVouchers={MOCK_VOUCHERS} onApply={applyVoucher} onRemove={removeVoucher} />
          <CartOrderSummary subtotal={subtotal} discountAmount={discountAmount} shippingFee={shippingFee} totalAmount={totalAmount} onCheckout={() => navigate('/checkout')} />
        </div>
      </div>
    </div>
  );
};
