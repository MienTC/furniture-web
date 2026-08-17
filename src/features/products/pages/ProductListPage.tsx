import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '~/services/productService';
import { ProductCard } from '~/components/ui/ProductCard';
import { Product, ProductFilterParams } from '~/types';
import { formatVND } from '~/common/utils/formatters';
import { Search, SlidersHorizontal, RotateCcw, X, Sparkles } from 'lucide-react';
import { Input, Select, Button, Tag, Pagination, Empty } from 'antd';
import { ProductFilterModal } from '../components/ProductFilterModal';

const PAGE_SIZE = 6;

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
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1); // Reset to page 1 whenever filters change
  }, [filterParams]);

  const categories = productService.getCategories();
  const allProductsCount = productService.getProducts().length;

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
    setCurrentPage(1);
  };

  const handleApplyFilterModal = (updated: ProductFilterParams) => {
    setFilterParams(updated);
    if (updated.categoryId) {
      setSearchParams({ category: updated.categoryId });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Check active filters count for badge display
  const activeFiltersCount =
    (filterParams.categoryId ? 1 : 0) +
    ((filterParams.minPrice && filterParams.minPrice > 0) || (filterParams.maxPrice && filterParams.maxPrice < 60000000) ? 1 : 0) +
    (filterParams.materials && filterParams.materials.length > 0 ? filterParams.materials.length : 0) +
    (filterParams.inStockOnly ? 1 : 0) +
    (filterParams.onSaleOnly ? 1 : 0);

  const selectedCategoryName = categories.find((c) => c.id === filterParams.categoryId)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Controls Bar with Popup Filter Trigger */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter Popup Button */}
            <Button
              type="primary"
              onClick={() => setFilterModalOpen(true)}
              icon={<SlidersHorizontal size={15} />}
              className="!bg-red-700 hover:!bg-red-800 !rounded-xl text-xs font-bold px-4 !h-10 flex items-center gap-1.5 shadow-sm"
            >
              Bộ Lọc Nâng Cao
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-white text-red-700 rounded-full text-[10px] font-extrabold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Quick Search */}
            <Input
              placeholder="Tìm kiếm nội thất theo tên..."
              value={filterParams.search}
              onChange={(e) => setFilterParams((prev) => ({ ...prev, search: e.target.value }))}
              prefix={<Search size={14} className="text-stone-400" />}
              allowClear
              className="!rounded-xl text-xs !h-10 max-w-xs !bg-stone-50 hover:!bg-white focus:!bg-white"
            />
          </div>

          {/* Sort Selector & Product Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-500 font-medium hidden md:inline">
              Hiển thị <strong>{products.length}</strong> sản phẩm
            </span>
            <span className="text-xs text-stone-400 font-medium">Sắp xếp:</span>
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
              className="w-44 !h-10 text-xs"
            />
          </div>
        </div>

        {/* Active Filters Tag Bar */}
        {activeFiltersCount > 0 && (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 text-[11px] font-semibold">Đang lọc theo:</span>
            
            {filterParams.categoryId && (
              <Tag
                closable
                onClose={() => handleApplyFilterModal({ ...filterParams, categoryId: '' })}
                color="red"
                className="!rounded-lg !px-2.5 !py-0.5 text-xs font-medium"
              >
                Danh mục: {selectedCategoryName}
              </Tag>
            )}

            {((filterParams.minPrice && filterParams.minPrice > 0) || (filterParams.maxPrice && filterParams.maxPrice < 60000000)) && (
              <Tag
                closable
                onClose={() => handleApplyFilterModal({ ...filterParams, minPrice: 0, maxPrice: 60000000 })}
                color="red"
                className="!rounded-lg !px-2.5 !py-0.5 text-xs font-medium"
              >
                Giá: {formatVND(filterParams.minPrice || 0)} - {formatVND(filterParams.maxPrice || 60000000)}
              </Tag>
            )}

            {filterParams.materials?.map((mat) => (
              <Tag
                key={mat}
                closable
                onClose={() =>
                  handleApplyFilterModal({
                    ...filterParams,
                    materials: filterParams.materials?.filter((m) => m !== mat),
                  })
                }
                color="red"
                className="!rounded-lg !px-2.5 !py-0.5 text-xs font-medium"
              >
                Chất liệu: {mat}
              </Tag>
            ))}

            {filterParams.inStockOnly && (
              <Tag
                closable
                onClose={() => handleApplyFilterModal({ ...filterParams, inStockOnly: false })}
                color="red"
                className="!rounded-lg !px-2.5 !py-0.5 text-xs font-medium"
              >
                Còn hàng
              </Tag>
            )}

            {filterParams.onSaleOnly && (
              <Tag
                closable
                onClose={() => handleApplyFilterModal({ ...filterParams, onSaleOnly: false })}
                color="red"
                className="!rounded-lg !px-2.5 !py-0.5 text-xs font-medium"
              >
                Đang giảm giá
              </Tag>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-red-700 hover:text-red-800 hover:underline ml-1 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Product Grid Area */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 mx-auto flex items-center justify-center text-red-600">
            <Search size={32} />
          </div>
          <h3 className="font-bold text-stone-800 text-lg">Không tìm thấy sản phẩm nào phù hợp</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các tiêu chí trong bộ lọc.
          </p>
          <Button
            onClick={handleResetFilters}
            type="primary"
            className="!bg-red-700 hover:!bg-red-800 !rounded-xl font-bold text-xs px-6"
          >
            Xóa Tất Cả Bộ Lọc
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 6 Products Grid per Page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Clean Pagination (6 items per page) */}
          {products.length > PAGE_SIZE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200 bg-white p-5 rounded-2xl border shadow-2xs">
              <span className="text-xs text-stone-500 font-medium">
                Đang hiển thị {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, products.length)} trên tổng số {products.length} sản phẩm
              </span>
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={products.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          )}
        </div>
      )}

      {/* Ant Design Form-based Filter Modal */}
      <ProductFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filterParams={filterParams}
        onApply={handleApplyFilterModal}
        onReset={handleResetFilters}
        categories={categories}
        totalProductsCount={allProductsCount}
      />
    </div>
  );
};
