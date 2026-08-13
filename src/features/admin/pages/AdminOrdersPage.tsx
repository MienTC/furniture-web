import React, { useState } from 'react';
import { orderService } from '~/services/orderService';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { Order, OrderStatus } from '~/types';
import { Search, Eye } from 'lucide-react';
import { Tag, Input, Select, message } from 'antd';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.phone.includes(searchTerm)
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orderService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(orderService.getOrders());
      message.success(`Cập nhật trạng thái đơn ${orderId} thành công!`);
    }
  };

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao hàng' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-stone-900">Quản Lý Đơn Hàng Nội Thất</h2>
          <p className="text-xs text-stone-500">Duyệt đơn, cập nhật trạng thái giao hàng & lắp đặt</p>
        </div>

        <Input
          placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<Search size={14} className="text-stone-400" />}
          className="!rounded-lg text-xs max-w-sm w-full"
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="p-3.5 font-bold">Mã Đơn</th>
                <th className="p-3.5 font-bold">Khách Hàng</th>
                <th className="p-3.5 font-bold">Sản Phẩm</th>
                <th className="p-3.5 font-bold">Thanh Toán</th>
                <th className="p-3.5 font-bold">Ngày Đặt</th>
                <th className="p-3.5 font-bold">Trạng Thái</th>
                <th className="p-3.5 font-bold text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => {
                const statusInfo = ORDER_STATUS_LABEL[order.status] || { label: order.status, color: 'default' };
                return (
                  <tr key={order.id} className="hover:bg-stone-50/80">
                    <td className="p-3.5 font-mono font-bold text-amber-950">{order.id}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-stone-900">{order.customerInfo.fullName}</p>
                      <p className="text-stone-400 text-[10px]">{order.customerInfo.phone}</p>
                      <p className="text-stone-400 text-[10px] truncate max-w-[140px]">
                        {order.customerInfo.district}, {order.customerInfo.city}
                      </p>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.product.id} className="flex items-center gap-1.5">
                            <img src={item.product.images[0]} alt="" className="w-7 h-7 rounded object-cover border border-stone-200" />
                            <span className="text-stone-700 truncate max-w-[120px]">{item.product.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-stone-400 text-[10px]">+{order.items.length - 2} sản phẩm khác</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="uppercase text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                        {order.customerInfo.paymentMethod === 'bank_transfer' ? 'QR Bank' : order.customerInfo.paymentMethod === 'cod' ? 'COD' : 'Thẻ'}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-500">{formatDate(order.createdAt)}</td>
                    <td className="p-3.5">
                      <Select
                        value={order.status}
                        size="small"
                        onChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                        options={STATUS_OPTIONS}
                        className="w-36"
                      />
                    </td>
                    <td className="p-3.5 text-right font-bold text-amber-950">
                      {formatVND(order.totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
