import React from 'react';
import { Truck } from 'lucide-react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';

export const DeliveryForm: React.FC<{ form: FormInstance }> = ({ form: _ }) => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
    <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
      <Truck size={20} className="text-amber-800" /> 1. Thông Tin Nhận Hàng & Lắp Đặt
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Form.Item name="fullName" label={<span className="text-xs font-bold text-stone-700">Họ và tên</span>} rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
        <Input placeholder="Nguyễn Văn A" className="!rounded-lg text-xs" />
      </Form.Item>
      <Form.Item name="phone" label={<span className="text-xs font-bold text-stone-700">Số điện thoại</span>} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
        <Input placeholder="0988 888 888" className="!rounded-lg text-xs" />
      </Form.Item>
    </div>
    <Form.Item name="email" label={<span className="text-xs font-bold text-stone-700">Email</span>} rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
      <Input placeholder="customer@example.com" className="!rounded-lg text-xs" />
    </Form.Item>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Form.Item name="city" label={<span className="text-xs font-bold text-stone-700">Tỉnh / Thành phố</span>} rules={[{ required: true }]}>
        <Input placeholder="TP. Hồ Chí Minh" className="!rounded-lg text-xs" />
      </Form.Item>
      <Form.Item name="district" label={<span className="text-xs font-bold text-stone-700">Quận / Huyện</span>} rules={[{ required: true }]}>
        <Input placeholder="Bình Thạnh" className="!rounded-lg text-xs" />
      </Form.Item>
    </div>
    <Form.Item name="address" label={<span className="text-xs font-bold text-stone-700">Địa chỉ cụ thể</span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
      <Input placeholder="Số nhà, tên đường..." className="!rounded-lg text-xs" />
    </Form.Item>
    <Form.Item name="note" label={<span className="text-xs font-bold text-stone-700">Ghi chú (Tùy chọn)</span>}>
      <Input.TextArea rows={3} placeholder="Giao sau 17h, nhà có thang máy..." className="!rounded-lg text-xs" />
    </Form.Item>
  </div>
);
