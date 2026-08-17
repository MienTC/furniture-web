import React, { useState } from 'react';
import { Button, message } from 'antd';
import { MOCK_VOUCHERS } from '~/mock/data';
import { Check, Copy } from 'lucide-react';

export interface VoucherItemProps {
  code: string;
  description: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
}

export const VoucherCard: React.FC<{ voucher: VoucherItemProps }> = ({ voucher }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(voucher.code);
    setCopied(true);
    message.success(`Đã sao chép mã ${voucher.code}`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-5 rounded-2xl bg-linear-to-r from-stone-900 via-red-950/80 to-stone-900 text-stone-100 border border-red-800/40 shadow-md flex items-center justify-between transition-transform hover:-translate-y-0.5">
      <div>
        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
          Mã Giảm Giá Ưu Đãi
        </span>
        <h4 className="font-bold text-lg text-white font-mono">{voucher.code}</h4>
        <p className="text-xs text-stone-300 mt-1 line-clamp-1">{voucher.description}</p>
      </div>
      <Button
        type="primary"
        size="small"
        onClick={handleCopy}
        className="!bg-white hover:!bg-stone-100 !text-red-700 font-bold text-xs shadow-sm !border-none flex items-center gap-1"
      >
        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
        {copied ? 'Đã Lưu' : 'Lấy Mã'}
      </Button>
    </div>
  );
};

export const VoucherSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_VOUCHERS.map((v) => (
          <VoucherCard key={v.code} voucher={v} />
        ))}
      </div>
    </section>
  );
};
