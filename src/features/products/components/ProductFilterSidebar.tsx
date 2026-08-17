import React from 'react';
import { SetURLSearchParams } from 'react-router-dom';
import { ProductFilterParams, Category } from '~/types';
import { MATERIAL_OPTIONS } from '~/common/constants';
import { productService } from '~/services/productService';
import { Slider, Checkbox, Button } from 'antd';
import { RotateCcw } from 'lucide-react';

interface ProductFilterSidebarProps {
  filterParams: ProductFilterParams;
  setFilterParams: React.Dispatch<React.SetStateAction<ProductFilterParams>>;
  categories: Category[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  onReset: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filterParams,
  setFilterParams,
  categories,
  searchParams,
  setSearchParams,
  onReset,
}) => {
  const totalProducts = productService.getProducts().length;

  return (
    <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin">
      {/* Category List */}
      <div>
        <h4 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-1.5">
          Danh Mục Sản Phẩm
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => {
              setFilterParams((prev) => ({ ...prev, categoryId: '' }));
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              !filterParams.categoryId
                ? 'bg-red-700 text-white font-bold shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Tất cả danh mục ({totalProducts})
          </button>
          {categories.map((cat) => {
            const count = productService.getProducts({ categoryId: cat.id }).length;
            const isSelected = filterParams.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setFilterParams((prev) => ({ ...prev, categoryId: cat.id }));
                  setSearchParams({ category: cat.id });
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-700 text-white font-bold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-red-800 text-red-100'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter Slider */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold text-stone-900 text-sm mb-2">Khoảng Giá (VND)</h4>
        <div className="px-2">
          <Slider
            range
            min={0}
            max={60000000}
            step={1000000}
            value={[filterParams.minPrice || 0, filterParams.maxPrice || 60000000]}
            onChange={(val) =>
              setFilterParams((prev) => ({ ...prev, minPrice: val[0], maxPrice: val[1] }))
            }
            tooltip={{
              formatter: (val) => `${((val || 0) / 1000000).toFixed(0)} triệu`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-600 mt-2 font-medium">
          <span>{((filterParams.minPrice || 0) / 1000000).toFixed(0)}tr</span>
          <span>{((filterParams.maxPrice || 60000000) / 1000000).toFixed(0)}tr</span>
        </div>
      </div>

      {/* Material Filter */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="font-bold text-stone-900 text-sm mb-3">Chất Liệu Chế Tác</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {MATERIAL_OPTIONS.map((mat) => {
            const isChecked = filterParams.materials?.includes(mat);
            return (
              <label
                key={mat}
                className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-red-700 transition-colors"
              >
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => {
                    const current = filterParams.materials || [];
                    const updated = e.target.checked
                      ? [...current, mat]
                      : current.filter((m) => m !== mat);
                    setFilterParams((prev) => ({ ...prev, materials: updated }));
                  }}
                />
                <span>{mat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Quick Checkboxes */}
      <div className="pt-4 border-t border-stone-200 space-y-2">
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <Checkbox
            checked={filterParams.inStockOnly}
            onChange={(e) =>
              setFilterParams((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
          />
          <span className="font-medium">Chỉ hiện sản phẩm còn hàng</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <Checkbox
            checked={filterParams.onSaleOnly}
            onChange={(e) =>
              setFilterParams((prev) => ({ ...prev, onSaleOnly: e.target.checked }))
            }
          />
          <span className="font-medium">Chỉ hiện sản phẩm giảm giá</span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-stone-200">
        <Button
          onClick={onReset}
          icon={<RotateCcw size={14} />}
          block
          className="!rounded-lg text-xs"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
};
