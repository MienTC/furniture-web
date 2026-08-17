import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { MOCK_CATEGORIES } from "~/mock/data";

export const CategoryNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="hidden md:block bg-stone-100/80 border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-stone-700">
        <div className="flex items-center gap-1">
          <Link
            to="/products"
            className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${
              location.pathname === "/products"
                ? "bg-red-700 text-white font-bold shadow-xs"
                : "hover:text-red-700 hover:bg-white/90"
            }`}
          >
            <SlidersHorizontal size={14} /> Tất cả Sản phẩm
          </Link>
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="px-3.5 py-2.5 hover:text-red-700 hover:bg-white/80 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-red-700 font-medium">
          <Link to="/orders" className="hover:underline">
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    </nav>
  );
};
