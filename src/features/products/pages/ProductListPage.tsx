import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '~/components/ui/ProductCard';
import { FilterPanel } from '~/features/products/components/FilterPanel';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Input, Select, Button, Drawer, Pagination } from 'antd';
import type { ProductFilterParams } from '~/types';
import { useProducts } from '../hooks/useProduct';
import { useCategories } from '../hooks/useCategory';

const PAGE_SIZE = 12;

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

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

  // Sync when searchParams changes (e.g. from Header or browser navigation)
  useEffect(() => {
    const urlCategory = searchParams.get('category') ?? '';
    const urlSearch = searchParams.get('search') ?? '';
    setSearchInput(urlSearch);
    setFilterParams((p) => ({
      ...p,
      categoryId: urlCategory,
      search: urlSearch,
    }));
    setCurrentPage(1);
  }, [searchParams]);

  // Debounce search input (400ms) before updating filterParams and searchParams
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filterParams.search) {
        setFilterParams((p) => ({ ...p, search: searchInput }));
        setCurrentPage(1);
        const newParams: Record<string, string> = {};
        if (filterParams.categoryId) newParams.category = filterParams.categoryId;
        if (searchInput.trim()) newParams.search = searchInput.trim();
        setSearchParams(newParams, { replace: true });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, filterParams.categoryId, filterParams.search, setSearchParams]);

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
      const newParams: Record<string, string> = {};
      if (partial.categoryId) newParams.category = partial.categoryId;
      if (searchInput.trim()) newParams.search = searchInput.trim();
      setSearchParams(newParams);
    }
  };

  const handleReset = () => {
    setSearchInput('');
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
      <div className="bg-stone-900 border border-brand-coral/30 text-white rounded-2xl p-8 shadow-sm overflow-hidden relative">
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="text-xs text-brand-peach font-bold uppercase tracking-widest">
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
            icon={<FilterOutlined style={{ fontSize: 13 }} />}
            className="lg:hidden !rounded-lg text-xs"
          >
            Bộ lọc
          </Button>
          <Input
            placeholder="Tìm theo tên sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            prefix={<SearchOutlined className="text-stone-400" style={{ fontSize: 13 }} />}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-stone-200 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-stone-200 rounded-lg" />
                  <div className="h-4 bg-stone-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-stone-100 rounded w-1/2 mx-auto" />
                  <div className="h-5 bg-stone-200 rounded w-1/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                <SearchOutlined style={{ fontSize: 32 }} />
              </div>
              <h3 className="font-bold text-stone-800 text-lg">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thử thay đổi từ khóa hoặc bấm đặt lại bộ lọc để xem các sản phẩm khác.
              </p>
              <Button onClick={handleReset} type="primary" className="!bg-brand-coral hover:!bg-[#c95f5f] font-bold text-xs cursor-pointer">
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
