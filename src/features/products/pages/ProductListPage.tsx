import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '~/services/productService';
import { ProductCard } from '~/components/ui/ProductCard';
import { Product, ProductFilterParams } from '~/types';
import { MATERIAL_OPTIONS } from '~/common/constants';
import { Search, SlidersHorizontal, RotateCcw, Filter, Check } from 'lucide-react';
import { Input, Select, Slider, Checkbox, Button, Drawer, Tag } from 'antd';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFromUrl = searchParams.get('category') || '';
  const searchFromUrl = searchParams.get('search') || '';

  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    categoryId: categoryFromUrl,
    search: searchFromUrl,
    minPrice: 0,
    maxPrice: 60000000,
    materials: [],
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params
  useEffect(() => {
    setFilterParams((prev) => ({
      ...prev,
      categoryId: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
    }));
  }, [searchParams]);

  // Fetch filtered products
  useEffect(() => {
    const list = productService.getProducts(filterParams);
    setProducts(list);
  }, [filterParams]);

  const categories = productService.getCategories();

  const handleResetFilters = () => {
    setFilterParams({
      categoryId: '',
      search: '',
      minPrice: 0,
      maxPrice: 60000000,
      materials: [],
      inStockOnly: false,
      onSaleOnly: false,
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="space-y-6">
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
                ? 'bg-amber-950 text-white font-bold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Tất cả danh mục ({productService.getProducts().length})
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
                    ? 'bg-amber-950 text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-amber-800 text-amber-100' : 'bg-stone-200 text-stone-600'}`}>
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
              <label key={mat} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-amber-900">
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
          onClick={handleResetFilters}
          icon={<RotateCcw size={14} />}
          block
          className="!rounded-lg text-xs"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="bg-amber-950 text-white rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
            LuxDecor Collections
          </span>
          <h1 className="text-3xl font-serif-heading font-bold text-white">
            {filterParams.categoryId
              ? categories.find((c) => c.id === filterParams.categoryId)?.name
              : 'Tất Cả Sản Phẩm Nội Thất'}
          </h1>
          <p className="text-xs text-stone-300">
            Khám phá hơn {products.length} mẫu nội thất cao cấp chế tác thủ công tinh xảo
          </p>
        </div>
      </div>

      {/* Top Controls & Mobile Filter button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => setMobileFilterOpen(true)}
            icon={<Filter size={14} />}
            className="lg:hidden !rounded-lg text-xs"
          >
            Bộ lọc
          </Button>

          <Input
            placeholder="Tìm theo tên sản phẩm..."
            value={filterParams.search}
            onChange={(e) => setFilterParams((prev) => ({ ...prev, search: e.target.value }))}
            prefix={<Search size={14} className="text-stone-400" />}
            allowClear
            className="!rounded-lg text-xs max-w-xs"
          />

          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Hiển thị <strong className="text-stone-900">{products.length}</strong> sản phẩm
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-stone-500 font-medium shrink-0">Sắp xếp:</span>
          <Select
            value={filterParams.sortBy}
            onChange={(val) => setFilterParams((prev) => ({ ...prev, sortBy: val }))}
            options={[
              { value: 'featured', label: 'Nổi bật hàng đầu' },
              { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
              { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
              { value: 'rating', label: 'Đánh giá cao nhất' },
              { value: 'newest', label: 'Mới nhất 2026' },
            ]}
            className="w-44 text-xs"
          />
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs h-fit sticky top-24">
          <FilterPanel />
        </div>

        {/* Mobile Filter Drawer */}
        <Drawer
          title="Bộ Lọc Sản Phẩm"
          placement="left"
          onClose={() => setMobileFilterOpen(false)}
          open={mobileFilterOpen}
          width={300}
        >
          <FilterPanel />
        </Drawer>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-stone-800 text-lg">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn một số tiêu chí lọc để xem thêm các mẫu nội thất khác.
              </p>
              <Button onClick={handleResetFilters} type="primary" className="!bg-amber-900 font-bold text-xs">
                Đặt lại bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
