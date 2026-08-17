import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '~/services/orderService';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  Clock, 
  QrCode, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { Tag, Steps } from 'antd';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderService.getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không tìm thấy đơn hàng</h2>
        <Link to="/orders" className="inline-block bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const getStepCurrent = () => {
    switch (order.status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipping': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const statusInfo = ORDER_STATUS_LABEL[order.status] || { label: order.status, color: 'default' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-red-700 mb-2">
          <ArrowLeft size={14} /> Quay lại danh sách đơn hàng
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900">
              Chi Tiết Đơn Hàng #{order.id}
            </h1>
            <p className="text-xs text-stone-500">Thời gian khởi tạo: {formatDate(order.createdAt)}</p>
          </div>
          <Tag color={statusInfo.color} className="font-bold text-sm px-4 py-1 rounded-full">
            Trạng thái: {statusInfo.label}
          </Tag>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Tiến Trình Xử Lý Đơn Hàng</h3>
        <Steps
          current={getStepCurrent()}
          items={[
            { title: 'Đặt hàng thành công', description: 'Đã nhận thông tin' },
            { title: 'Xác nhận & Đóng gói', description: 'Chuẩn bị hàng tại kho' },
            { title: 'Đang vận chuyển', description: 'Giao hàng & Lắp đặt' },
            { title: 'Hoàn thành', description: 'Bàn giao sản phẩm' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Product List & QR Bank */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            <h3 className="font-serif-heading font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
              Danh Sách Sản Phẩm Nội Thất
            </h3>

            <div className="space-y-4 divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex items-center gap-4">
                  <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-stone-900 text-sm">{item.product.name}</h4>
                    <p className="text-stone-500">Tùy chọn: {item.selectedColor || 'Gỗ tự nhiên'} | Kích thước: {item.product.dimensions}</p>
                    <p className="text-stone-500">Số lượng: <strong>{item.quantity}</strong> x {formatVND(item.product.price)}</p>
                  </div>
                  <span className="font-bold text-red-700 text-sm">
                    {formatVND(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Bank Transfer Box if Bank Transfer */}
          {order.customerInfo.paymentMethod === 'bank_transfer' && (
            <div className="bg-linear-to-r from-stone-950 via-stone-900 to-red-950 text-stone-100 p-6 sm:p-8 rounded-2xl border border-red-800/40 space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <QrCode size={28} className="text-amber-300" />
                <div>
                  <h4 className="font-serif-heading font-bold text-white text-lg">Chuyển Khoản Ngân Hàng Tự Động (VietQR)</h4>
                  <p className="text-xs text-stone-300">Quét mã QR bằng ứng dụng Mobile Banking của bạn</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl text-stone-900 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="text-center sm:text-left space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Ngân Hàng MB Bank</span>
                  <p className="font-bold text-sm">STK: <span className="font-mono text-red-700">8888999999999</span></p>
                  <p className="text-xs text-stone-600">Chủ tài khoản: <strong>CTCP NOITHAT LUXDECOR</strong></p>
                  <p className="text-xs text-stone-600">Số tiền: <strong className="text-red-700 font-bold text-sm">{formatVND(order.totalAmount)}</strong></p>
                  <p className="text-xs text-stone-600">Nội dung CK: <strong className="font-mono bg-stone-100 px-2 py-0.5 rounded text-red-700">{order.id}</strong></p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=STK:8888999999999-NOITHATLUXDECOR-ND:${order.id}-AMOUNT:${order.totalAmount}`}
                    alt="Mã QR Chuyển Khoản"
                    className="w-36 h-36 rounded"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 font-semibold">Quét mã VietQR nhanh</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Delivery Info & Cost summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs text-xs">
            <h4 className="font-serif-heading font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
              Thông Tin Giao Hàng & Khách Hàng
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-stone-400 block">Họ và tên người nhận:</span>
                <strong className="text-stone-900 text-sm">{order.customerInfo.fullName}</strong>
              </div>

              <div>
                <span className="text-stone-400 block">Số điện thoại:</span>
                <strong className="text-stone-900">{order.customerInfo.phone}</strong>
              </div>

              <div>
                <span className="text-stone-400 block">Email:</span>
                <span className="text-stone-800">{order.customerInfo.email}</span>
              </div>

              <div>
                <span className="text-stone-400 block">Địa chỉ nhận hàng:</span>
                <span className="text-stone-800 leading-normal">
                  {order.customerInfo.address}, {order.customerInfo.district}, {order.customerInfo.city}
                </span>
              </div>

              {order.customerInfo.note && (
                <div>
                  <span className="text-stone-400 block">Ghi chú:</span>
                  <span className="text-stone-700 italic">{order.customerInfo.note}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span>Tạm tính tiền hàng:</span>
                <span>{formatVND(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-red-700">
                  <span>Giảm giá voucher:</span>
                  <span className="font-bold">-{formatVND(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển & Lắp đặt:</span>
                <span>{order.shippingFee === 0 ? <strong className="text-emerald-700">MIỄN PHÍ</strong> : formatVND(order.shippingFee)}</span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-bold text-stone-900 text-sm">Tổng cộng:</span>
                <span className="text-xl font-bold font-serif-heading text-red-700">
                  {formatVND(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
