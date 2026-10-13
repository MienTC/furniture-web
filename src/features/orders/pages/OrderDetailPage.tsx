import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { OrderTimeline } from '~/features/orders/components/OrderTimeline';
import { BankTransferBox } from '~/features/orders/components/BankTransferBox';
import { OrderSummaryPanel } from '~/features/orders/components/OrderSummaryPanel';
import { useOrderDetail, useCancelOrder } from '~/features/orders/hooks';
import { useCreateVNPayUrl } from '~/features/checkout/hooks';
import { ArrowLeftOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, CreditCardOutlined, StopOutlined } from '@ant-design/icons';
import { Tag, Spin, Button, Modal, message } from 'antd';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const paymentStatusParam = searchParams.get('payment');

  const { data: order, isLoading } = useOrderDetail(orderId);
  const { mutateAsync: cancelOrderMutation, isPending: isCancelling } = useCancelOrder();
  const { mutateAsync: createVNPayUrlMutation, isPending: isPayingVNPay } = useCreateVNPayUrl();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không tìm thấy đơn hàng #{orderId}</h2>
        <Link to="/products" className="inline-block bg-brand-coral hover:bg-[#c95f5f] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS_LABEL[order.status] ?? { label: order.status, color: 'default' };

  const handleCancelOrder = () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: `Bạn có chắc chắn muốn hủy đơn hàng #${order.id}? Hành động này sẽ hoàn lại tồn kho sản phẩm.`,
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk: async () => {
        try {
          await cancelOrderMutation(order.id);
          message.success('Đã hủy đơn hàng thành công');
        } catch (err: any) {
          message.error(err?.response?.data?.message || err?.message || 'Không thể hủy đơn hàng');
        }
      },
    });
  };

  const handleRetryVNPay = async () => {
    try {
      message.loading('Đang khởi tạo liên kết VNPay...', 1);
      const res = await createVNPayUrlMutation(order.id);
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || 'Không thể tạo liên kết thanh toán');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner thông báo kết quả từ VNPay Callback nếu có */}
      {paymentStatusParam === 'success' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800">
          <CheckCircleOutlined className="text-emerald-600 shrink-0" style={{ fontSize: 24 }} />
          <div className="text-sm">
            <p className="font-bold">Thanh toán trực tuyến thành công!</p>
            <p className="text-xs text-emerald-700">Đơn hàng #{order.id} đã được xác nhận thanh toán qua VNPay.</p>
          </div>
        </div>
      )}

      {paymentStatusParam === 'failed' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800">
          <div className="flex items-center gap-3">
            <CloseCircleOutlined className="text-rose-600 shrink-0" style={{ fontSize: 24 }} />
            <div className="text-sm">
              <p className="font-bold">Giao dịch thanh toán không thành công</p>
              <p className="text-xs text-rose-700">Bạn đã hủy giao dịch hoặc thẻ không đủ điều kiện. Bạn có thể thanh toán lại bên dưới.</p>
            </div>
          </div>
          <Button
            type="primary"
            danger
            loading={isPayingVNPay}
            icon={<CreditCardOutlined style={{ fontSize: 14 }} />}
            onClick={handleRetryVNPay}
            className="!rounded-lg text-xs font-semibold cursor-pointer"
          >
            Thử thanh toán lại
          </Button>
        </div>
      )}

      {paymentStatusParam === 'error' && (
        <div className="p-4 rounded-2xl bg-brand-peach/20 border border-brand-peach/50 flex items-center gap-3 text-stone-800">
          <WarningOutlined className="text-brand-coral shrink-0" style={{ fontSize: 24 }} />
          <div className="text-sm">
            <p className="font-bold">Có lỗi xảy ra khi xác thực giao dịch</p>
            <p className="text-xs text-stone-600">Vui lòng kiểm tra lại đơn hàng hoặc liên hệ CSKH để được trợ giúp.</p>
          </div>
        </div>
      )}

      <div>
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-coral mb-2">
          <ArrowLeftOutlined style={{ fontSize: 13 }} /> Quay lại danh sách đơn hàng
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Chi Tiết Đơn #{order.id}</h1>
            <p className="text-xs text-stone-500">Thời gian: {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Tag color={statusInfo.color} className="font-bold text-sm px-4 py-1 rounded-full m-0">
              {statusInfo.label}
            </Tag>
            {order.paymentStatus === 'paid' ? (
              <Tag color="green" className="font-semibold text-xs px-2.5 py-0.5 rounded-full m-0">
                Đã thanh toán
              </Tag>
            ) : (
              <Tag color="orange" className="font-semibold text-xs px-2.5 py-0.5 rounded-full m-0">
                Chờ thanh toán
              </Tag>
            )}
            {order.status === 'pending' && (
              <Button
                danger
                icon={<StopOutlined style={{ fontSize: 14 }} />}
                loading={isCancelling}
                onClick={handleCancelOrder}
                className="!rounded-lg text-xs font-semibold cursor-pointer"
              >
                Hủy đơn
              </Button>
            )}
          </div>
        </div>
      </div>

      <OrderTimeline status={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3">Danh Sách Sản Phẩm</h3>
            <div className="space-y-4 divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-stone-900 text-sm">{item.product.name}</h4>
                    <p className="text-stone-500">
                      Màu: {item.selectedColor ?? 'Chuẩn'} | KT: {item.product.dimensions || 'Tiêu chuẩn'}
                    </p>
                    <p className="text-stone-500">
                      SL: <strong>{item.quantity}</strong> x {formatVND(item.product.price)}
                    </p>
                  </div>
                  <span className="font-bold text-stone-900 text-sm">{formatVND(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trạng thái đã nhận tiền thành công */}
          {order.paymentStatus === 'paid' && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-4 text-emerald-900 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircleOutlined style={{ fontSize: 26 }} />
              </div>
              <div>
                <h4 className="font-bold text-base text-emerald-950">ĐÃ NHẬN TIỀN THANH TOÁN THÀNH CÔNG!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Hệ thống LuxDecor đã xác nhận nhận đủ số tiền {formatVND(order.totalAmount)}. Đơn hàng đang được bộ phận kho chuẩn bị và bàn giao vận chuyển.
                </p>
              </div>
            </div>
          )}

          {/* Nếu chọn VietQR và chưa thanh toán */}
          {order.customerInfo.paymentMethod === 'bank_transfer' && order.paymentStatus !== 'paid' && (
            <BankTransferBox orderId={order.id} totalAmount={order.totalAmount} />
          )}

          {/* Nếu chọn VNPay nhưng chưa thanh toán hoặc thất bại */}
          {order.customerInfo.paymentMethod === 'vnpay' && order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
            <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sky-950 text-base">Thanh toán trực tuyến qua VNPay</h4>
                <p className="text-xs text-sky-800">Đơn hàng chưa hoàn tất thanh toán. Nhấp vào nút để tiếp tục giao dịch.</p>
              </div>
              <Button
                type="primary"
                loading={isPayingVNPay}
                onClick={handleRetryVNPay}
                className="!bg-sky-600 hover:!bg-sky-500 !rounded-xl font-bold !h-10 px-6 text-sm"
              >
                Tiếp tục thanh toán VNPay
              </Button>
            </div>
          )}
        </div>
        <OrderSummaryPanel order={order} />
      </div>
    </div>
  );
};
