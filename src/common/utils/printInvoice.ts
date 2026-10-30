import { formatVND, formatDate } from '~/common/utils/formatters';

export interface InvoiceCompanyInfo {
  companyName?: string;
  address?: string;
  hotline?: string;
  taxCode?: string;
  email?: string;
  website?: string;
}

export interface InvoiceData {
  id: string;
  createdAt: string;
  recipient_name: string;
  phone: string;
  address_line?: string;
  district?: string;
  city?: string;
  note?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentTransactionId?: string;
  items: Array<{
    productName: string;
    selectedColor?: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discountAmount?: number;
  shippingFee?: number;
  totalAmount: number;
}

/**
 * Utility in hóa đơn A4 thương mại chuẩn cho LuxDecor
 * Mở iframe in độc lập, loại bỏ hoàn toàn header/footer trình duyệt (localhost/ngày tháng)
 */
export const printInvoiceA4 = (order: InvoiceData, customInfo?: InvoiceCompanyInfo) => {
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow?.document;
  if (!frameDoc) return;

  const fullAddress = [order.address_line, order.district, order.city].filter(Boolean).join(', ');
  const paymentMethodText =
    order.paymentMethod === 'bank_transfer'
      ? 'Chuyển khoản VietQR'
      : order.paymentMethod === 'cod'
      ? 'Thanh toán khi nhận hàng (COD)'
      : order.paymentMethod?.toUpperCase() || '-';
  const paymentStatusText = order.paymentStatus === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN';

  const companyName = customInfo?.companyName || 'CÔNG TY TNHH KIẾN TRÚC & NỘI THẤT LUXDECOR';
  const address = customInfo?.address || 'Tòa nhà Detech Tower, Số 8 Tôn Thất Thuyết, Mỹ Đình 2, Cầu Giấy, Hà Nội';
  const hotline = customInfo?.hotline || '1900 8888 - 0988 888 888';
  const taxCode = customInfo?.taxCode || '0108998899';
  const email = customInfo?.email || 'contact@luxdecor.vn';
  const website = customInfo?.website || 'www.luxdecor.vn';

  const rowsHtml = (order.items || [])
    .map(
      (item, idx) => `
      <tr>
        <td style="text-align: center; padding: 8px 6px; border: 1px solid #cbd5e1;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">
          <div style="font-weight: 600; color: #0f172a;">${item.productName}</div>
          ${
            item.selectedColor
              ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">Phân loại: ${item.selectedColor}</div>`
              : ''
          }
        </td>
        <td style="text-align: center; padding: 8px 6px; border: 1px solid #cbd5e1;">Cái/Bộ</td>
        <td style="text-align: center; font-weight: 600; padding: 8px 6px; border: 1px solid #cbd5e1;">${item.quantity}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #cbd5e1;">${formatVND(item.unitPrice || 0)}</td>
        <td style="text-align: right; font-weight: 600; padding: 8px; border: 1px solid #cbd5e1;">${formatVND(item.lineTotal || 0)}</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8" />
      <title>Hóa Đơn Bán Hàng - ${order.id}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 0mm; /* Triệt tiêu hoàn toàn header/footer trình duyệt như URL localhost */
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Times New Roman', Times, 'Segoe UI', Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 16mm 18mm;
          line-height: 1.45;
          font-size: 13px;
          background: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 14px;
          border-bottom: 2px solid #2B5A50;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 15px;
          font-weight: bold;
          color: #2B5A50;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 4px;
        }
        .company-info {
          font-size: 11.5px;
          color: #475569;
          margin: 2px 0;
        }
        .invoice-title-block {
          text-align: right;
        }
        .invoice-title {
          font-size: 19px;
          font-weight: bold;
          color: #0f172a;
          margin: 0 0 4px;
          text-transform: uppercase;
        }
        .invoice-sub {
          font-size: 11px;
          color: #64748b;
          font-style: italic;
          margin-bottom: 4px;
        }
        .invoice-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 13px;
          font-weight: bold;
          color: #2B5A50;
        }
        .info-grid {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 12px 14px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }
        .info-col {
          width: 48%;
        }
        .info-row {
          margin: 4px 0;
          font-size: 12.5px;
        }
        .info-label {
          font-weight: 600;
          color: #334155;
          display: inline-block;
          min-width: 120px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-weight: 700;
          padding: 9px 8px;
          border: 1px solid #cbd5e1;
          font-size: 12px;
          text-transform: uppercase;
        }
        .summary-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        .summary-box {
          width: 320px;
          font-size: 12.5px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          color: #334155;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 8px 0 4px;
          margin-top: 6px;
          border-top: 2px solid #2B5A50;
          font-size: 14px;
          font-weight: bold;
          color: #2B5A50;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          text-align: center;
          margin-top: 30px;
          page-break-inside: avoid;
        }
        .sign-col {
          width: 30%;
        }
        .sign-title {
          font-weight: bold;
          font-size: 12.5px;
          text-transform: uppercase;
          margin: 0;
        }
        .sign-sub {
          font-size: 11px;
          color: #64748b;
          font-style: italic;
          margin: 3px 0 0;
        }
        .sign-space {
          height: 75px;
        }
        .sign-name {
          font-weight: 600;
          font-size: 12.5px;
          margin: 0;
        }
        .footer-note {
          text-align: center;
          font-size: 11px;
          color: #64748b;
          margin-top: 40px;
          padding-top: 12px;
          border-top: 1px dashed #cbd5e1;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: flex; align-items: flex-start; gap: 14px;">
          <img src="/logo1.png" alt="LuxDecor" style="height: 52px; width: auto; object-fit: contain; margin-top: 2px;" />
          <div>
            <h1 class="company-name">${companyName}</h1>
            <p class="company-info">Địa chỉ: ${address}</p>
            <p class="company-info">Hotline: ${hotline} | Mã số thuế: ${taxCode}</p>
            <p class="company-info">Email: ${email} | Website: ${website}</p>
          </div>
        </div>
        <div class="invoice-title-block">
          <h2 class="invoice-title">HÓA ĐƠN BÁN HÀNG</h2>
          <div class="invoice-sub">(Kiêm phiếu xuất kho và giao vận)</div>
          <div class="invoice-code">Số: ${order.id}</div>
          <div style="font-size: 11.5px; color: #475569; margin-top: 3px;">
            Ngày lập: ${formatDate(order.createdAt)}
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-col">
          <div class="info-row"><span class="info-label">Khách hàng:</span> <strong>${order.recipient_name}</strong></div>
          <div class="info-row"><span class="info-label">Số điện thoại:</span> ${order.phone}</div>
          <div class="info-row"><span class="info-label">Địa chỉ nhận hàng:</span> ${fullAddress || '-'}</div>
          ${order.note ? `<div class="info-row"><span class="info-label">Ghi chú:</span> <em>${order.note}</em></div>` : ''}
        </div>
        <div class="info-col">
          <div class="info-row"><span class="info-label">Hình thức thanh toán:</span> ${paymentMethodText}</div>
          <div class="info-row"><span class="info-label">Trạng thái thanh toán:</span> <strong>${paymentStatusText}</strong></div>
          ${
            order.paymentTransactionId
              ? `<div class="info-row"><span class="info-label">Mã giao dịch:</span> <code style="background:#e2e8f0;padding:2px 4px;border-radius:3px;">${order.paymentTransactionId}</code></div>`
              : ''
          }
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">STT</th>
            <th style="text-align: left;">Tên Sản Phẩm / Quy Cách</th>
            <th style="width: 70px; text-align: center;">ĐVT</th>
            <th style="width: 70px; text-align: center;">SL</th>
            <th style="width: 130px; text-align: right;">Đơn Giá</th>
            <th style="width: 140px; text-align: right;">Thành Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="summary-wrapper">
        <div class="summary-box">
          <div class="summary-row">
            <span>Tiền hàng:</span>
            <span>${formatVND(order.subtotal || 0)}</span>
          </div>
          ${
            order.discountAmount && order.discountAmount > 0
              ? `
            <div class="summary-row" style="color: #e11d48;">
              <span>Chiết khấu Voucher:</span>
              <span>-${formatVND(order.discountAmount)}</span>
            </div>
          `
              : ''
          }
          <div class="summary-row">
            <span>Phí giao hàng & lắp đặt:</span>
            <span>${order.shippingFee ? formatVND(order.shippingFee) : 'Miễn phí'}</span>
          </div>
          <div class="summary-total">
            <span>TỔNG TIỀN THANH TOÁN:</span>
            <span>${formatVND(order.totalAmount || 0)}</span>
          </div>
        </div>
      </div>

      <div class="signatures">
        <div class="sign-col">
          <p class="sign-title">NGƯỜI MUA HÀNG</p>
          <p class="sign-sub">(Ký, ghi rõ họ tên)</p>
          <div class="sign-space"></div>
          <p class="sign-name">${order.recipient_name}</p>
        </div>
        <div class="sign-col">
          <p class="sign-title">NGƯỜI LẬP HÓA ĐƠN</p>
          <p class="sign-sub">(Ký, ghi rõ họ tên)</p>
          <div class="sign-space"></div>
          <p class="sign-name">Bộ Phận Bán Hàng LuxDecor</p>
        </div>
        <div class="sign-col">
          <p class="sign-title">THỦ KHO XUẤT HÀNG</p>
          <p class="sign-sub">(Ký, đóng dấu)</p>
          <div class="sign-space"></div>
          <p class="sign-name">Kho Tổng LuxDecor</p>
        </div>
      </div>

      <div class="footer-note">
        Cảm ơn Quý khách đã tin tưởng và mua sắm tại LuxDecor! Mọi thắc mắc xin vui lòng liên hệ Hotline: ${hotline}.
      </div>
    </body>
    </html>
  `;

  frameDoc.open();
  frameDoc.write(htmlContent);
  frameDoc.close();

  setTimeout(() => {
    printFrame.contentWindow?.focus();
    printFrame.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
    }, 1500);
  }, 300);
};
