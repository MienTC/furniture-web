import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "~/contexts/CartContext";
import { useWishlist } from "~/contexts/WishlistContext";
import { useAuth } from "~/contexts/AuthContext";
import { MOCK_CATEGORIES } from "~/mock/data";
import { APP_NAME } from "~/common/constants";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  PhoneCall,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Badge, Dropdown, MenuProps, Drawer, Input } from "antd";
import { CategoryNav } from "./CategoryNav";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { itemCount, subtotal } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div className="py-1 px-1">
          <p className="font-bold text-stone-800">{user?.name}</p>
          <p className="text-xs text-stone-500">{user?.email}</p>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "orders",
      label: <Link to="/orders">Đơn hàng của tôi</Link>,
    },
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
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-amber-950 text-amber-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-amber-400" /> Miễn phí vận chuyển
              đơn từ 15 triệu
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-amber-400" /> Bảo hành 5
              năm
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:19008888"
              className="hover:text-amber-300 flex items-center gap-1"
            >
              <PhoneCall size={12} /> Hotline: 0393.241003
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-15 h-15 rounded-xl flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
            <img src="/logo1.png" alt="" />          
          </div>
          <div>
            <span className="text-xl font-bold font-serif-heading text-stone-900 tracking-tight block leading-none">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-amber-800 tracking-widest uppercase font-semibold">
              Interior Luxury
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md relative"
        >
          <Input
            placeholder="Nhập từ khóa, mở lối không gian!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search size={16} className="text-stone-400 mr-1" />}
            className="w-full !rounded-full !bg-stone-100/80 hover:!bg-white focus:!bg-white !py-2 !border-stone-200"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-stone-700 hover:text-amber-900 transition-colors"
          >
            <Badge
              count={wishlistIds.length}
              overflowCount={99}
              size="small"
              color="#92400e"
            >
              <Heart size={22} />
            </Badge>
          </Link>

          {/* Cart Drawer Link */}
          <Link
            to="/cart"
            className="flex items-center gap-2 p-2 rounded-xl bg-stone-100 hover:bg-amber-100/60 transition-colors text-stone-800"
          >
            <Badge
              count={itemCount}
              overflowCount={99}
              size="small"
              color="#78350f"
            >
              <ShoppingBag size={22} className="text-amber-950" />
            </Badge>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] text-stone-500 font-medium leading-none">
                Giỏ hàng
              </span>
              <span className="text-xs font-bold text-amber-950 leading-tight">
                {subtotal.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </Link>

          {/* User Profile Dropdown */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 transition-colors">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                }
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-amber-800/20"
              />
              <span className="hidden md:inline text-xs font-semibold text-stone-800">
                {user?.name.split(" ")[0]}
              </span>
            </button>
          </Dropdown>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sub-nav Categories Menu */}
      <CategoryNav />

      {/* Mobile Drawer Navigation */}
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
              placeholder="Nhập từ khóa, mở lối không gian!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search size={16} />}
            />
          </form>

          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-3 rounded-lg font-bold text-amber-900 bg-amber-50"
          >
            Tất cả Sản Phẩm
          </Link>
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-800"
            >
              {cat.name}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col gap-2">
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
    </header>
  );
};
