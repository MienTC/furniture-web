import React, { useState } from 'react';
import { QrcodeOutlined, CopyOutlined, CheckOutlined, BankOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import { formatVND } from '~/common/utils/formatters';
import { usePaymentSettings } from '~/features/checkout/hooks';
import { message } from 'antd';

interface Props {
  orderId: string;
  totalAmount: number;
}

const BANK_SHORT_NAMES: Record<string, string> = {
  'mb': 'MB',
  'mb bank': 'MB',
  'mbbank': 'MB',
  'vietcombank': 'VCB',
  'vcb': 'VCB',
  'techcombank': 'TCB',
  'tcb': 'TCB',
  'vietinbank': 'CTG',
  'ctg': 'CTG',
  'bidv': 'BIDV',
  'acb': 'ACB',
  'vpbank': 'VPB',
  'tpbank': 'TPB',
  'sacombank': 'STB',
  'hdbank': 'HDB',
  'shb': 'SHB',
  'vib': 'VIB',
  'msb': 'MSB',
  'ocb': 'OCB',
  'seabank': 'SSB',
};

function getBankBinOrShort(name?: string): string {
  if (!name) return 'MB';
  const clean = name.trim().toLowerCase();
  return BANK_SHORT_NAMES[clean] || 'MB';
}

export const BankTransferBox: React.FC<Props> = ({ orderId, totalAmount }) => {
  const { data: paymentConfig, isLoading } = usePaymentSettings();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 text-center text-xs">
        Đang tải thông tin chuyển khoản ngân hàng...
      </div>
    );
  }

  const bankName = paymentConfig?.bank_name || '';
  const accountNumber = paymentConfig?.bank_account_number || '';
  const accountHolder = (paymentConfig?.bank_account_holder || '').toUpperCase();
  const bankBin = getBankBinOrShort(bankName);

  if (!accountNumber) {
    return (
      <div className="bg-brand-peach/20 text-stone-900 p-5 rounded-2xl border border-brand-peach/50 text-xs">
        <p className="font-bold">Chưa thiết lập tài khoản ngân hàng nhận thanh toán.</p>
        <p className="text-[11px] mt-1 text-stone-600">Vui lòng liên hệ hotline hoặc Quản trị viên cập nhật tài khoản ngân hàng trong trang Quản trị.</p>
      </div>
    );
  }

  const vietQrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact.png?amount=${Math.round(
    totalAmount
  )}&addInfo=${encodeURIComponent(orderId)}&accountName=${encodeURIComponent(accountHolder)}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    message.success(`Đã sao chép ${field}!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-2xl border border-stone-800 space-y-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-coral/20 text-brand-coral rounded-xl">
            <QrcodeOutlined style={{ fontSize: 26 }} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base sm:text-lg">Thanh Toán Chuyển Khoản (VietQR Chuẩn)</h4>
            <p className="text-xs text-stone-400">Mở ứng dụng ngân hàng quét mã để thanh toán tự động điền STK & số tiền</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          Napas 247 Hỗ trợ 40+ Bank
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl text-stone-900 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2.5">
              <BankOutlined className="text-stone-500 shrink-0" style={{ fontSize: 16 }} />
              <div>
                <span className="text-[10px] text-stone-400 font-medium block">Ngân hàng thụ hưởng</span>
                <span className="font-bold text-xs sm:text-sm text-stone-800">{bankName}</span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(bankName, 'Ngân hàng')}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
              title="Sao chép tên ngân hàng"
            >
              {copiedField === 'Ngân hàng' ? <CheckOutlined className="text-emerald-600" style={{ fontSize: 14 }} /> : <CopyOutlined style={{ fontSize: 14 }} />}
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2.5">
              <CreditCardOutlined className="text-stone-500 shrink-0" style={{ fontSize: 16 }} />
              <div>
                <span className="text-[10px] text-stone-400 font-medium block">Số tài khoản</span>
                <span className="font-mono font-bold text-sm sm:text-base text-brand-coral tracking-wide">
                  {accountNumber}
                </span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(accountNumber, 'Số tài khoản')}
              className="px-2.5 py-1 text-xs font-semibold bg-[#2B5A50] text-white rounded-lg hover:bg-[#20453D] flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'Số tài khoản' ? <CheckOutlined style={{ fontSize: 13 }} /> : <CopyOutlined style={{ fontSize: 13 }} />}
              <span>{copiedField === 'Số tài khoản' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2.5">
              <UserOutlined className="text-stone-500 shrink-0" style={{ fontSize: 16 }} />
              <div>
                <span className="text-[10px] text-stone-400 font-medium block">Chủ tài khoản</span>
                <span className="font-bold text-xs sm:text-sm text-stone-800">{accountHolder}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-brand-peach/15 border border-brand-peach/50">
              <span className="text-[10px] text-brand-coral font-bold block">Số tiền cần chuyển</span>
              <span className="font-bold text-sm sm:text-base text-brand-coral">{formatVND(totalAmount)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-sky-800 font-medium block">Nội dung chuyển tiền</span>
                <span className="font-mono font-bold text-xs sm:text-sm text-sky-950">{orderId}</span>
              </div>
              <button
                onClick={() => copyToClipboard(orderId, 'Nội dung CK')}
                className="p-1.5 text-sky-700 hover:text-sky-900 rounded-md cursor-pointer"
                title="Sao chép nội dung"
              >
                {copiedField === 'Nội dung CK' ? <CheckOutlined className="text-emerald-600" style={{ fontSize: 14 }} /> : <CopyOutlined style={{ fontSize: 14 }} />}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-stone-50 rounded-2xl border border-stone-200">
          <img
            src={vietQrUrl}
            alt="VietQR Chuyển Khoản"
            className="w-48 h-auto object-contain rounded-xl shadow-xs border border-white"
            loading="lazy"
          />
          <div className="mt-2 text-center">
            <span className="text-[11px] font-semibold text-stone-600 block">Quét QR qua App Ngân Hàng</span>
            <span className="text-[10px] text-stone-400">Tự điền số tiền & nội dung đơn #{orderId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
