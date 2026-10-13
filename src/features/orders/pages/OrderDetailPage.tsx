import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { OrderTimeline } from '~/features/orders/components/OrderTimeline';
import { BankTransferBox } from '~/features/orders/components/BankTransferBox';
import { OrderSummaryPanel } from '~/features/orders/components/OrderSummaryPanel';
import { useOrderDetail, useCancelOrder } from '~/features/orders/hooks';
import { ArrowLeftOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Tag, Spin, Button, Modal, message } from 'antd';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const paymentStatusParam = searchParams.get('payment');

  const { data: order, isLoading } = useOrderDetail(orderId);
  const { mutateAsync: cancelOrderMutation, isPending: isCancelling } = useCancelOrder();

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

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

        </div>
        <OrderSummaryPanel order={order} />
      </div>
    </div>
  );
};
