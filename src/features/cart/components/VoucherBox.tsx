import React, { useState } from 'react';
import { TagOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import type { Voucher, IFVoucher } from '~/types';

interface Props {
  appliedVoucher: Voucher | null;
  suggestedVouchers: (Voucher | IFVoucher)[];
  onApply: (c: string) => void;
  onRemove: () => void;
}

export const VoucherBox: React.FC<Props> = ({ appliedVoucher, suggestedVouchers, onApply, onRemove }) => {
  const [input, setInput] = useState('');
  const apply = (code?: string) => { const c = code ?? input; if (c) { onApply(c); setInput(''); } };
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
      <h2 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
        <TagOutlined className="text-brand-coral" style={{ fontSize: 16 }} /> Mã Giảm Giá
      </h2>
      {appliedVoucher ? (
        <div className="p-3.5 rounded-xl bg-brand-peach/20 border border-brand-peach/60 flex items-center justify-between">
          <div>
            <span className="font-mono font-bold text-stone-900 text-xs block">{appliedVoucher.code}</span>
            <span className="text-xs text-[#B33D3D] font-semibold">{appliedVoucher.description}</span>
          </div>
          <button onClick={onRemove} className="text-stone-500 hover:text-rose-600 cursor-pointer p-1">
            <CloseOutlined style={{ fontSize: 14 }} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestedVouchers.length > 0 && (
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Chọn nhanh mã ưu đãi:
              </label>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                {suggestedVouchers.map((v) => (
                  <div
                    key={v.code}
                    onClick={() => apply(v.code)}
                    className="p-3 bg-white hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-brand-coral bg-brand-peach/20 px-2 py-0.5 rounded border border-brand-coral/30">
                          {v.code}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          Giảm {v.discountValue}{v.discountType === 'percentage' ? '%' : '₫'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-1 font-medium">
                        {v.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2B5A50] text-white group-hover:bg-[#20453D] transition-colors shrink-0 shadow-2xs"
                    >
                      Áp Dụng
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Hoặc nhập mã khác:
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã voucher..."
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="!rounded-lg text-xs !py-1.5"
              />
              <Button
                onClick={() => apply()}
                type="primary"
                className="!bg-[#2B5A50] hover:!bg-[#20453D] font-bold text-xs cursor-pointer !h-auto !py-1.5 px-4"
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
