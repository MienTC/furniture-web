import React, { useState, useEffect } from 'react';
import { RotateCcw, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { Slider, Checkbox, Button } from 'antd';
import { MATERIAL_OPTIONS } from '~/common/constants';
import type { Category, ProductFilterParams } from '~/types';

interface Props {
  filterParams: ProductFilterParams;
  categories: Category[];
  totalCount: number;
  getCategoryCount: (id: string) => number;
  onChange: (p: Partial<ProductFilterParams>) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<Props> = ({
  filterParams,
  categories,
  totalCount,
  getCategoryCount,
  onChange,
  onReset,
}) => {
  // Track which root categories are expanded
  const [expandedRoots, setExpandedRoots] = useState<Record<string, boolean>>({});
  const [expandedLv2, setExpandedLv2] = useState<Record<string, boolean>>({});

  const rootCategories = categories.filter((c) => !c.parentId);

  // Automatically expand the root containing current active category
  useEffect(() => {
    if (filterParams.categoryId) {
      const activeCat = categories.find((c) => c.id === filterParams.categoryId);
      if (activeCat) {
        if (!activeCat.parentId) {
          setExpandedRoots((prev) => ({ ...prev, [activeCat.id]: true }));
        } else {
          // Check if parent is a root or lv2
          const parent = categories.find((c) => c.id === activeCat.parentId);
          if (parent) {
            if (!parent.parentId) {
              setExpandedRoots((prev) => ({ ...prev, [parent.id]: true }));
            } else {
              setExpandedRoots((prev) => ({ ...prev, [parent.parentId!]: true }));
              setExpandedLv2((prev) => ({ ...prev, [parent.id]: true }));
            }
          }
        }
      }
    }
  }, [filterParams.categoryId, categories]);

  const toggleRoot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRoots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLv2 = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLv2((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 text-stone-800">
      {/* Category Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
          <h4 className="font-bold font-serif text-stone-900 text-sm tracking-wide">
            Danh Mục Sản Phẩm
          </h4>
          {filterParams.categoryId && (
            <button
              onClick={() => onChange({ categoryId: '' })}
              className="text-[11px] text-amber-800 hover:underline font-medium"
            >
              Xem tất cả
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
          {/* All products button */}
          <button
            onClick={() => onChange({ categoryId: '' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
              !filterParams.categoryId
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>Tất cả sản phẩm</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                !filterParams.categoryId
                  ? 'bg-amber-800 text-amber-100'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Root Categories Accordion */}
          {rootCategories.map((root) => {
            const lv2Categories = categories.filter((c) => c.parentId === root.id);
            const isRootSelected = filterParams.categoryId === root.id;
            const isExpanded = !!expandedRoots[root.id];
            const rootCount = getCategoryCount(root.id);

            return (
              <div key={root.id} className="rounded-lg overflow-hidden">
                <div
                  onClick={() => onChange({ categoryId: root.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isRootSelected
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    {lv2Categories.length > 0 && (
                      <button
                        onClick={(e) => toggleRoot(root.id, e)}
                        className={`p-0.5 rounded hover:bg-black/10 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      >
                        <ChevronRight size={13} />
                      </button>
                    )}
                    <span className="truncate">{root.name}</span>
                  </div>
                  {rootCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 font-mono ${
                        isRootSelected
                          ? 'bg-amber-800 text-amber-100'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {rootCount}
                    </span>
                  )}
                </div>

                {/* Subcategories (Level 2 & Level 3) */}
                {isExpanded && lv2Categories.length > 0 && (
                  <div className="pl-3 py-1 space-y-1 border-l-2 border-amber-900/20 ml-3.5 my-1">
                    {lv2Categories.map((sub) => {
                      const lv3Categories = categories.filter((c) => c.parentId === sub.id);
                      const isSubSelected = filterParams.categoryId === sub.id;
                      const isLv2Expanded = !!expandedLv2[sub.id];
                      const subCount = getCategoryCount(sub.id);

                      return (
                        <div key={sub.id}>
                          <div
                            onClick={() => onChange({ categoryId: sub.id })}
                            className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSubSelected
                                ? 'bg-amber-800 text-white font-bold'
                                : 'text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            <div className="flex items-center gap-1 truncate pr-1">
                              {lv3Categories.length > 0 && (
                                <button
                                  onClick={(e) => toggleLv2(sub.id, e)}
                                  className={`p-0.5 rounded hover:bg-black/10 transition-transform ${
                                    isLv2Expanded ? 'rotate-90' : ''
                                  }`}
                                >
                                  <ChevronRight size={11} />
                                </button>
                              )}
                              <span className="truncate">{sub.name}</span>
                            </div>
                            {subCount > 0 && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                                  isSubSelected
                                    ? 'bg-amber-700 text-amber-100'
                                    : 'bg-stone-100 text-stone-500'
                                }`}
                              >
                                {subCount}
                              </span>
                            )}
                          </div>

                          {/* Level 3 items */}
                          {isLv2Expanded && lv3Categories.length > 0 && (
                            <div className="pl-3 py-0.5 space-y-0.5 border-l border-stone-200 ml-2 my-0.5">
                              {lv3Categories.map((lv3) => {
                                const isLv3Selected = filterParams.categoryId === lv3.id;
                                const lv3Count = getCategoryCount(lv3.id);
                                return (
                                  <button
                                    key={lv3.id}
                                    onClick={() => onChange({ categoryId: lv3.id })}
                                    className={`w-full text-left px-2 py-1 rounded text-[10px] transition-all flex items-center justify-between ${
                                      isLv3Selected
                                        ? 'bg-amber-700 text-white font-bold'
                                        : 'text-stone-600 hover:text-amber-900 hover:bg-amber-50/50'
                                    }`}
                                  >
                                    <span className="truncate">{lv3.name}</span>
                                    {lv3Count > 0 && (
                                      <span className="font-mono text-[9px] opacity-75">
                                        {lv3Count}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold font-serif text-stone-900 text-sm mb-2">Khoảng Giá (VND)</h4>
        <div className="px-2">
          <Slider
            range
            min={0}
            max={60000000}
            step={1000000}
            value={[filterParams.minPrice ?? 0, filterParams.maxPrice ?? 60000000]}
            onChange={(val) => onChange({ minPrice: val[0], maxPrice: val[1] })}
            tooltip={{ formatter: (v) => `${((v ?? 0) / 1000000).toFixed(0)} triệu` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-600 mt-2 font-medium">
          <span>{((filterParams.minPrice ?? 0) / 1000000).toFixed(0)}tr</span>
          <span>{((filterParams.maxPrice ?? 60000000) / 1000000).toFixed(0)}tr</span>
        </div>
      </div>

      {/* Material Options */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold font-serif text-stone-900 text-sm mb-3">Chất Liệu</h4>
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {MATERIAL_OPTIONS.map((mat) => (
            <label
              key={mat}
              className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-amber-900"
            >
              <Checkbox
                checked={filterParams.materials?.includes(mat)}
                onChange={(e) => {
                  const cur = filterParams.materials ?? [];
                  onChange({
                    materials: e.target.checked ? [...cur, mat] : cur.filter((m) => m !== mat),
                  });
                }}
              />
              <span>{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability / Sale Filters */}
      <div className="pt-4 border-t border-stone-200 space-y-2">
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <Checkbox
            checked={filterParams.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
          />
          <span className="font-medium">Chỉ hiện còn hàng</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <Checkbox
            checked={filterParams.onSaleOnly}
            onChange={(e) => onChange({ onSaleOnly: e.target.checked })}
          />
          <span className="font-medium">Chỉ hiện giảm giá</span>
        </label>
      </div>

      {/* Reset button */}
      <div className="pt-4 border-t border-stone-200">
        <Button
          onClick={onReset}
          icon={<RotateCcw size={13} />}
          block
          className="!rounded-lg text-xs !border-stone-300 hover:!border-amber-800 hover:!text-amber-900"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
};
