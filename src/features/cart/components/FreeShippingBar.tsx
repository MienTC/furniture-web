import React from 'react';
import { Truck } from 'lucide-react';
import { Progress } from 'antd';
import { formatVND } from '~/common/utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '~/common/constants';

export const FreeShippingBar: React.FC<{ subtotal: number }> = ({ subtotal }) => {
  const progress  = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  return (
    <div className="p-4 rounded-2xl bg-amber-950/5 border border-amber-900/10 space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-amber-950">
          <Truck size={16} className="text-amber-800" />
          {remaining === 0
            ? <strong className="text-emerald-700">Chúc mừng! Bạn được MIỄN PHÍ VẬN CHUYỂN!</strong>
            : <span>Mua thêm <strong className="text-amber-900">{formatVND(remaining)}</strong> để miễn phí vận chuyển</span>
          }
        </span>
        <span className="text-stone-500">{progress}%</span>
      </div>
      <Progress percent={progress} showInfo={false} strokeColor="#78350f" size="small" />
    </div>
  );
};
