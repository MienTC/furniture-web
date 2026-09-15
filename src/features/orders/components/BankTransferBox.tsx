import React from 'react';
import { QrCode } from 'lucide-react';
import { formatVND } from '~/common/utils/formatters';
import { MOCK_BANK_INFO } from '~/mock/payment/mock-payment';

interface Props { orderId: string; totalAmount: number; }

export const BankTransferBox: React.FC<Props> = ({ orderId, totalAmount }) => {
  const bank = MOCK_BANK_INFO;
  const qrData = `STK:${bank.accountNumber}-${bank.accountHolder.replace(/\s/g, '')}-ND:${orderId}-AMOUNT:${totalAmount}`;
  return (
    <div className="bg-amber-950 text-amber-50 p-6 sm:p-8 rounded-2xl border border-amber-800 space-y-4">
      <div className="flex items-center gap-3">
        <QrCode size={28} className="text-amber-400" />
        <div>
          <h4 className="font-bold text-white text-lg">Chuyển Khoản Ngân Hàng (VietQR)</h4>
          <p className="text-xs text-amber-200">Quét mã QR bằng ứng dụng Mobile Banking</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl text-stone-900 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Ngân Hàng {bank.bankName}</span>
          <p className="font-bold text-sm">STK: <span className="font-mono text-amber-900">{bank.accountNumber}</span></p>
          <p className="text-xs text-stone-600">Chủ TK: <strong>{bank.accountHolder}</strong></p>
          <p className="text-xs text-stone-600">Số tiền: <strong className="text-amber-950">{formatVND(totalAmount)}</strong></p>
          <p className="text-xs text-stone-600">Nội dung: <strong className="font-mono bg-stone-100 px-2 py-0.5 rounded text-amber-900">{orderId}</strong></p>
        </div>
        <div className="flex flex-col items-center p-3 bg-stone-50 rounded-xl border border-stone-200">
          <img src={`${bank.qrApiBase}?size=160x160&data=${encodeURIComponent(qrData)}`} alt="QR" className="w-36 h-36 rounded" />
          <span className="text-[10px] text-stone-500 mt-1 font-semibold">Quét mã VietQR</span>
        </div>
      </div>
    </div>
  );
};
