import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppstoreOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
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
      className="relative shrink-0"
      onMouseEnter={() => {
        setIsOpen(true);
        if (lv2List.length > 0) setActiveLv2Id(lv2List[0].id);
      }}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={`/products?category=${root.id}`}
        className={`px-3.5 py-3 flex items-center gap-1.5 transition-colors uppercase tracking-wider text-xs font-bold rounded-md whitespace-nowrap ${
          isOpen ? "text-brand-coral bg-[#EDF5F2]" : "text-[#1A2421] hover:text-brand-coral hover:bg-stone-50"
        }`}
      >
        <span>{root.name}</span>
        {lv2List.length > 0 && (
          <DownOutlined
            style={{ fontSize: 10 }}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand-coral" : "text-stone-400"
            }`}
          />
        )}
      </Link>

      {/* 2-Panel Cascading Flyout Menu */}
      {isOpen && lv2List.length > 0 && (
        <div className="absolute top-full left-0 bg-white rounded-2xl shadow-xl border border-[#E5EAE7] z-50 flex overflow-hidden min-w-[240px]">
          {/* Left panel: Level 2 items */}
          <div className="w-56 p-2 bg-[#F8FAF9] border-r border-[#E5EAE7] flex flex-col gap-1">
            {lv2List.map((lv2) => {
              const hasLv3 = allCategories.some((c) => c.parentId === lv2.id);
              const isActive = currentLv2?.id === lv2.id;

              return (
                <Link
                  key={lv2.id}
                  to={`/products?category=${lv2.id}`}
                  onMouseEnter={() => setActiveLv2Id(lv2.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? "bg-[#EDF5F2] text-brand-coral font-bold"
                      : "text-[#1A2421] hover:bg-stone-100 hover:text-brand-coral font-medium"
                  }`}
                >
                  <span className="truncate flex-1">{lv2.name}</span>
                  {hasLv3 && (
                    <RightOutlined
                      style={{ fontSize: 10 }}
                      className={isActive ? "text-brand-coral font-bold" : "text-stone-400"}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right panel: Level 3 items */}
          {lv3List.length > 0 && (
            <div className="w-64 p-3.5 bg-white flex flex-col gap-1.5 min-w-[240px]">
              <div className="pb-2 mb-1 border-b border-stone-100 flex items-center justify-between">
                <span className="truncate pr-2 text-xs font-bold text-[#1A2421] uppercase tracking-wider">
                  {currentLv2?.name}
                </span>
                <Link
                  to={`/products?category=${currentLv2?.id}`}
                  className="text-[11px] text-brand-coral hover:underline shrink-0 font-bold"
                >
                  TẤT CẢ
                </Link>
              </div>
              <div className="space-y-0.5">
                {lv3List.map((lv3) => (
                  <Link
                    key={lv3.id}
                    to={`/products?category=${lv3.id}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-50 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-[#1A2421] group-hover:text-brand-coral font-medium truncate pr-2 group-hover:translate-x-0.5 transition-transform">
                      {lv3.name}
                    </span>
                    {lv3.itemCount > 0 && (
                      <span className="text-[10px] bg-stone-100 text-stone-500 font-mono font-medium px-2 py-0.5 rounded-full group-hover:bg-[#EDF5F2] group-hover:text-brand-coral transition-colors shrink-0">
                        {lv3.itemCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
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
    <nav className="hidden md:block bg-white border-t border-stone-200/80 shadow-2xs relative z-30 font-sans">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
        <ul className="flex items-center gap-1 list-none m-0 p-0 py-0.5">
          <li className="shrink-0">
            <Link
              to="/products"
              className={`px-3.5 py-3 flex items-center gap-2 transition-all rounded-md font-bold uppercase tracking-wider whitespace-nowrap ${
                location.pathname === "/products" && !location.search
                  ? "text-brand-coral bg-[#EDF5F2]"
                  : "text-[#1A2421] hover:text-brand-coral hover:bg-stone-50"
              }`}
            >
              <AppstoreOutlined className="text-brand-coral" style={{ fontSize: 14 }} />
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

        <div className="flex items-center gap-4 font-semibold text-xs shrink-0 pl-4 border-l border-stone-200/80 my-2">
          <Link
            to="/orders"
            className="text-stone-600 hover:text-brand-coral transition-colors whitespace-nowrap"
          >
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    </nav>
  );
};
