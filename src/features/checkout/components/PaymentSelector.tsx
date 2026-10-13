import React from 'react';
import { CreditCardOutlined, QrcodeOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Radio } from 'antd';
import type { OrderCustomerInfo } from '~/types';

type PayMethod = OrderCustomerInfo['paymentMethod'];
interface Props { value: PayMethod; onChange: (v: PayMethod) => void; }

export const PaymentSelector: React.FC<Props> = ({ value, onChange }) => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
    <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
      <CreditCardOutlined className="text-brand-coral" style={{ fontSize: 20 }} /> 2. Phương Thức Thanh Toán
    </h3>
    <div className="space-y-3">
      {[
        { m: 'vnpay' as PayMethod, icon: <CreditCardOutlined className="text-sky-600 shrink-0" style={{ fontSize: 24 }} />, label: 'Cổng Thanh Toán VNPay (ATM / QR Pay / Visa)', desc: 'Thanh toán trực tuyến bảo mật qua cổng VNPay' },
        { m: 'bank_transfer' as PayMethod, icon: <QrcodeOutlined className="text-brand-coral shrink-0" style={{ fontSize: 24 }} />, label: 'Chuyển Khoản Ngân Hàng Qua Mã QR', desc: 'Tự động xác nhận & xử lý đơn nhanh nhất' },
        { m: 'cod' as PayMethod, icon: <DollarOutlined className="text-brand-coral shrink-0" style={{ fontSize: 24 }} />, label: 'Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)', desc: 'Kiểm tra sản phẩm trước khi thanh toán' },
      ].map(({ m, icon, label, desc }) => (
        <label key={m} onClick={() => onChange(m)}
          className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${value === m ? 'border-brand-coral bg-brand-peach/10 ring-1 ring-brand-coral' : 'border-stone-200 hover:border-brand-peach/50'}`}>
          {icon}
          <div className="flex-1"><h4 className="font-bold text-stone-900 text-xs">{label}</h4><p className="text-[11px] text-stone-500">{desc}</p></div>
          <Radio checked={value === m} />
        </label>
      ))}
    </div>
    {value === 'bank_transfer' && (
      <div className="p-4 rounded-xl bg-brand-cream/30 border border-brand-peach/40 text-xs text-stone-800">
        <p className="font-bold flex items-center gap-1.5"><CheckCircleOutlined className="text-brand-coral" style={{ fontSize: 16 }} /> Mã QR và thông tin chuyển khoản sẽ hiển thị ngay sau khi đặt hàng.</p>
      </div>
    )}
  </div>
);
