import React from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Tooltip, Popover, Button } from "antd";
import {
  IconDashboard,
  IconPackage,
  IconShoppingBag,
  IconUsers,
  IconCategory,
  IconPhoto,
  IconTicket,
  IconStar,
  IconArrowLeft,
  IconLogout,
  IconShieldLock,
  IconCreditCard,
  IconPhoneCall,
  IconFlame,
} from "@tabler/icons-react";
import { useAuth } from "~/contexts/AuthContext";
import { cn } from "~/lib";
import UAvatar from "~/components/ui/uavatar";
import UBadge from "~/components/ui/ubadge";

export const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menu = [
    {
      name: "Tổng quan Dashboard",
      icon: IconDashboard,
      path: "/admin",
      exact: true,
    },
    {
      name: "Quản lý Sản phẩm",
      icon: IconPackage,
      path: "/admin/products",
    },
    {
      name: "Quản lý Danh mục",
      icon: IconCategory,
      path: "/admin/categories",
    },
    {
      name: "Flash Sale Hôm Nay",
      icon: IconFlame,
      path: "/admin/flash-sale",
    },
    {
      name: "Quản lý Đơn hàng",
      icon: IconShoppingBag,
      path: "/admin/orders",
    },
    {
      name: "Quản lý Người dùng",
      icon: IconUsers,
      path: "/admin/users",
    },
    {
      name: "Quản lý Banners",
      icon: IconPhoto,
      path: "/admin/banners",
    },
    {
      name: "Mã Giảm Giá (Voucher)",
      icon: IconTicket,
      path: "/admin/vouchers",
    },
    {
      name: "Đánh Giá Khách Hàng",
      icon: IconStar,
      path: "/admin/reviews",
    },
    {
      name: "Cấu hình Thanh toán",
      icon: IconCreditCard,
      path: "/admin/payment-settings",
    },
    {
      name: "Cấu hình Hotline & Zalo",
      icon: IconPhoneCall,
      path: "/admin/contact-settings",
    },
  ];

  const profileContent = (
    <div className="w-56 p-2 space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <UAvatar size={36} nickname={user?.name} src={user?.avatar} />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-1">
        <Button
          type="text"
          className="w-full !flex !items-center !justify-start gap-2 text-xs text-gray-600 hover:text-gray-900"
          icon={<IconArrowLeft size={16} />}
          onClick={() => navigate("/")}
        >
          Trang khách hàng
        </Button>
        <Button
          type="text"
          danger
          className="w-full !flex !items-center !justify-start gap-2 text-xs"
          icon={<IconLogout size={16} />}
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
        >
          Đăng xuất quản trị
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAFAFA] font-sans">
      {/* Top Header - Fixed 56px */}
      <header className="h-14 flex-none bg-white border-b border-[#E5EAE7] px-5 flex items-center justify-between shadow-2xs z-30">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/logo1.png" alt="LuxDecor" className="size-8 object-contain rounded-md" />
            <span className="font-bold text-[#1A2421] text-base tracking-tight">LuxDecor Admin</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="bg-[#EDF5F2] text-[#2B5A50] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#D0DBD6]">
            Hệ thống Quản trị v2.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Popover content={profileContent} trigger="click" placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-md hover:bg-[#EDF5F2] transition-colors">
              <UAvatar size={32} nickname={user?.name} src={user?.avatar} />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#1A2421] leading-tight">{user?.name}</p>
                <p className="text-[10px] text-[#2B5A50] font-bold capitalize">{user?.role}</p>
              </div>
            </div>
          </Popover>
        </div>
      </header>

      {/* Main Body - Viewport Locked, Zero window scroll */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar Fixed 64px */}
        <aside className="w-16 flex-none border-r border-[#E5EAE7] bg-white flex flex-col justify-between py-4 px-2.5 z-20">
          <div className="flex flex-col gap-2.5">
            {menu.map((item, index) => {
              const isActive = item.exact
                ? pathname === item.path
                : pathname.startsWith(item.path);

              return (
                <Tooltip key={index} title={item.name} placement="right">
                  <div
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center justify-center size-[44px] rounded-xl text-neutral-400 cursor-pointer transition-all border border-transparent hover:border-[#D0DBD6] hover:bg-[#EDF5F2] hover:text-[#2B5A50]",
                      {
                        "bg-[#2B5A50] text-white border-[#2B5A50] shadow-xs hover:bg-[#20453D] hover:text-white": isActive,
                      }
                    )}
                  >
                    <item.icon size={22} />
                  </div>
                </Tooltip>
              );
            })}
          </div>

          <div className="flex flex-col items-center">
            <Tooltip title="Về trang cửa hàng" placement="right">
              <div
                onClick={() => navigate("/")}
                className="flex items-center justify-center size-[40px] text-neutral-400 rounded-lg hover:bg-stone-100 hover:text-[#2D2623] cursor-pointer transition-colors"
              >
                <IconArrowLeft size={20} />
              </div>
            </Tooltip>
          </div>
        </aside>

        {/* Content Pane - Inner Smooth Scrolling Only */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
