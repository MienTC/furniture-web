import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Tooltip, Popover, Button, Modal, Drawer } from "antd";
import { toast } from "react-toastify";
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
  IconExternalLink,
  IconMenu2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react";
import { useAuth } from "~/contexts/AuthContext";
import { cn } from "~/lib";
import UAvatar from "~/components/ui/uavatar";

export const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { adminUser, logoutAdmin } = useAuth();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

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

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất quản trị',
      icon: <IconShieldLock className="text-amber-600 size-6 mr-2" />,
      content: (
        <div className="text-xs text-stone-600 pt-1 space-y-1 font-sans">
          <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Quản trị LuxDecor?</p>
          <p className="text-stone-400">Phiên làm việc hiện tại của bạn sẽ kết thúc an toàn.</p>
        </div>
      ),
      okText: 'Đăng xuất',
      cancelText: 'Ở lại',
      okButtonProps: {
        danger: true,
        className: '!bg-rose-600 hover:!bg-rose-700 !font-semibold !rounded-lg',
      },
      cancelButtonProps: {
        className: '!rounded-lg',
      },
      centered: true,
      onOk: () => {
        logoutAdmin();
        toast.info('Đã đăng xuất khỏi trang Quản trị');
        navigate('/admin/login', { replace: true });
      },
    });
  };

  const profileContent = (
    <div className="w-64 p-2.5 space-y-3 font-sans">
      <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
        <UAvatar size={40} nickname={adminUser?.name} src={adminUser?.avatar} />
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-bold text-stone-900 truncate m-0">
            {adminUser?.name || 'Quản trị viên'}
          </p>
          <p className="text-[11px] text-stone-500 truncate m-0">{adminUser?.email}</p>
          <span className="inline-block mt-1 text-[10px] font-bold text-[#2B5A50] bg-[#EDF5F2] px-2 py-0.5 rounded-full border border-[#D0DBD6]">
            Quản trị viên cấp cao
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <Button
          type="text"
          className="w-full !flex !items-center !justify-start gap-2.5 text-xs text-stone-700 hover:text-stone-900 !h-9 !rounded-lg hover:!bg-stone-50"
          icon={<IconExternalLink size={16} className="text-stone-400" />}
          onClick={() => navigate("/")}
        >
          Trang khách hàng (Storefront)
        </Button>
        <Button
          type="text"
          danger
          className="w-full !flex !items-center !justify-start gap-2.5 text-xs !h-9 !rounded-lg hover:!bg-rose-50"
          icon={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Đăng xuất quản trị
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAFAFA] font-sans">
      {/* Top Header - Fixed 56px */}
      <header className="h-14 flex-none bg-white border-b border-[#E5EAE7] px-3 sm:px-5 flex items-center justify-between shadow-2xs z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger Button */}
          <Button
            type="text"
            icon={<IconMenu2 size={22} />}
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden !p-1.5 !h-9 !w-9 !flex !items-center !justify-center text-stone-700"
            aria-label="Mở menu quản trị"
          />

          <Link to="/admin" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/logo1.png" alt="LuxDecor" className="size-7 sm:size-8 object-contain rounded-md" />
            <span className="font-bold text-[#1A2421] text-sm sm:text-base tracking-tight">LuxDecor Admin</span>
          </Link>
          <span className="text-gray-300 hidden sm:inline">/</span>
          <span className="hidden sm:inline-flex bg-[#EDF5F2] text-[#2B5A50] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#D0DBD6]">
            Hệ thống Quản trị v2.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Popover content={profileContent} trigger="click" placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer p-1 sm:p-1.5 rounded-lg hover:bg-[#EDF5F2] transition-colors border border-transparent hover:border-[#D0DBD6]">
              <UAvatar size={30} nickname={adminUser?.name} src={adminUser?.avatar} />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#1A2421] leading-tight m-0">{adminUser?.name || 'Admin'}</p>
                <p className="text-[10px] text-[#2B5A50] font-bold capitalize m-0">Quản trị viên</p>
              </div>
            </div>
          </Popover>
        </div>
      </header>

      {/* Main Body - Viewport Locked, Zero window scroll */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Collapsible Sidebar (64px <-> 240px) */}
        <aside
          className={cn(
            "hidden md:flex flex-none border-r border-[#E5EAE7] bg-white flex-col justify-between py-4 px-2.5 z-20 transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-60"
          )}
        >
          <div className="flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden pr-0.5">
            {menu.map((item, index) => {
              const isActive = item.exact
                ? pathname === item.path
                : pathname.startsWith(item.path);

              const content = (
                <div
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center rounded-xl text-neutral-500 cursor-pointer transition-all border border-transparent hover:border-[#D0DBD6] hover:bg-[#EDF5F2] hover:text-[#2B5A50]",
                    collapsed ? "justify-center size-[44px]" : "gap-3 px-3 py-2.5 text-xs font-medium w-full",
                    {
                      "bg-[#2B5A50] text-white border-[#2B5A50] font-bold shadow-xs hover:bg-[#20453D] hover:text-white": isActive,
                    }
                  )}
                >
                  <item.icon size={20} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>
              );

              return collapsed ? (
                <Tooltip key={index} title={item.name} placement="right">
                  {content}
                </Tooltip>
              ) : (
                <React.Fragment key={index}>{content}</React.Fragment>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-[#E5EAE7]">
            {/* Collapse / Expand Toggle Button */}
            <Tooltip title={collapsed ? "Mở rộng thanh menu" : undefined} placement="right">
              <div
                onClick={toggleCollapsed}
                className={cn(
                  "flex items-center rounded-lg text-neutral-400 hover:text-[#1A2421] hover:bg-stone-100 cursor-pointer transition-colors",
                  collapsed ? "justify-center size-[40px] mx-auto" : "gap-2.5 px-3 py-2 text-xs font-semibold"
                )}
              >
                {collapsed ? (
                  <IconLayoutSidebarRightCollapse size={18} />
                ) : (
                  <>
                    <IconLayoutSidebarLeftCollapse size={18} />
                    <span>Thu gọn thanh menu</span>
                  </>
                )}
              </div>
            </Tooltip>

            {/* Storefront Link */}
            <Tooltip title={collapsed ? "Về trang cửa hàng" : undefined} placement="right">
              <div
                onClick={() => navigate("/")}
                className={cn(
                  "flex items-center rounded-lg text-neutral-400 hover:text-[#2B5A50] hover:bg-[#EDF5F2] cursor-pointer transition-colors",
                  collapsed ? "justify-center size-[40px] mx-auto" : "gap-2.5 px-3 py-2 text-xs font-semibold"
                )}
              >
                <IconArrowLeft size={18} />
                {!collapsed && <span>Về trang cửa hàng</span>}
              </div>
            </Tooltip>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-2.5">
              <img src="/logo1.png" alt="LuxDecor" className="size-7 object-contain rounded-md" />
              <div>
                <p className="font-bold text-[#1A2421] text-sm leading-none m-0">LuxDecor Admin</p>
                <p className="text-[10px] text-[#2B5A50] font-semibold m-0 mt-0.5">Bảng Điều Khiển Quản Trị</p>
              </div>
            </div>
          }
          placement="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          width={280}
        >
          <div className="flex flex-col justify-between h-full font-sans">
            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
              {menu.map((item, index) => {
                const isActive = item.exact
                  ? pathname === item.path
                  : pathname.startsWith(item.path);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 font-medium text-xs cursor-pointer transition-colors hover:bg-[#EDF5F2] hover:text-[#2B5A50] min-h-[44px]",
                      isActive && "bg-[#2B5A50] text-white font-bold hover:bg-[#20453D] hover:text-white"
                    )}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span>{item.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              <Button
                type="text"
                icon={<IconExternalLink size={16} />}
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="w-full !flex !items-center !justify-start gap-2 text-xs !h-10"
              >
                Trang khách hàng
              </Button>
              <Button
                type="text"
                danger
                icon={<IconLogout size={16} />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full !flex !items-center !justify-start gap-2 text-xs !h-10"
              >
                Đăng xuất quản trị
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Content Pane - Inner Smooth Scrolling Only */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-3 sm:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
