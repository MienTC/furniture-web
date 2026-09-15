import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Slider, Checkbox, Button } from 'antd';
import { MATERIAL_OPTIONS } from '~/common/constants';
import type { Category, ProductFilterParams } from '~/types';

interface Props {
  filterParams: ProductFilterParams; categories: Category[];
  totalCount: number; getCategoryCount: (id: string) => number;
  onChange: (p: Partial<ProductFilterParams>) => void; onReset: () => void;
}

export const FilterPanel: React.FC<Props> = ({ filterParams, categories, totalCount, getCategoryCount, onChange, onReset }) => (
  <div className="space-y-6">
    <div>
      <h4 className="font-bold text-stone-900 text-sm mb-3">Danh Mục Sản Phẩm</h4>
      <div className="space-y-1">
        <button onClick={() => onChange({ categoryId: '' })} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${!filterParams.categoryId ? 'bg-amber-950 text-white' : 'text-stone-700 hover:bg-stone-100'}`}>
          Tất cả ({totalCount})
        </button>
        {categories.map(cat => {
          const selected = filterParams.categoryId === cat.id;
          return (
            <button key={cat.id} onClick={() => onChange({ categoryId: cat.id })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${selected ? 'bg-amber-950 text-white' : 'text-stone-700 hover:bg-stone-100'}`}>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${selected ? 'bg-amber-800 text-amber-100' : 'bg-stone-200 text-stone-600'}`}>{getCategoryCount(cat.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
    <div className="pt-4 border-t border-stone-200">
      <h4 className="font-bold text-stone-900 text-sm mb-2">Khoảng Giá (VND)</h4>
      <div className="px-2">
        <Slider range min={0} max={60000000} step={1000000}
          value={[filterParams.minPrice ?? 0, filterParams.maxPrice ?? 60000000]}
          onChange={val => onChange({ minPrice: val[0], maxPrice: val[1] })}
          tooltip={{ formatter: v => `${((v ?? 0) / 1000000).toFixed(0)} triệu` }} />
      </div>
      <div className="flex justify-between text-xs text-stone-600 mt-2 font-medium">
        <span>{((filterParams.minPrice ?? 0) / 1000000).toFixed(0)}tr</span>
        <span>{((filterParams.maxPrice ?? 60000000) / 1000000).toFixed(0)}tr</span>
      </div>
    </div>
    <div className="pt-4 border-t border-stone-200">
      <h4 className="font-bold text-stone-900 text-sm mb-3">Chất Liệu</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {MATERIAL_OPTIONS.map(mat => (
          <label key={mat} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-amber-900">
            <Checkbox checked={filterParams.materials?.includes(mat)}
              onChange={e => {
                const cur = filterParams.materials ?? [];
                onChange({ materials: e.target.checked ? [...cur, mat] : cur.filter(m => m !== mat) });
              }} />
            {mat}
          </label>
        ))}
      </div>
    </div>
    <div className="pt-4 border-t border-stone-200 space-y-2">
      <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
        <Checkbox checked={filterParams.inStockOnly} onChange={e => onChange({ inStockOnly: e.target.checked })} />
        <span className="font-medium">Chỉ hiện còn hàng</span>
      </label>
      <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
        <Checkbox checked={filterParams.onSaleOnly} onChange={e => onChange({ onSaleOnly: e.target.checked })} />
        <span className="font-medium">Chỉ hiện giảm giá</span>
      </label>
    </div>
    <div className="pt-4 border-t border-stone-200">
      <Button onClick={onReset} icon={<RotateCcw size={14} />} block className="!rounded-lg text-xs">Đặt lại bộ lọc</Button>
    </div>
  </div>
);
