import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '~/contexts/CartContext';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '~/common/constants';
import { MOCK_VOUCHERS } from '~/mock/data';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Minus, 
  Tag as TagIcon, 
  Truck, 
  Check, 
  X,
  ArrowLeft
} from 'lucide-react';
import { Input, Button, Progress, Tag } from 'antd';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    voucherCode,
    appliedVoucher,
    discountAmount,
    applyVoucher,
    removeVoucher,
    shippingFee,
    totalAmount,
  } = useCart();

  const [inputVoucher, setInputVoucher] = useState('');

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
          <ShoppingBag size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif-heading text-stone-900">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Chưa có sản phẩm nội thất nào được chọn. Hãy tham khảo các bộ sưu tập sang trọng của chúng tôi!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md transition-all"
        >
          Khám Phá Cửa Hàng <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const handleApplyVoucherCode = (codeToApply?: string) => {
    const code = codeToApply || inputVoucher;
    if (code) {
      const success = applyVoucher(code);
      if (success) setInputVoucher('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-stone-500">Đang có {cart.length} sản phẩm nội thất được chọn</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 size={14} /> Xóa toàn bộ giỏ hàng
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-red-950/5 border border-red-900/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-stone-900">
            <Truck size={16} className="text-red-700" />
            {amountLeftForFreeShipping === 0 ? (
              <strong className="text-emerald-700">Chúc mừng! Bạn được MIỄN PHÍ VẬN CHUYỂN toàn quốc!</strong>
            ) : (
              <span>
                Mua thêm <strong className="text-red-700">{formatVND(amountLeftForFreeShipping)}</strong> để được Miễn phí vận chuyển
              </span>
            )}
          </span>
          <span className="text-stone-500">{freeShippingProgress}%</span>
        </div>
        <Progress percent={freeShippingProgress} showInfo={false} strokeColor="#b91c1c" size="small" />
      </div>

      {/* Cart Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
            {cart.map((item) => {
              const itemPrice = item.product.discountPercent
                ? calculateDiscountPrice(item.product.price, item.product.discountPercent)
                : item.product.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link to={`/products/${item.product.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>

                  {/* Title & Info */}
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase text-red-700 tracking-wider">
                      {item.product.categoryName}
                    </span>
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-bold text-stone-900 hover:text-red-700 transition-colors text-sm line-clamp-1 block"
                    >
                      {item.product.name}
                    </Link>

                    {item.selectedColor && (
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                        Màu: {item.selectedColor}
                      </span>
                    )}

                    <div className="text-xs font-bold text-stone-900 pt-1">
                      {formatVND(itemPrice)}
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[100px]">
                    <span className="text-sm font-bold text-red-700 block">
                      {formatVND(itemTotal)}
                    </span>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:underline pt-2">
            <ArrowLeft size={14} /> Tiếp tục mua sắm thêm sản phẩm
          </Link>
        </div>

        {/* Right: Voucher & Order Summary */}
        <div className="space-y-6">
          {/* Voucher Entry Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <TagIcon size={16} className="text-red-700" /> Mã Giảm Giá Ưu Đãi
            </h4>

            {appliedVoucher ? (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-red-950 text-xs block">{appliedVoucher.code}</span>
                  <span className="text-[11px] text-red-800">{appliedVoucher.description}</span>
                </div>
                <button onClick={removeVoucher} className="text-stone-400 hover:text-rose-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã voucher..."
                  value={inputVoucher}
                  onChange={(e) => setInputVoucher(e.target.value.toUpperCase())}
                  className="!rounded-lg text-xs"
                />
                <Button
                  onClick={() => handleApplyVoucherCode()}
                  type="primary"
                  className="!bg-red-700 hover:!bg-red-600 font-bold text-xs"
                >
                  Áp Dụng
                </Button>
              </div>
            )}

            {/* Suggested Vouchers */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 block">Mã gợi ý:</span>
              {MOCK_VOUCHERS.map((v) => (
                <button
                  key={v.code}
                  onClick={() => handleApplyVoucherCode(v.code)}
                  className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-red-50 border border-stone-200 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-mono font-bold text-red-700">{v.code}</span>
                  <span className="text-[10px] text-stone-500">{v.discountValue}{v.discountType === 'percentage' ? '%' : '₫'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            <h4 className="font-serif-heading font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
              Tóm Tắt Đơn Hàng
            </h4>

            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>Tạm tính hàng hóa:</span>
                <span className="font-semibold text-stone-900">{formatVND(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-red-700">
                  <span>Giảm giá (Voucher):</span>
                  <span className="font-bold">-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? <strong className="text-emerald-700">MIỄN PHÍ</strong> : formatVND(shippingFee)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="font-bold text-stone-900 text-sm">Tổng thanh toán:</span>
              <span className="text-2xl font-bold font-serif-heading text-red-700">
                {formatVND(totalAmount)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs uppercase tracking-wider"
            >
              Tiến Hành Thanh Toán <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
