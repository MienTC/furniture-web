import React, { useState } from 'react';
import { ClockCircleOutlined, TagOutlined, CloseOutlined } from '@ant-design/icons';
import { Skeleton, Modal } from 'antd';
import { useAuth } from '~/contexts/AuthContext';
import { VoucherSuccessPopup, LoginRequiredPopup } from './VoucherPopup';
import { AuthModal } from '~/components/ui/AuthModal';
import type { IFVoucher } from '~/types';

interface Props { vouchers: IFVoucher[]; isLoading: boolean; }

const VoucherCard: React.FC<{ voucher: IFVoucher; onClaim: (v: IFVoucher) => void }> = ({ voucher: v, onClaim }) => (
  <div className="relative flex rounded-2xl overflow-hidden border border-stone-200 bg-white hover:border-brand-coral/40 hover:shadow-md transition-all duration-300">
    {/* Left decorative ticket punch/strip */}
    <div className="w-2.5 bg-brand-coral shrink-0" />

    {/* Content */}
    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-black text-stone-900 font-mono bg-stone-100 border border-stone-300/80 rounded-md px-2.5 py-1 tracking-wider">
            {v.code}
          </span>
          {v.discountType === 'percentage' && (
            <span className="text-xs bg-brand-coral/10 text-brand-coral border border-brand-coral/25 font-black px-2.5 py-0.5 rounded-full uppercase">
              Giảm {v.discountValue}%
            </span>
          )}
          {v.discountType === 'fixed' && (
            <span className="text-xs bg-stone-100 text-stone-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
              Ưu đãi tiền mặt
            </span>
          )}
        </div>
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
          {v.description}
        </p>
      </div>

      <div className="pt-2 border-t border-dashed border-stone-100 flex items-center justify-between gap-2">
        <span className="text-xs text-stone-500 font-medium">Hạn sử dụng có hạn</span>
        <button
          type="button"
          onClick={() => onClaim(v)}
          className="text-xs font-bold text-brand-coral hover:text-white bg-brand-coral/10 hover:bg-brand-coral px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <TagOutlined style={{ fontSize: 12 }} /> Lưu mã
        </button>
      </div>
    </div>
  </div>
);

export const VoucherSection: React.FC<Props> = ({ vouchers, isLoading }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [active, setActive] = useState<IFVoucher | null>(null);

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-coral/10 text-brand-coral flex items-center justify-center">
            <TagOutlined style={{ fontSize: 16 }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 leading-none">Mã Giảm Giá Hôm Nay</h2>
            <p className="text-xs text-stone-500 mt-0.5">Săn voucher ưu đãi cho đơn hàng của bạn</p>
          </div>
        </div>
        <span className="text-xs text-stone-400 flex items-center gap-1 self-start sm:self-auto">
          <ClockCircleOutlined style={{ fontSize: 12 }} /> Cập nhật liên tục
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Skeleton key={i} active />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.map(v => <VoucherCard key={v.code} voucher={v} onClaim={(v) => { setActive(v); setModalOpen(true); }} />)}
        </div>
      )}

      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} centered width={400}
        closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
        title={<span className="font-bold text-stone-900">{user ? 'Nhận mã thành công!' : 'Yêu cầu đăng nhập'}</span>}
      >
        {user && active
          ? <VoucherSuccessPopup voucher={active} onClose={() => setModalOpen(false)} />
          : <LoginRequiredPopup onClose={() => setModalOpen(false)} onOpenAuth={handleOpenAuth} />
        }
      </Modal>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </section>
  );
};
