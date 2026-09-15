import React from 'react';
import { CreditCard, QrCode, Banknote, CheckCircle2 } from 'lucide-react';
import { Radio } from 'antd';
import type { OrderCustomerInfo } from '~/types';

type PayMethod = OrderCustomerInfo['paymentMethod'];
interface Props { value: PayMethod; onChange: (v: PayMethod) => void; }

export const PaymentSelector: React.FC<Props> = ({ value, onChange }) => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
    <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
      <CreditCard size={20} className="text-amber-800" /> 2. Phương Thức Thanh Toán
    </h3>
    <div className="space-y-3">
      {[
        { m: 'bank_transfer' as PayMethod, icon: <QrCode size={24} className="text-amber-800 shrink-0" />, label: 'Chuyển Khoản Ngân Hàng Qua Mã QR', desc: 'Tự động xác nhận & xử lý đơn nhanh nhất' },
        { m: 'cod' as PayMethod, icon: <Banknote size={24} className="text-amber-800 shrink-0" />, label: 'Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)', desc: 'Kiểm tra sản phẩm trước khi thanh toán' },
      ].map(({ m, icon, label, desc }) => (
        <label key={m} onClick={() => onChange(m)}
          className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${value === m ? 'border-amber-900 bg-amber-950/5 ring-1 ring-amber-900' : 'border-stone-200 hover:border-stone-300'}`}>
          {icon}
          <div className="flex-1"><h4 className="font-bold text-stone-900 text-xs">{label}</h4><p className="text-[11px] text-stone-500">{desc}</p></div>
          <Radio checked={value === m} />
        </label>
      ))}
    </div>
    {value === 'bank_transfer' && (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
        <p className="font-bold flex items-center gap-1.5"><CheckCircle2 size={16} className="text-amber-800" /> Mã QR và thông tin chuyển khoản sẽ hiển thị ngay sau khi đặt hàng.</p>
      </div>
    )}
  </div>
);
