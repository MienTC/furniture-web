import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '~/services/productService';
import { ProductCard } from '~/components/ui/ProductCard';
import { FilterPanel } from '~/features/products/components/FilterPanel';
import { Search, Filter } from 'lucide-react';
import { Input, Select, Button, Drawer } from 'antd';
import type { ProductFilterParams } from '~/types';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    categoryId: searchParams.get('category') ?? '',
    search:     searchParams.get('search')   ?? '',
    minPrice: 0, maxPrice: 60000000, materials: [],
    inStockOnly: false, onSaleOnly: false, sortBy: 'featured',
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setFilterParams(p => ({ ...p, categoryId: searchParams.get('category') ?? '', search: searchParams.get('search') ?? '' }));
  }, [searchParams]);

  const categories = productService.getCategories();
  const products   = productService.getProducts(filterParams);

  const handleChange = (partial: Partial<ProductFilterParams>) => {
    setFilterParams(p => ({ ...p, ...partial }));
    if (partial.categoryId !== undefined) {
      partial.categoryId ? setSearchParams({ category: partial.categoryId }) : setSearchParams({});
    }
  };
  const handleReset = () => {
    setFilterParams({ categoryId: '', search: '', minPrice: 0, maxPrice: 60000000, materials: [], inStockOnly: false, onSaleOnly: false, sortBy: 'featured' });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-amber-950 text-white rounded-2xl p-8 shadow-sm overflow-hidden">
        <div className="max-w-xl space-y-2">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">LuxDecor Collections</span>
          <h1 className="text-3xl font-bold text-white">
            {filterParams.categoryId ? categories.find(c => c.id === filterParams.categoryId)?.name : 'Tất Cả Sản Phẩm Nội Thất'}
          </h1>
          <p className="text-xs text-stone-300">Khám phá hơn {products.length} mẫu nội thất cao cấp chế tác thủ công tinh xảo</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => setMobileFilterOpen(true)} icon={<Filter size={14} />} className="lg:hidden !rounded-lg text-xs">Bộ lọc</Button>
          <Input placeholder="Tìm theo tên sản phẩm..." value={filterParams.search} onChange={e => handleChange({ search: e.target.value })} prefix={<Search size={14} className="text-stone-400" />} allowClear className="!rounded-lg text-xs max-w-xs" />
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">Hiển thị <strong className="text-stone-900">{products.length}</strong> sản phẩm</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-stone-500 font-medium shrink-0">Sắp xếp:</span>
          <Select value={filterParams.sortBy} onChange={val => handleChange({ sortBy: val })} className="w-44 text-xs"
            options={[
              { value: 'featured', label: 'Nổi bật hàng đầu' },
              { value: 'price-asc', label: 'Giá: Thấp → Cao' },
              { value: 'price-desc', label: 'Giá: Cao → Thấp' },
              { value: 'rating', label: 'Đánh giá cao nhất' },
              { value: 'newest', label: 'Mới nhất 2026' },
            ]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs h-fit sticky top-24">
          <FilterPanel filterParams={filterParams} categories={categories} totalCount={productService.getProducts().length}
            getCategoryCount={id => productService.getProducts({ categoryId: id }).length}
            onChange={handleChange} onReset={handleReset} />
        </div>
        <Drawer title="Bộ Lọc" placement="left" onClose={() => setMobileFilterOpen(false)} open={mobileFilterOpen} width={300}>
          <FilterPanel filterParams={filterParams} categories={categories} totalCount={productService.getProducts().length}
            getCategoryCount={id => productService.getProducts({ categoryId: id }).length}
            onChange={handleChange} onReset={handleReset} />
        </Drawer>
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400"><Search size={32} /></div>
              <h3 className="font-bold text-stone-800 text-lg">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">Thử thay đổi từ khóa hoặc bỏ một số tiêu chí lọc.</p>
              <Button onClick={handleReset} type="primary" className="!bg-amber-900 font-bold text-xs">Đặt lại bộ lọc</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
