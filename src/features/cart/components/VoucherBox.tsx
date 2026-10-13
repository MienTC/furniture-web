import React, { useState } from 'react';
import { TagOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import type { Voucher } from '~/types';

interface Props { appliedVoucher: Voucher | null; suggestedVouchers: Voucher[]; onApply: (c: string) => void; onRemove: () => void; }

export const VoucherBox: React.FC<Props> = ({ appliedVoucher, suggestedVouchers, onApply, onRemove }) => {
  const [input, setInput] = useState('');
  const apply = (code?: string) => { const c = code ?? input; if (c) { onApply(c); setInput(''); } };
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5"><TagOutlined className="text-brand-coral" style={{ fontSize: 16 }} /> Mã Giảm Giá</h4>
      {appliedVoucher ? (
        <div className="p-3 rounded-xl bg-brand-peach/15 border border-brand-peach/40 flex items-center justify-between">
          <div>
            <span className="font-mono font-bold text-stone-900 text-xs block">{appliedVoucher.code}</span>
            <span className="text-[11px] text-brand-coral font-medium">{appliedVoucher.description}</span>
          </div>
          <button onClick={onRemove} className="text-stone-400 hover:text-rose-600 cursor-pointer"><CloseOutlined style={{ fontSize: 14 }} /></button>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestedVouchers.length > 0 && (
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">
                Chọn nhanh mã ưu đãi:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {suggestedVouchers.map((v) => (
                  <div
                    key={v.code}
                    onClick={() => apply(v.code)}
                    className="p-2.5 rounded-xl border border-dashed border-brand-coral/40 bg-brand-peach/10 hover:bg-brand-peach/25 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-brand-coral bg-white px-2 py-0.5 rounded shadow-2xs">
                          {v.code}
                        </span>
                        <span className="text-[11px] font-bold text-stone-900">
                          Giảm {v.discountValue}{v.discountType === 'percentage' ? '%' : '₫'}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                        {v.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-brand-coral text-white group-hover:bg-[#c95f5f] transition-colors shrink-0"
                    >
                      Áp Dụng
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100">
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              Hoặc nhập mã khác:
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã voucher..."
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="!rounded-lg text-xs"
              />
              <Button
                onClick={() => apply()}
                type="primary"
                className="!bg-brand-coral hover:!bg-[#c95f5f] font-bold text-xs cursor-pointer"
              >
                Áp Dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
