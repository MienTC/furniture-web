import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { useSearchParams } from 'react-router-dom';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconVideo,
} from '@tabler/icons-react';
import { useAdminProducts, useTableFilters } from '~/features/admin/hooks';
import { useCategories } from '~/features/products/hooks/useCategory';
import { formatVND } from '~/common/utils/formatters';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UTag from '~/components/ui/utag';
import UBadge from '~/components/ui/ubadge';
import UButtonCopy from '~/components/ui/ubutton-copy';
import UAlertDialog from '~/components/ui/ualert-dialog';
import {
  FilterBar,
  FilterSearch,
  FilterCategory,
  FilterSelect,
  FilterResetButton,
} from '~/components/common/filters';
import { ProductModal } from '~/features/admin/components/products';
import type { AdminProductDto } from '~/types';

const STOCK_OPTIONS = [
  { value: 'all', label: 'Tất cả kho hàng' },
  { value: 'in_stock', label: 'Còn hàng' },
  { value: 'out_of_stock', label: 'Hết hàng' },
];

const PRICE_OPTIONS = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: 'under_2m', label: 'Dưới 2.000.000₫' },
  { value: '2m_5m', label: '2.000.000₫ - 5.000.000₫' },
  { value: '5m_10m', label: '5.000.000₫ - 10.000.000₫' },
  { value: 'above_10m', label: 'Trên 10.000.000₫' },
];

export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategoryId = searchParams.get('categoryId') || '';
  const urlEditId = searchParams.get('editId') || '';

  const { filters, setFilter, resetFilters, hasActiveFilters } = useTableFilters({
    categoryId: urlCategoryId,
    stock: 'all',
    price: 'all',
    limit: 8,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { categories } = useCategories();

  const {
    products,
    total,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isSubmitting,
    isDeleting,
  } = useAdminProducts({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    categoryId: filters.categoryId || undefined,
  });

  // Tự động mở modal chỉnh sửa nếu URL có ?editId=...
  useEffect(() => {
    if (urlEditId && products.length > 0) {
      const found = products.find((p: any) => p.id === urlEditId || p.s_ID === urlEditId);
      if (found) {
        setEditingProduct(found);
        setIsModalOpen(true);
      }
    }
  }, [urlEditId, products]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingProduct(record);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload: AdminProductDto) => {
    if (editingProduct) {
      await updateProduct({ id: editingProduct.id, payload });
    } else {
      await createProduct(payload);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    if (urlEditId) {
      searchParams.delete('editId');
      setSearchParams(searchParams);
    }
  };

  // Lọc client-side cho các tiêu chí phụ nếu API backend chưa lọc
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      if (filters.stock === 'in_stock' && (!p.inStock || p.stockQuantity <= 0)) return false;
      if (filters.stock === 'out_of_stock' && (p.inStock && p.stockQuantity > 0)) return false;

      if (filters.price === 'under_2m' && p.price >= 2000000) return false;
      if (filters.price === '2m_5m' && (p.price < 2000000 || p.price > 5000000)) return false;
      if (filters.price === '5m_10m' && (p.price < 5000000 || p.price > 10000000)) return false;
      if (filters.price === 'above_10m' && p.price <= 10000000) return false;

      return true;
    });
  }, [products, filters.stock, filters.price]);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 75,
      render: (imgs: string[], row: any) => (
        <div className="relative size-10 rounded-lg overflow-hidden border border-gray-200">
          {imgs?.[0] ? (
            <img
              src={imgs[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">
              Không ảnh
            </div>
          )}
          {row.videoUrl && (
            <span
              className="absolute bottom-0 right-0 bg-red-600 text-white p-0.5 rounded-tl shadow text-[9px]"
              title="Có video YouTube"
            >
              <IconVideo size={10} />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      render: (name: string, row: any) => (
        <div>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="font-semibold text-gray-900 text-xs hover:text-[#2B5A50] hover:underline text-left cursor-pointer"
          >
            {name}
          </button>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-gray-400 font-mono">{row.s_ID}</span>
            <UButtonCopy copyValue={row.s_ID} />
            {row.material && (
              <Tooltip title={`Chất liệu: ${row.material}`} placement="topLeft">
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded ml-1 max-w-[220px] truncate inline-block align-middle cursor-default">
                  {row.material}
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Danh Mục',
      dataIndex: 'categoryName',
      width: 140,
      render: (cat: string) => cat ? <UBadge color="blue">{cat}</UBadge> : <span className="text-slate-400 text-xs">-</span>,
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      width: 120,
      render: (price: number) => (
        <span className="font-bold text-[#2B5A50] text-xs">{formatVND(price)}</span>
      ),
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'stockQuantity',
      width: 90,
      render: (qty: number) => (
        <span className="font-semibold text-gray-700 text-xs">{qty} cái</span>
      ),
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'inStock',
      width: 110,
      render: (inStock: boolean, row: any) => (
        <UBadge color={inStock && row.stockQuantity > 0 ? 'green' : 'red'}>
          {inStock && row.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
        </UBadge>
      ),
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_: any, record: any) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa sản phẩm">
            <Button
              size="small"
              type="text"
              icon={<IconEdit size={16} className="text-gray-500 hover:text-[#2B5A50]" />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <UAlertDialog
            title="Xác nhận xóa sản phẩm này?"
            description={`Bạn có chắc chắn muốn xóa sản phẩm "${record.name}" không?`}
            onDelete={() => deleteProduct(record.id)}
            loading={isDeleting}
            iconChildren={<IconTrash size={16} className="text-rose-500" />}
            titleTooltip="Xóa sản phẩm"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans">
      <UBreadcrumb
        title="Quản Lý Sản Phẩm"
        trailing={
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleOpenCreate}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !shadow-xs !h-9 !px-4 !rounded-lg cursor-pointer"
          >
            Thêm sản phẩm mới
          </Button>
        }
      />

      <FilterBar
        trailing={
          <div className="text-xs text-gray-400 font-medium">
            Hiển thị <strong>{filteredProducts.length}</strong> / <strong>{total}</strong> sản phẩm
          </div>
        }
      >
        <FilterSearch
          value={filters.search || ''}
          onChange={(val) => setFilter('search', val)}
          placeholder="Tìm theo tên sản phẩm..."
          className="w-64"
        />

        <FilterCategory
          value={filters.categoryId}
          onChange={(val) => setFilter('categoryId', val)}
          className="w-48"
        />

        <FilterSelect
          value={filters.stock}
          onChange={(val) => setFilter('stock', val)}
          options={STOCK_OPTIONS}
          className="w-36"
        />

        <FilterSelect
          value={filters.price}
          onChange={(val) => setFilter('price', val)}
          options={PRICE_OPTIONS}
          className="w-44"
        />

        {hasActiveFilters && (
          <FilterResetButton onReset={resetFilters} />
        )}
      </FilterBar>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-col">
        <Table
          dataSource={filteredProducts}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          size="middle"
          pagination={{
            current: filters.page || 1,
            pageSize: filters.limit || 8,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t) => `Tổng số ${t.toLocaleString()} sản phẩm`,
            onChange: (page, pageSize) => {
              setFilter('page', page);
              if (pageSize && pageSize !== filters.limit) {
                setFilter('limit', pageSize);
              }
            },
          }}
        />
      </div>

      <ProductModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          if (urlEditId) {
            searchParams.delete('editId');
            setSearchParams(searchParams);
          }
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        categories={categories}
        loading={isSubmitting}
      />
    </div>
  );
};

export default AdminProductsPage;
