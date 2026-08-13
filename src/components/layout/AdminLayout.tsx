import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Sparkles, 
  ArrowLeft 
} from 'lucide-react';
import { Tag } from 'antd';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const menuItems = [
    { key: '/admin', label: 'Tổng Quan Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: '/admin/products', label: 'Quản Lý Sản Phẩm', icon: <Package size={18} /> },
    { key: '/admin/orders', label: 'Quản Lý Đơn Hàng', icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-stone-100">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-950 text-stone-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-amber-900 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center text-amber-200">
              <Sparkles size={18} />
            </div>
            <span className="font-serif-heading font-bold text-white text-lg">LuxAdmin</span>
          </Link>
          <Tag color="gold" className="text-[10px] font-bold">PRO</Tag>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.key;
            return (
              <Link
                key={item.key}
                to={item.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-800 text-white font-bold shadow-md'
                    : 'text-stone-300 hover:bg-amber-900/60 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-amber-900 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user?.avatar}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full object-cover border border-amber-500"
            />
            <div className="text-xs overflow-hidden">
              <p className="font-bold text-white truncate">{user?.name}</p>
              <p className="text-stone-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              login('customer');
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-amber-200 hover:text-white bg-amber-900/50 hover:bg-amber-900 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} /> Quay về Trang Khách Hàng
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white px-8 py-4 border-b border-stone-200 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif-heading">Quản Trị Hệ Thống LuxDecor</h2>
            <p className="text-xs text-stone-500">Mô hình cấu trúc dự án mô phỏng tev-fe-admin</p>
          </div>
          <div className="flex items-center gap-3">
            <Tag color="green">Đang kết nối Mock API</Tag>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
