import React from 'react';
import { InputNumber } from 'antd';
import { formatVND } from '~/common/utils/formatters';

interface OrderDetailSummaryProps {
  subtotal: number;
  discountAmount?: number;
  shippingFee: number;
  totalAmount: number;
  isEditing: boolean;
  onShippingFeeChange?: (fee: number) => void;
  onDiscountChange?: (discount: number) => void;
}

export const OrderDetailSummary: React.FC<OrderDetailSummaryProps> = ({
  subtotal,
  discountAmount = 0,
  shippingFee,
  totalAmount,
  isEditing,
  onShippingFeeChange,
  onDiscountChange,
}) => {
  return (
    <div className="flex justify-end pt-2">
      <div className="w-96 bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-2.5 text-xs font-sans">
        <div className="flex justify-between items-center text-slate-600">
          <span>Tạm tính tiền hàng:</span>
          <span className="font-semibold text-slate-800">{formatVND(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-rose-600">
          <span>Chiết khấu Voucher / Giảm giá:</span>
          {isEditing ? (
            <InputNumber
              min={0}
              step={10000}
              value={discountAmount}
              onChange={(val) => onDiscountChange?.(val || 0)}
              formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(val) => Number(val?.replace(/\$\s?|(,*)/g, '') || 0)}
              className="w-36 text-right !font-semibold !text-rose-600"
              placeholder="0"
            />
          ) : (
            <span className="font-semibold">
              {discountAmount > 0 ? `-${formatVND(discountAmount)}` : '0 đ'}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Phí vận chuyển & lắp đặt:</span>
          {isEditing ? (
            <InputNumber
              min={0}
              step={10000}
              value={shippingFee}
              onChange={(val) => onShippingFeeChange?.(val || 0)}
              formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(val) => Number(val?.replace(/\$\s?|(,*)/g, '') || 0)}
              className="w-36 text-right !font-semibold"
              placeholder="0"
            />
          ) : (
            <span className="font-semibold text-slate-800">
              {shippingFee > 0 ? formatVND(shippingFee) : 'Miễn phí'}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm font-bold text-[#2B5A50] pt-2 border-t border-slate-200">
          <span>Tổng tiền thanh toán:</span>
          <span className="text-base">{formatVND(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSummary;
