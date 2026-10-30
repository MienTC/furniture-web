import React from 'react';
import { Row, Col, Tag, Input, Select, InputNumber, Form } from 'antd';
import FieldCell from '~/components/shared/FieldCell';
import { StatusBadge } from '~/components/shared/StatusBadge';
import type { AdminOrderDetail } from '~/types';

interface OrderDetailInfoCardProps {
  order: AdminOrderDetail;
  isEditing?: boolean;
}

const ORDER_STATUS_OPTIONS = [
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Đang giao hàng', value: 'shipping' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy đơn', value: 'cancelled' },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: 'Chưa thanh toán', value: 'unpaid' },
  { label: 'Đã thanh toán', value: 'paid' },
  { label: 'Đã hoàn tiền', value: 'refunded' },
];

const PAYMENT_METHOD_OPTIONS = [
  { label: 'Chuyển khoản VietQR', value: 'bank_transfer' },
  { label: 'COD (Tiền mặt khi nhận)', value: 'cod' },
  { label: 'Thẻ tín dụng / Online', value: 'credit_card' },
];

export const OrderDetailInfoCard: React.FC<OrderDetailInfoCardProps> = ({
  order,
  isEditing = false,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50/60 rounded-lg border border-slate-200/80 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider m-0">
          Thông Tin Khách Hàng & Giao Nhận
        </h4>
        {isEditing && (
          <Tag color="orange" className="!font-semibold m-0">
            CHẾ ĐỘ CHỈNH SỬA TOÀN BỘ ĐƠN HÀNG
          </Tag>
        )}
      </div>

      {!isEditing ? (
        <Row gutter={[20, 16]}>
          <Col span={6}>
            <FieldCell label="Mã Đơn Hàng" value={order.id} />
          </Col>
          <Col span={6}>
            <FieldCell label="Ngày Đặt Hàng" value={order.createdAt} type="datetime" />
          </Col>
          <Col span={6}>
            <FieldCell
              label="Trạng Thái Đơn"
              type="custom"
              value={
                order.status === 'cancelled' ? (
                  <Tag color="red" className="!font-semibold !m-0">
                    ĐÃ HỦY ĐƠN
                  </Tag>
                ) : (
                  <Tag color="blue" className="!font-semibold !m-0 uppercase">
                    {order.status}
                  </Tag>
                )
              }
            />
          </Col>
          <Col span={6}>
            <FieldCell
              label="Trạng Thái Thanh Toán"
              type="custom"
              value={<StatusBadge status={order.paymentStatus} />}
            />
          </Col>

          <Col span={6}>
            <FieldCell label="Họ Tên Khách Hàng" value={order.recipient_name} />
          </Col>
          <Col span={6}>
            <FieldCell label="Số Điện Thoại" value={order.phone} />
          </Col>
          <Col span={6}>
            <FieldCell label="Email Khách Hàng" value={order.email} />
          </Col>
          <Col span={6}>
            <FieldCell
              label="Hình Thức Thanh Toán"
              value={
                order.paymentMethod === 'bank_transfer'
                  ? 'Chuyển khoản VietQR'
                  : order.paymentMethod?.toUpperCase()
              }
            />
          </Col>

          <Col span={12}>
            <FieldCell
              label="Địa Chỉ Nhận Hàng"
              value={[order.address_line, order.district, order.city].filter(Boolean).join(', ')}
            />
          </Col>
          <Col span={6}>
            <FieldCell
              label="Mã Giảm Giá (Voucher)"
              value={order.voucherCode}
              type="tag"
              tagColor="green"
            />
          </Col>
          <Col span={6}>
            <FieldCell label="Mã Giao Dịch SePay" value={order.paymentTransactionId} />
          </Col>

          {order.note && (
            <Col span={24}>
              <FieldCell label="Ghi Chú Khách Hàng" value={order.note} />
            </Col>
          )}
        </Row>
      ) : (
        <Row gutter={[16, 10]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Trạng thái đơn hàng" name="status" className="mb-2">
              <Select options={ORDER_STATUS_OPTIONS} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Trạng thái thanh toán" name="paymentStatus" className="mb-2">
              <Select options={PAYMENT_STATUS_OPTIONS} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Hình thức thanh toán" name="paymentMethod" className="mb-2">
              <Select options={PAYMENT_METHOD_OPTIONS} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Mã giao dịch thanh toán" name="paymentTransactionId" className="mb-2">
              <Input placeholder="Mã GD ngân hàng..." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="Họ tên người nhận"
              name="recipient_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              className="mb-2"
            >
              <Input placeholder="Nhập họ tên khách hàng..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              className="mb-2"
            >
              <Input placeholder="Số điện thoại nhận hàng..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Email khách hàng" name="email" className="mb-2">
              <Input placeholder="Email..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Mã giảm giá (Voucher)" name="voucherCode" className="mb-2">
              <Input placeholder="Mã voucher nếu có..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Địa chỉ chi tiết (Số nhà, tên đường, phường/xã)"
              name="address_line"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              className="mb-2"
            >
              <Input placeholder="Số nhà, đường, phường/xã..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Quận / Huyện" name="district" className="mb-2">
              <Input placeholder="Quận/Huyện..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Tỉnh / Thành phố" name="city" className="mb-2">
              <Input placeholder="Tỉnh/Thành phố..." />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Ghi chú đơn hàng & Yêu cầu lắp đặt" name="note" className="mb-0">
              <Input.TextArea rows={2} placeholder="Yêu cầu lắp đặt, thời gian giao hàng..." />
            </Form.Item>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default OrderDetailInfoCard;
