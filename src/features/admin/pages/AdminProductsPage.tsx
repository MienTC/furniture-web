import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Select,
  Space,
  Pagination,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import { useSearchParams } from 'react-router-dom';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconFilter,
  IconRotateClockwise,
  IconVideo,
} from '@tabler/icons-react';
import { useAdminProducts } from '~/features/admin/hooks';
import { useCategories } from '~/features/products/hooks/useCategory';
import { formatVND } from '~/common/utils/formatters';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import USearchInput from '~/components/ui/usearch-input';
import UTag from '~/components/ui/utag';
import UBadge from '~/components/ui/ubadge';
import ProductFormModal from '~/features/admin/components/ProductFormModal';
import type { AdminProductDto } from '~/types/admin.type';

export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategoryId = searchParams.get('categoryId') || '';
  const urlEditId = searchParams.get('editId') || '';

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategoryId);
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { categories } = useCategories();

  // Gọi Hook tập trung
  const {
    products,
    total,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isSubmitting,
  } = useAdminProducts({
    page: currentPage,
    limit: 10,
    search: search || undefined,
    categoryId: selectedCategory || undefined,
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

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setStockFilter('all');
    setPriceFilter('all');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Client-side filtering cho các tiêu chí bổ sung (stock & price)
  const filteredProducts = products.filter((p: any) => {
    if (stockFilter === 'in_stock' && (!p.inStock || p.stockQuantity <= 0)) return false;
    if (stockFilter === 'out_of_stock' && (p.inStock && p.stockQuantity > 0)) return false;

    if (priceFilter === 'under_2m' && p.price >= 2000000) return false;
    if (priceFilter === '2m_5m' && (p.price < 2000000 || p.price > 5000000)) return false;
    if (priceFilter === '5m_10m' && (p.price < 5000000 || p.price > 10000000)) return false;
    if (priceFilter === 'above_10m' && p.price <= 10000000) return false;

    return true;
  });

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 75,
      render: (imgs: string[], row: any) => (
        <div className="relative size-12 rounded-xl overflow-hidden border border-gray-200">
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
            className="font-semibold text-gray-900 text-xs hover:text-sky-600 hover:underline text-left cursor-pointer"
          >
            {name}
          </button>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-gray-400 font-mono">{row.s_ID}</span>
            {row.material && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                {row.material}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Danh Mục',
      dataIndex: 'categoryName',
      width: 140,
      render: (cat: string) => cat ? <UTag color="sky">{cat}</UTag> : <span className="text-gray-300 text-xs">—</span>,
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      width: 120,
      render: (price: number) => (
        <span className="font-bold text-sky-600 text-xs">{formatVND(price)}</span>
      ),
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'stockQuantity',
      width: 85,
      render: (qty: number) => (
        <span className="font-semibold text-gray-700 text-xs">{qty} cái</span>
      ),
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'inStock',
      width: 105,
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
              icon={<IconEdit size={16} className="text-gray-500 hover:text-sky-500" />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteProduct(record.id)}
          >
            <Tooltip title="Xóa">
              <Button size="small" type="text" danger icon={<IconTrash size={16} />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedCategory) ||
    stockFilter !== 'all' ||
    priceFilter !== 'all';

  return (
    <div className="flex flex-col gap-5 font-sans">
      <UBreadcrumb
        title="Quản Lý Sản Phẩm"
        trailing={
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleOpenCreate}
            className="!bg-sky-500 hover:!bg-sky-400 !font-semibold !shadow-xs"
          >
            Thêm sản phẩm mới
          </Button>
        }
      />

      {/* Thanh Bộ Lọc Toàn Diện (Full Filters Bar) */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <USearchInput
              placeholder="Tìm theo tên sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            placeholder="Lọc theo Danh mục"
            value={selectedCategory || undefined}
            onChange={(val) => {
              setSelectedCategory(val || '');
              setCurrentPage(1);
            }}
            allowClear
            className="w-48 !h-9"
          >
            {categories.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={stockFilter}
            onChange={(val) => setStockFilter(val)}
            className="w-36 !h-9"
          >
            <Select.Option value="all">Tất cả kho</Select.Option>
            <Select.Option value="in_stock">Còn hàng</Select.Option>
            <Select.Option value="out_of_stock">Hết hàng</Select.Option>
          </Select>

          <Select
            value={priceFilter}
            onChange={(val) => setPriceFilter(val)}
            className="w-40 !h-9"
          >
            <Select.Option value="all">Tất cả mức giá</Select.Option>
            <Select.Option value="under_2m">Dưới 2.000.000đ</Select.Option>
            <Select.Option value="2m_5m">2.000.000đ - 5.000.000đ</Select.Option>
            <Select.Option value="5m_10m">5.000.000đ - 10.000.000đ</Select.Option>
            <Select.Option value="above_10m">Trên 10.000.000đ</Select.Option>
          </Select>

          {hasActiveFilters && (
            <Button
              type="dashed"
              icon={<IconRotateClockwise size={14} />}
              onClick={handleResetFilters}
              className="!text-xs text-gray-500"
            >
              Đặt lại bộ lọc
            </Button>
          )}

          <div className="ml-auto text-xs text-gray-400 font-medium">
            Hiển thị <strong>{filteredProducts.length}</strong> / <strong>{total}</strong> sản phẩm
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Sản Phẩm */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-5">
        <Table
          dataSource={filteredProducts}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={false}
          size="middle"
        />

        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={total}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(t) => `Tổng số ${t} sản phẩm`}
          />
        </div>
      </div>

      {/* Modal Chỉnh Sửa / Tạo Mới Chuẩn Phong Cách Tev Admin & Phaoloweb */}
      <ProductFormModal
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
