import React, { useState } from 'react';
import { Flame, Clock, Tag as TagIcon, X } from 'lucide-react';
import { Skeleton, Modal } from 'antd';
import { useAuth } from '~/contexts/AuthContext';
import { VoucherSuccessPopup, LoginRequiredPopup } from './VoucherPopup';
import type { IFVoucher } from '~/mock/vouchers/mock-vouchers';

interface Props { vouchers: IFVoucher[]; isLoading: boolean; }

const VoucherCard: React.FC<{ voucher: IFVoucher; onClaim: (v: IFVoucher) => void }> = ({ voucher: v, onClaim }) => (
  <div className="relative flex rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-white">    
    <div className="flex-1 px-4 py-4 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-stone-900 font-mono bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5">{v.code}</span>
          {v.discountType === 'percentage' && (
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">-{v.discountValue}%</span>
          )}
        </div>
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{v.description}</p>
      </div>
      <button onClick={() => onClaim(v)} className="self-start text-xs font-bold text-white bg-amber-800 hover:bg-amber-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
        <TagIcon size={13} /> Nhận mã ngay
      </button>
    </div>
  </div>
);

export const VoucherSection: React.FC<Props> = ({ vouchers, isLoading }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState<IFVoucher | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-base font-bold text-stone-900">Mã Giảm Giá Hôm Nay</h2>
        <span className="ml-auto text-xs text-stone-500 flex items-center gap-1"><Clock size={13} /> Cập nhật mỗi ngày</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <Skeleton key={i} active />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.map(v => <VoucherCard key={v.code} voucher={v} onClaim={(v) => { setActive(v); setModalOpen(true); }} />)}
        </div>
      )}

      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} centered width={400}
        closeIcon={<X size={18} />}
        title={<span className="font-bold text-stone-900">{user ? 'Nhận mã thành công!' : 'Yêu cầu đăng nhập'}</span>}
      >
        {user && active
          ? <VoucherSuccessPopup voucher={active} onClose={() => setModalOpen(false)} />
          : <LoginRequiredPopup onClose={() => setModalOpen(false)} />
        }
      </Modal>
    </section>
  );
};
