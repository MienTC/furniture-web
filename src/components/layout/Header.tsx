import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "~/contexts/CartContext";
import { useWishlist } from "~/contexts/WishlistContext";
import { useAuth } from "~/contexts/AuthContext";
import { useCategories } from "~/features/products/hooks/useCategory";
import { usePublicContactSettings } from "~/features/admin/hooks";
import { APP_NAME } from "~/common/constants";
import { CarOutlined, SafetyCertificateOutlined, SearchOutlined, MenuOutlined, PhoneOutlined, HeartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Badge, Dropdown, MenuProps, Drawer, Input, Button } from "antd";
import { CategoryNav } from "./CategoryNav";
import { AuthModal } from "~/components/ui/AuthModal";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { itemCount, subtotal } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const { categories } = useCategories();
  const { data: contactSettings } = usePublicContactSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');

  const openAuth = (tab: 'login' | 'register') => {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const userMenuItems: MenuProps["items"] = user ? [
    {
      key: "user-info",
      label: (
        <div className="py-1 px-1">
          <p className="font-bold text-stone-800">{user.name}</p>
          <p className="text-xs text-stone-500">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-peach/30 text-brand-coral uppercase">
            {user.role}
          </span>
        </div>
      ),
    },
    { type: "divider" },
    ...(isAdmin ? [{ key: "admin", label: <Link to="/admin">Trang Quản Trị Hệ Thống</Link> }, { type: "divider" as const }] : []),
    { key: "orders", label: <Link to="/orders">Đơn hàng của tôi</Link> },
    {
      key: "wishlist",
      label: (
        <Link to="/wishlist">Sản phẩm yêu thích ({wishlistIds.length})</Link>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: <span onClick={logout}>Đăng xuất</span>,
    },
  ] : [
    {
      key: "login",
      label: <span onClick={() => openAuth('login')} className="font-bold text-brand-coral">Đăng nhập tài khoản</span>,
    },
    {
      key: "register",
      label: <span onClick={() => openAuth('register')}>Đăng ký tài khoản mới</span>,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-stone-900 text-brand-cream text-xs py-2 px-4 border-b border-brand-coral/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <CarOutlined className="text-brand-peach" style={{ fontSize: 14 }} /> Miễn phí giao hàng & lắp đặt toàn quốc
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <SafetyCertificateOutlined className="text-brand-mint" style={{ fontSize: 14 }} /> Bảo hành 5
              năm
            </span>
          </div>
          {contactSettings?.hotline && (
            <a
              href={`tel:${contactSettings.hotline}`}
              className="hover:text-brand-peach flex items-center gap-1 font-semibold"
            >
              <PhoneOutlined style={{ fontSize: 12 }} /> Hotline: {contactSettings.hotline}
            </a>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-15 h-15 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/logo1.png" alt="" />
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 tracking-tight block leading-none">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-brand-coral tracking-widest uppercase font-bold">
              Interior Luxury
            </span>
          </div>
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <Input
            placeholder="Nhập từ khóa, mở lối không gian!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<SearchOutlined className="text-stone-400 mr-1" style={{ fontSize: 16 }} />}
            className="w-full !rounded-full !bg-stone-100/80 hover:!bg-white focus:!bg-white !py-2 !border-stone-200"
          />
        </form>

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            to="/wishlist"
            className="relative p-2 text-stone-700 hover:text-brand-coral transition-colors"
          >
            <Badge
              count={wishlistIds.length}
              overflowCount={99}
              size="small"
              color="#DE7272"
            >
              <HeartOutlined style={{ fontSize: 22 }} />
            </Badge>
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-brand-peach/30 transition-colors text-stone-800 min-w-[120px] border border-stone-200"
          >
            <Badge
              count={itemCount}
              overflowCount={99}
              size="small"
              color="#DE7272"
            >
              <ShoppingOutlined className="text-stone-800" style={{ fontSize: 22 }} />
            </Badge>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-stone-500 font-medium leading-none">
                Giỏ hàng
              </span>
              <span className="text-xs font-bold text-brand-coral leading-tight">
                {subtotal.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </Link>

          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 transition-colors">
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  }
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-brand-coral/40"
                />
                <span className="hidden md:inline text-xs font-semibold text-stone-800">
                  {user.name?.split(" ")[0]}
                </span>
              </button>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="px-3.5 py-1.5 text-xs font-bold text-stone-800 hover:text-brand-coral rounded-lg hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-coral hover:bg-[#c95f5f] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-stone-700 cursor-pointer"
          >
            <MenuOutlined style={{ fontSize: 22 }} />
          </button>
        </div>
      </div>

      <CategoryNav />

      {/* Mobile Drawer */}
      <Drawer
        title="Danh Mục Nội Thất"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
      >
        <div className="flex flex-col gap-3">
          <form onSubmit={handleSearch} className="mb-2">
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined style={{ fontSize: 16 }} />}
            />
          </form>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-3 rounded-lg font-bold text-brand-coral bg-brand-peach/20"
          >
            Tất cả Sản Phẩm
          </Link>
          {categories
            .filter((c) => !c.parentId)
            .map((cat) => {
              const subs = categories.filter((c) => c.parentId === cat.id);
              return (
                <div key={cat.id} className="space-y-1">
                  <Link
                    to={`/products?category=${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-900 font-bold block text-sm"
                  >
                    {cat.name}
                  </Link>
                  {subs.length > 0 && (
                    <div className="pl-4 space-y-1 border-l-2 border-stone-200 ml-2">
                      {subs.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/products?category=${sub.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 px-2 rounded text-xs text-stone-600 hover:text-brand-coral hover:bg-brand-peach/20"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col gap-2">
            {!user ? (
              <div className="flex flex-col gap-2 pb-3 border-b border-stone-200">
                <Button
                  block
                  type="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('login');
                  }}
                  className="!bg-brand-coral hover:!bg-[#c95f5f] font-bold"
                >
                  Đăng Nhập
                </Button>
                <Button
                  block
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('register');
                  }}
                >
                  Đăng Ký Tài Khoản
                </Button>
              </div>
            ) : null}
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-stone-700"
            >
              Quản lý Đơn hàng
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-stone-700"
            >
              Sản phẩm Yêu thích ({wishlistIds.length})
            </Link>
          </div>
        </div>
      </Drawer>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />
    </header>
  );
};
