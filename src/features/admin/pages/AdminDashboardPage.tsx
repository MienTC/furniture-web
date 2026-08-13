import React from 'react';
import { productService } from '~/services/productService';
import { orderService } from '~/services/orderService';
import { formatVND, formatDate } from '~/common/utils/formatters';
import { ORDER_STATUS_LABEL } from '~/common/constants';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Eye 
} from 'lucide-react';
import { Tag, Card, Button } from 'antd';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const products = productService.getProducts();
  const orders = orderService.getOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const lowStockCount = products.filter(p => p.stockQuantity < 5).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Tổng Doanh Thu</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <DollarSign size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900 font-serif-heading">
            {formatVND(totalRevenue)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp size={14} /> +18.5% so với tháng trước
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Tổng Đơn Hàng</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900 font-serif-heading">
            {totalOrdersCount} đơn
          </h3>
          <p className="text-[11px] text-stone-500 font-medium">100% xử lý qua Mock API</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Sản Phẩm Trong Kho</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <Package size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900 font-serif-heading">
            {products.length} mẫu
          </h3>
          <p className="text-[11px] text-stone-500 font-medium">{inStockCount} sản phẩm sẵn sàng giao</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Sắp Hết Hàng (&lt;5)</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold">
              <Package size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900 font-serif-heading">
            {lowStockCount} mẫu
          </h3>
          <p className="text-[11px] text-rose-600 font-semibold">Cần nhập thêm tồn kho</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif-heading font-bold text-stone-900">Đơn Hàng Gần Đây</h3>
            <p className="text-xs text-stone-500">Danh sách các đơn hàng mới nhất cần xử lý</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-amber-900 hover:underline">
            Quản lý tất cả đơn hàng &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="p-3 font-bold">Mã Đơn</th>
                <th className="p-3 font-bold">Khách Hàng</th>
                <th className="p-3 font-bold">Ngày Đặt</th>
                <th className="p-3 font-bold">Thanh Toán</th>
                <th className="p-3 font-bold">Trạng Thái</th>
                <th className="p-3 font-bold text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((o) => {
                const statusInfo = ORDER_STATUS_LABEL[o.status] || { label: o.status, color: 'default' };
                return (
                  <tr key={o.id} className="hover:bg-stone-50/80">
                    <td className="p-3 font-mono font-bold text-amber-950">{o.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-stone-900">{o.customerInfo.fullName}</p>
                      <p className="text-stone-400 text-[10px]">{o.customerInfo.phone}</p>
                    </td>
                    <td className="p-3 text-stone-500">{formatDate(o.createdAt)}</td>
                    <td className="p-3 uppercase text-[10px] font-bold text-stone-600">{o.customerInfo.paymentMethod}</td>
                    <td className="p-3">
                      <Tag color={statusInfo.color} className="font-bold text-[10px]">
                        {statusInfo.label}
                      </Tag>
                    </td>
                    <td className="p-3 text-right font-bold text-amber-950">{formatVND(o.totalAmount)}</td>
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
