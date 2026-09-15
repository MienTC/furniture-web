import React, { useState } from 'react';
import { Tag as TagIcon, X } from 'lucide-react';
import { Input, Button } from 'antd';
import type { Voucher } from '~/types';

interface Props { appliedVoucher: Voucher | null; suggestedVouchers: Voucher[]; onApply: (c: string) => void; onRemove: () => void; }

export const VoucherBox: React.FC<Props> = ({ appliedVoucher, suggestedVouchers, onApply, onRemove }) => {
  const [input, setInput] = useState('');
  const apply = (code?: string) => { const c = code ?? input; if (c) { onApply(c); setInput(''); } };
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5"><TagIcon size={16} className="text-amber-800" /> Mã Giảm Giá</h4>
      {appliedVoucher ? (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="font-mono font-bold text-amber-950 text-xs block">{appliedVoucher.code}</span>
            <span className="text-[11px] text-amber-800">{appliedVoucher.description}</span>
          </div>
          <button onClick={onRemove} className="text-stone-400 hover:text-rose-600"><X size={16} /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input placeholder="Nhập mã voucher..." value={input} onChange={e => setInput(e.target.value.toUpperCase())} className="!rounded-lg text-xs" />
          <Button onClick={() => apply()} type="primary" className="!bg-amber-900 font-bold text-xs">Áp Dụng</Button>
        </div>
      )}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <span className="text-[11px] font-bold text-stone-500 block">Mã gợi ý:</span>
        {suggestedVouchers.map(v => (
          <button key={v.code} onClick={() => apply(v.code)} className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 flex items-center justify-between text-xs transition-colors">
            <span className="font-mono font-bold text-amber-900">{v.code}</span>
            <span className="text-[10px] text-stone-500">{v.discountValue}{v.discountType === 'percentage' ? '%' : '₫'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
