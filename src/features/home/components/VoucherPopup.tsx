import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag as TagIcon, Copy, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import { Button, message } from 'antd';
import type { IFVoucher } from '~/mock/vouchers/mock-vouchers';

export const VoucherSuccessPopup: React.FC<{ voucher: IFVoucher; onClose: () => void }> = ({ voucher, onClose }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(voucher.code);
    setCopied(true);
    message.success('Đã sao chép mã!');
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div className="text-center space-y-5 py-2">
      <div>
        <p className="text-stone-500 text-xs mb-1">Mã giảm giá của bạn</p>
        <div className="inline-flex items-center gap-3 bg-amber-50 border-2 border-dashed border-amber-400 rounded-xl px-5 py-3">
          <span className="text-2xl font-bold tracking-widest text-amber-900 font-mono">{voucher.code}</span>
          <button onClick={handleCopy} className="p-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white transition-colors">
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <p className="text-sm text-stone-600">{voucher.description}</p>
      <Button type="primary" block onClick={onClose} className="!bg-amber-800 hover:!bg-amber-700 !border-0 font-bold">
        Dùng ngay khi mua hàng
      </Button>
    </div>
  );
};

export const LoginRequiredPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-5 py-2">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
        <LogIn size={30} className="text-amber-700" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-stone-900">Đăng nhập để nhận mã</h3>
        <p className="text-stone-500 text-sm mt-1">Bạn cần có tài khoản để lưu và sử dụng mã giảm giá.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button type="primary" block icon={<LogIn size={15} />} onClick={() => { navigate('/login'); onClose(); }} className="!bg-amber-800 hover:!bg-amber-700 !border-0 font-bold">
          Đăng Nhập
        </Button>
        <Button block icon={<UserPlus size={15} />} onClick={() => { navigate('/register'); onClose(); }} className="!border-amber-700 !text-amber-800 font-bold">
          Tạo Tài Khoản Mới
        </Button>
      </div>
    </div>
  );
};
