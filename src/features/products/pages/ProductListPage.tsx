import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '~/components/ui/ProductCard';
import { FilterPanel } from '~/features/products/components/FilterPanel';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { IconFlame } from '@tabler/icons-react';
import { Select, Button, Drawer, Pagination } from 'antd';
import type { ProductFilterParams } from '~/types';
import { useProducts } from '../hooks/useProduct';
import { useCategories } from '../hooks/useCategory';
import { useFlashSale } from '~/features/home/hooks/useFlashSale';

const PAGE_SIZE = 12;

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: flashSale } = useFlashSale();

  const isFlashSaleParam = searchParams.get('flashsale') === 'true';
  const isSaleParam = searchParams.get('sale') === 'true';

  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    categoryId: searchParams.get('category') ?? '',
    search: searchParams.get('search') ?? '',
    minPrice: 0,
    maxPrice: 60000000,
    materials: [],
    inStockOnly: false,
    onSaleOnly: isSaleParam && !isFlashSaleParam,
    flashsale: isFlashSaleParam,
    sortBy: 'featured',
  });

  // Sync khi searchParams trên URL thay đổi (từ Header search hoặc CategoryNav)
  useEffect(() => {
    const urlCategory = searchParams.get('category') ?? '';
    const urlSearch = searchParams.get('search') ?? '';
    const isFlashSale = searchParams.get('flashsale') === 'true';
    const isSale = searchParams.get('sale') === 'true';

    setFilterParams((p) => ({
      ...p,
      categoryId: urlCategory,
      search: urlSearch,
      flashsale: isFlashSale,
      onSaleOnly: isSale && !isFlashSale,
    }));
    setCurrentPage(1);
  }, [searchParams]);

  const { categories } = useCategories();
  const { products, totalCount, isProductsLoading } = useProducts({
    ...filterParams,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const handleChange = (partial: Partial<ProductFilterParams>) => {
    setFilterParams((prev) => {
      const next = { ...prev, ...partial };
      const newParams = new URLSearchParams();
      if (next.categoryId) newParams.set('category', next.categoryId);
      if (next.search?.trim()) newParams.set('search', next.search.trim());
      if (next.flashsale) newParams.set('flashsale', 'true');
      else if (next.onSaleOnly) newParams.set('sale', 'true');
      setSearchParams(newParams);
      return next;
    });
    setCurrentPage(1);
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
      flashsale: false,
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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Tiêu đề trang & Breadcrumb: Tinh gọn, sang trọng, không chiếm diện tích */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link to="/" className="hover:text-brand-coral transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">Sản phẩm</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-brand-coral font-bold">{activeCategory.name}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {activeCategory
              ? activeCategory.name
              : (filterParams.flashsale ? 'Sản Phẩm Flash Sale Giảm Giá Sốc' : (filterParams.onSaleOnly ? 'Sản Phẩm Đang Khuyến Mãi' : 'Tất Cả Sản Phẩm Nội Thất'))}
          </h1>
        </div>

        {/* Nút lọc cho màn hình nhỏ (Mobile / Tablet) */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            onClick={() => setMobileFilterOpen(true)}
            icon={<FilterOutlined style={{ fontSize: 13 }} />}
            className="!rounded-xl text-xs !h-9 font-semibold"
          >
            Bộ lọc ({totalCount || totalProductsCount})
          </Button>
        </div>
      </div>

      {/* Bố cục 2 cột chính: Sidebar bộ lọc bên trái (1/4) + Lưới sản phẩm bên phải (3/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Cột trái: Sidebar bộ lọc trên Desktop */}
        <div className="hidden lg:block bg-white p-5 rounded-2xl border border-stone-200 shadow-xs sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
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

        {/* Drawer bộ lọc trên Mobile */}
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

        {/* Cột phải: Thanh công cụ duy nhất + Lưới sản phẩm */}
        <div className="lg:col-span-3 space-y-5">
          {/* THANH CÔNG CỤ DUY NHẤT: Gọn gàng, một hàng ngang, không phân mảnh */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 sm:px-4 sm:py-3 rounded-2xl border border-stone-200 shadow-2xs">
            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
              <button
                type="button"
                onClick={() => {
                  handleChange({ onSaleOnly: false, flashsale: false, sortBy: 'featured' });
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  !filterParams.flashsale && !filterParams.onSaleOnly && filterParams.sortBy !== 'newest' && filterParams.sortBy !== 'rating'
                    ? 'bg-brand-coral text-white shadow-xs'
                    : 'bg-[#F4F6F5] text-[#1A2421] hover:bg-[#EDF5F2] hover:text-brand-coral font-medium'
                }`}
              >
                Tất Cả ({totalCount || totalProductsCount})
              </button>

              {/* Chỉ hiển thị tab Flash Sale khi Flash Sale có sản phẩm */}
              {(flashSale?.products?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    handleChange({ flashsale: true, onSaleOnly: false });
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    filterParams.flashsale
                      ? 'bg-brand-coral text-white shadow-xs'
                      : 'bg-[#EDF5F2] text-brand-coral hover:bg-[#DDEEE8] font-medium'
                  }`}
                >
                  <IconFlame size={14} />
                  <span>Flash Sale ({flashSale?.products?.length || 0})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleChange({ sortBy: 'newest', flashsale: false })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filterParams.sortBy === 'newest' && !filterParams.flashsale
                    ? 'bg-brand-coral text-white shadow-xs'
                    : 'bg-[#F4F6F5] text-[#1A2421] hover:bg-[#EDF5F2] hover:text-brand-coral font-medium'
                }`}
              >
                Mới Nhất 2026
              </button>

              <button
                type="button"
                onClick={() => handleChange({ sortBy: 'rating', flashsale: false })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filterParams.sortBy === 'rating' && !filterParams.flashsale
                    ? 'bg-brand-coral text-white shadow-xs'
                    : 'bg-[#F4F6F5] text-[#1A2421] hover:bg-[#EDF5F2] hover:text-brand-coral font-medium'
                }`}
              >
                Đánh Giá Cao
              </button>
            </div>

            {/* Điều khiển Sắp xếp & Số lượng sản phẩm */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                Hiển thị <strong className="text-stone-900">{products.length}</strong> sản phẩm
              </span>
              <Select
                value={filterParams.sortBy}
                onChange={(val) => handleChange({ sortBy: val })}
                className="w-40 text-xs"
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

          {/* Tag thông báo từ khóa tìm kiếm (nếu người dùng tìm từ thanh Header) */}
          {filterParams.search && (
            <div className="flex items-center gap-2 bg-stone-100 px-3.5 py-2 rounded-xl text-xs text-stone-700">
              <span>Đang tìm kiếm theo từ khóa: <strong>"{filterParams.search}"</strong></span>
              <button
                onClick={() => handleChange({ search: '' })}
                className="text-stone-400 hover:text-stone-900 font-bold ml-auto cursor-pointer"
              >
                ✕ Xóa tìm kiếm
              </button>
            </div>
          )}

          {/* Lưới sản phẩm (Product Grid) */}
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
                Thử chọn danh mục khác hoặc bấm đặt lại bộ lọc để xem các sản phẩm hiện có.
              </p>
              <Button onClick={handleReset} type="primary" className="!bg-[#2B5A50] hover:!bg-[#20453D] font-bold text-xs cursor-pointer">
                Đặt lại bộ lọc
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Phân trang (Pagination) */}
              {totalCount > PAGE_SIZE && (
                <div className="flex justify-center items-center pt-8 border-t border-stone-200">
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={totalCount}
                    onChange={(p) => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
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
