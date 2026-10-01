import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { useCategories } from "~/features/products/hooks/useCategory";
import type { Category } from "~/types";

const RootNavItem: React.FC<{ root: Category; allCategories: Category[] }> = ({
  root,
  allCategories,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const lv2List = allCategories.filter((c) => c.parentId === root.id);
  const [activeLv2Id, setActiveLv2Id] = useState<string | null>(null);

  // Current active Level 2 item (default to first)
  const currentLv2 = lv2List.find((c) => c.id === activeLv2Id) || lv2List[0];
  const lv3List = currentLv2
    ? allCategories.filter((c) => c.parentId === currentLv2.id)
    : [];

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        setIsOpen(true);
        if (lv2List.length > 0) setActiveLv2Id(lv2List[0].id);
      }}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={`/products?category=${root.id}`}
        className="px-4 py-3 flex items-center gap-1.5 hover:text-amber-900 hover:bg-stone-100/70 rounded-md transition-all uppercase tracking-wider text-[11px] font-bold"
      >
        <span>{root.name}</span>
        {lv2List.length > 0 && (
          <ChevronDown
            size={13}
            className={`text-stone-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-amber-900" : ""
            }`}
          />
        )}
      </Link>

      {/* 2-Panel Cascading Flyout Menu */}
      {isOpen && lv2List.length > 0 && (
        <div className="absolute top-full left-0 bg-white rounded-xl shadow-2xl border border-stone-200/90 z-50 flex overflow-hidden min-w-[220px]">
          {/* Left panel: Level 2 items */}
          <div className="w-56 p-2 bg-stone-50/70 border-r border-stone-100 flex flex-col gap-0.5">
            {lv2List.map((lv2) => {
              const hasLv3 = allCategories.some((c) => c.parentId === lv2.id);
              const isActive = currentLv2?.id === lv2.id;

              return (
                <div
                  key={lv2.id}
                  onMouseEnter={() => setActiveLv2Id(lv2.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isActive
                      ? "bg-amber-900 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-200/60"
                  }`}
                >
                  <Link
                    to={`/products?category=${lv2.id}`}
                    className="truncate flex-1"
                  >
                    {lv2.name}
                  </Link>
                  {hasLv3 && (
                    <ChevronRight
                      size={13}
                      className={isActive ? "text-amber-200" : "text-stone-400"}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right panel: Level 3 items (flyout when hovered Lv2 has children) */}
          {lv3List.length > 0 && (
            <div className="w-64 p-3 bg-white flex flex-col gap-1">
              <div className="text-[11px] font-bold text-amber-900 pb-1.5 mb-1 border-b border-stone-100 uppercase tracking-wider flex items-center justify-between">
                <span className="truncate pr-2">{currentLv2?.name}</span>
                <Link
                  to={`/products?category=${currentLv2?.id}`}
                  className="text-[10px] text-stone-400 hover:text-amber-800 shrink-0 font-normal hover:underline"
                >
                  Tất cả
                </Link>
              </div>
              {lv3List.map((lv3) => (
                <Link
                  key={lv3.id}
                  to={`/products?category=${lv3.id}`}
                  className="px-2.5 py-1.5 rounded-md text-xs text-stone-600 hover:text-amber-900 hover:bg-amber-50/80 transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-1 transition-transform font-medium truncate pr-2">
                    {lv3.name}
                  </span>
                  {lv3.itemCount > 0 && (
                    <span className="text-[10px] text-stone-400 font-mono shrink-0">
                      {lv3.itemCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export const CategoryNav: React.FC = () => {
  const location = useLocation();
  const { categories } = useCategories();

  // Root categories: items with no parentId
  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <nav className="hidden md:block bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-sm relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-stone-700">
        <ul className="flex items-center gap-1 list-none m-0 p-0">
          <li>
            <Link
              to="/products"
              className={`px-4 py-3 flex items-center gap-2 transition-all rounded-md ${
                location.pathname === "/products" && !location.search
                  ? "text-amber-900 font-bold bg-amber-50"
                  : "hover:text-amber-900 hover:bg-stone-100/70"
              }`}
            >
              <SlidersHorizontal size={14} className="text-amber-800" />
              <span>TẤT CẢ SẢN PHẨM</span>
            </Link>
          </li>

          {rootCategories.map((root) => (
            <RootNavItem
              key={root.id}
              root={root}
              allCategories={categories}
            />
          ))}
        </ul>

        <div className="flex items-center gap-4 text-stone-500 font-medium text-xs">
          <Link to="/orders" className="hover:text-amber-900 transition-colors">
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    </nav>
  );
};
