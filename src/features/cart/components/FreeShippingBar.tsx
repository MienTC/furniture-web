import React from 'react';
import { CarOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { formatVND } from '~/common/utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '~/common/constants';

export const FreeShippingBar: React.FC<{ subtotal: number }> = ({ subtotal: _ }) => {
  return (
    <div className="p-4 rounded-2xl bg-brand-mint/20 border border-brand-mint/50 space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-stone-900">
          <CarOutlined className="text-brand-coral" style={{ fontSize: 16 }} />
          <strong className="text-stone-900 font-bold">ƯU ĐÃI: MIỄN PHÍ VẬN CHUYỂN & LẮP ĐẶT TOÀN QUỐC CHO MỌI ĐƠN HÀNG</strong>
        </span>
        <span className="text-brand-coral font-bold">100%</span>
      </div>
      <Progress percent={100} showInfo={false} strokeColor="#DE7272" size="small" />
    </div>
  );
};
