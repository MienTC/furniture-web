import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopyOutlined, CheckCircleOutlined, LoginOutlined, UserAddOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useCart } from '~/contexts/CartContext';
import type { IFVoucher } from '~/types';

export const VoucherSuccessPopup: React.FC<{ voucher: IFVoucher; onClose: () => void }> = ({ voucher, onClose }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { applyVoucher, appliedVoucher } = useCart();
  const isApplied = appliedVoucher?.code === voucher.code;

  const handleCopy = () => {
    navigator.clipboard?.writeText(voucher.code);
    setCopied(true);
    message.success('Đã sao chép mã!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleUseNow = async () => {
    await applyVoucher(voucher.code);
    onClose();
    navigate('/cart');
  };

  return (
    <div className="text-center space-y-5 py-2">
      <div>
        <p className="text-stone-500 text-xs mb-1">Mã giảm giá đã được lưu vào phiên mua hàng</p>
        <div className="inline-flex items-center gap-3 bg-brand-peach/15 border-2 border-dashed border-brand-coral rounded-xl px-5 py-3">
          <span className="text-2xl font-bold tracking-widest text-brand-coral font-mono">{voucher.code}</span>
          <button onClick={handleCopy} className="p-1.5 rounded-lg bg-brand-coral hover:bg-[#c95f5f] text-white transition-colors cursor-pointer">
            {copied ? <CheckCircleOutlined style={{ fontSize: 16 }} /> : <CopyOutlined style={{ fontSize: 16 }} />}
          </button>
        </div>
      </div>
      <p className="text-sm text-stone-600">{voucher.description}</p>
      
      <div className="space-y-2">
        <Button
          type="primary"
          block
          onClick={handleUseNow}
          icon={isApplied ? <CheckOutlined /> : undefined}
          className="!bg-brand-coral hover:!bg-[#c95f5f] !border-0 font-bold cursor-pointer !h-10"
        >
          {isApplied ? 'Đã áp dụng — Đến giỏ hàng' : 'Áp dụng vào giỏ hàng ngay'}
        </Button>
      </div>
    </div>
  );
};

export const LoginRequiredPopup: React.FC<{ onClose: () => void; onOpenAuth?: (tab: 'login' | 'register') => void }> = ({ onClose, onOpenAuth }) => {
  return (
    <div className="text-center space-y-5 py-2">
      <div className="w-16 h-16 rounded-full bg-brand-peach/30 flex items-center justify-center mx-auto">
        <LoginOutlined className="text-brand-coral" style={{ fontSize: 30 }} />
      </div>
      <div>
        <h3 className="font-bold text-lg text-stone-900">Đăng nhập để nhận mã</h3>
        <p className="text-stone-500 text-sm mt-1">Bạn cần có tài khoản để lưu và sử dụng mã giảm giá.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          type="primary"
          block
          icon={<LoginOutlined style={{ fontSize: 15 }} />}
          onClick={() => {
            onClose();
            if (onOpenAuth) onOpenAuth('login');
          }}
          className="!bg-brand-coral hover:!bg-[#c95f5f] !border-0 font-bold cursor-pointer"
        >
          Đăng Nhập
        </Button>
        <Button
          block
          icon={<UserAddOutlined style={{ fontSize: 15 }} />}
          onClick={() => {
            onClose();
            if (onOpenAuth) onOpenAuth('register');
          }}
          className="!border-brand-coral !text-brand-coral hover:!bg-brand-peach/15 font-bold cursor-pointer"
        >
          Tạo Tài Khoản Mới
        </Button>
      </div>
    </div>
  );
};
