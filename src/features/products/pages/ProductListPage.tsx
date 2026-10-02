import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '~/components/ui/ProductCard';
import { FilterPanel } from '~/features/products/components/FilterPanel';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input, Select, Button, Drawer, Pagination } from 'antd';
import type { ProductFilterParams } from '~/types';
import { useProducts } from '../hooks/useProduct';
import { useCategories } from '../hooks/useCategory';

const PAGE_SIZE = 12;

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    categoryId: searchParams.get('category') ?? '',
    search: searchParams.get('search') ?? '',
    minPrice: 0,
    maxPrice: 60000000,
    materials: [],
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
  });

  useEffect(() => {
    setFilterParams((p) => ({
      ...p,
      categoryId: searchParams.get('category') ?? '',
      search: searchParams.get('search') ?? '',
    }));
    setCurrentPage(1);
  }, [searchParams]);

  const { categories } = useCategories();
  const { products, pagination, totalCount, isProductsLoading } = useProducts({
    ...filterParams,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const handleChange = (partial: Partial<ProductFilterParams>) => {
    setFilterParams((p) => ({ ...p, ...partial }));
    setCurrentPage(1);
    if (partial.categoryId !== undefined) {
      partial.categoryId ? setSearchParams({ category: partial.categoryId }) : setSearchParams({});
    }
  };

  const handleReset = () => {
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
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalProductsCount = categories.reduce((sum, c) => sum + (c.itemCount || 0), 0) || 668;

  const activeCategory = categories.find(
    (c) => c.id === filterParams.categoryId || c.slug === filterParams.categoryId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-amber-950 text-white rounded-2xl p-8 shadow-sm overflow-hidden relative">
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
            LuxDecor Collections
          </span>
          <h1 className="text-3xl font-bold text-white">
            {activeCategory ? activeCategory.name : 'Tất Cả Sản Phẩm Nội Thất'}
          </h1>
          <p className="text-xs text-stone-300">
            Khám phá hơn {totalCount || totalProductsCount} mẫu nội thất cao cấp chế tác tinh xảo, đẳng cấp thượng lưu.
          </p>
        </div>
      </div>

      {/* Control bar */}
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
            onChange={(e) => handleChange({ search: e.target.value })}
            prefix={<Search size={14} className="text-stone-400" />}
            allowClear
            className="!rounded-lg text-xs max-w-xs"
          />
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Hiển thị <strong className="text-stone-900">{products.length}</strong> sản phẩm
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-stone-500 font-medium shrink-0">Sắp xếp:</span>
          <Select
            value={filterParams.sortBy}
            onChange={(val) => handleChange({ sortBy: val })}
            className="w-44 text-xs"
            options={[
              { value: 'featured', label: 'Nổi bật hàng đầu' },
              { value: 'price-asc', label: 'Giá: Thấp → Cao' },
              { value: 'price-desc', label: 'Giá: Cao → Thấp' },
              { value: 'rating', label: 'Đánh giá cao nhất' },
              { value: 'newest', label: 'Mới nhất 2026' },
            ]}
          />
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar with independent internal scroll */}
        <div className="hidden lg:block bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          <FilterPanel
            filterParams={filterParams}
            categories={categories}
            totalCount={totalCount || totalProductsCount}
            getCategoryCount={(id) => {
              const cat = categories.find((c) => c.id === id);
              return cat?.itemCount || 0;
            }}
            onChange={handleChange}
            onReset={handleReset}
          />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title="Bộ Lọc Sản Phẩm"
          placement="left"
          onClose={() => setMobileFilterOpen(false)}
          open={mobileFilterOpen}
          width={320}
        >
          <FilterPanel
            filterParams={filterParams}
            categories={categories}
            totalCount={totalCount || totalProductsCount}
            getCategoryCount={(id) => {
              const cat = categories.find((c) => c.id === id);
              return cat?.itemCount || 0;
            }}
            onChange={(p) => {
              handleChange(p);
              setMobileFilterOpen(false);
            }}
            onReset={() => {
              handleReset();
              setMobileFilterOpen(false);
            }}
          />
        </Drawer>

        {/* Products Grid & Pagination */}
        <div className="lg:col-span-3 space-y-6">
          {isProductsLoading ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-stone-200 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-amber-900" size={32} />
              <p className="text-sm text-stone-500">Đang tải danh sách sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-stone-800 text-lg">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thử thay đổi từ khóa hoặc bấm đặt lại bộ lọc để xem các sản phẩm khác.
              </p>
              <Button onClick={handleReset} type="primary" className="!bg-amber-900 font-bold text-xs">
                Đặt lại bộ lọc
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalCount > PAGE_SIZE && (
                <div className="flex justify-center items-center pt-8 border-t border-stone-200">
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={totalCount}
                    onChange={(p) => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    showSizeChanger={false}
                    className="lux-pagination"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
