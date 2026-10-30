import React, { useState, useMemo } from 'react';
import {
  Modal,
  Table,
  Button,
  Input,
  Tag,
  Space,
  Select,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  BorderOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAdminProducts } from '~/features/admin/hooks';
import { formatVND } from '~/common/utils/formatters';

interface SelectProductsModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
}

export const SelectProductsModal: React.FC<SelectProductsModalProps> = ({
  open,
  onClose,
  categoryId,
  categoryName,
}) => {
  const [search, setSearch] = useState('');
  const [catStatusFilter, setCatStatusFilter] = useState<'all' | 'uncategorized' | 'other' | 'current'>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Lấy danh sách sản phẩm để chọn qua hook
  const { products: allProducts, isLoading, assignProductsToCategory, isAssigning } = useAdminProducts({
    limit: 500,
  });

  // Lọc sản phẩm chi tiết theo các tiêu chí
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Tìm kiếm từ khóa (tên hoặc mã ID)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.s_ID || '').toLowerCase().includes(q) ||
          (p.id || '').toLowerCase().includes(q)
      );
    }

    // 2. Lọc tình trạng danh mục
    if (catStatusFilter === 'uncategorized') {
      result = result.filter((p) => !p.categoryId || p.categoryId === '');
    } else if (catStatusFilter === 'other') {
      result = result.filter((p) => p.categoryId && p.categoryId !== categoryId);
    } else if (catStatusFilter === 'current') {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    // 3. Lọc khoảng giá
    if (priceFilter === 'under_1m') {
      result = result.filter((p) => (p.price || 0) < 1000000);
    } else if (priceFilter === '1m_5m') {
      result = result.filter((p) => (p.price || 0) >= 1000000 && (p.price || 0) <= 5000000);
    } else if (priceFilter === '5m_15m') {
      result = result.filter((p) => (p.price || 0) > 5000000 && (p.price || 0) <= 15000000);
    } else if (priceFilter === 'above_15m') {
      result = result.filter((p) => (p.price || 0) > 15000000);
    }

    // 4. Lọc tình trạng kho
    if (stockFilter === 'in_stock') {
      result = result.filter((p) => (p.stockQuantity || 0) > 0);
    } else if (stockFilter === 'out_of_stock') {
      result = result.filter((p) => (p.stockQuantity || 0) === 0);
    }

    // 5. Sắp xếp
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [allProducts, search, catStatusFilter, priceFilter, stockFilter, sortBy, categoryId]);

  const handleConfirmAdd = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }
    try {
      await assignProductsToCategory({ categoryId, productIds: selectedRowKeys as string[] });
      setSelectedRowKeys([]);
      onClose();
    } catch {
      // Error is toasted inside useAdminProducts hook
    }
  };

  const handleSelectAllFiltered = () => {
    const keys = filteredProducts.map((p) => p.s_ID || p.id || p._id);
    setSelectedRowKeys(Array.from(new Set([...selectedRowKeys, ...keys])));
  };

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCatStatusFilter('all');
    setPriceFilter('all');
    setStockFilter('all');
    setSortBy('newest');
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 56,
      render: (imgs: string[]) =>
        imgs?.[0] ? (
          <img
            src={imgs[0]}
            alt=""
            className="size-9 rounded-lg object-cover border border-gray-200"
          />
        ) : (
          <div className="size-9 rounded-lg bg-stone-100 border border-gray-200 flex items-center justify-center text-[10px] text-stone-400">
            -
          </div>
        ),
    },
    {
      title: 'Tên Sản Phẩm & Mã',
      dataIndex: 'name',
      render: (name: string, row: any) => {
        const isCurrentCat = row.categoryId === categoryId;
        return (
          <div>
            <p className="font-semibold text-xs text-gray-900 m-0 line-clamp-1">{name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-gray-400 font-mono">{row.s_ID}</span>
              {row.categoryName ? (
                <Tag
                  color={isCurrentCat ? 'blue' : 'default'}
                  className="text-[10px] m-0 px-1 py-0"
                >
                  {isCurrentCat ? 'Đang trong danh mục này' : row.categoryName}
                </Tag>
              ) : (
                <Tag color="orange" className="text-[10px] m-0 px-1 py-0">
                  Chưa có danh mục
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      width: 110,
      render: (p: number) => <span className="font-bold text-sky-600 text-xs">{formatVND(p)}</span>,
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'stockQuantity',
      width: 80,
      render: (q: number) => (
        <span className={`text-xs font-medium ${q > 0 ? 'text-gray-700' : 'text-rose-500'}`}>
          {q > 0 ? `${q} cái` : 'Hết hàng'}
        </span>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-6 pb-2 border-b border-gray-100 font-sans">
          <div>
            <h3 className="text-base font-bold text-gray-900 m-0">
              Chọn Sản Phẩm Vào Danh Mục
            </h3>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Đang thao tác gán vào danh mục: <strong className="text-sky-600">{categoryName}</strong>
            </p>
          </div>
          {selectedRowKeys.length > 0 && (
            <Tag color="blue" className="text-xs font-semibold px-2 py-0.5">
              Đã tích chọn {selectedRowKeys.length} sản phẩm
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={880}
      centered
      destroyOnClose
      footer={
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-sans">
          <div className="flex items-center gap-2">
            <Button
              size="small"
              icon={<CheckSquareOutlined />}
              onClick={handleSelectAllFiltered}
              disabled={filteredProducts.length === 0}
              className="text-xs"
            >
              Chọn tất cả ({filteredProducts.length})
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button
                size="small"
                icon={<BorderOutlined />}
                onClick={handleClearSelection}
                className="text-xs"
              >
                Bỏ chọn tất cả
              </Button>
            )}
          </div>
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleConfirmAdd}
              loading={isAssigning}
              disabled={selectedRowKeys.length === 0}
              className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold"
            >
              Gán {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length}) sản phẩm` : ''} vào danh mục
            </Button>
          </Space>
        </div>
      }
    >
      <div className="space-y-3 py-2 font-sans">
        {/* Thanh tìm kiếm và bộ lọc đa năng */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
          <div className="md:col-span-4">
            <Input
              placeholder="Tìm theo tên hoặc mã SP..."
              prefix={<SearchOutlined className="text-gray-400 mr-1" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="!rounded-lg !py-1 text-xs"
            />
          </div>

          <div className="md:col-span-3">
            <Select
              value={catStatusFilter}
              onChange={(val) => setCatStatusFilter(val)}
              className="w-full text-xs"
              options={[
                { value: 'all', label: 'Tất cả tình trạng danh mục' },
                { value: 'uncategorized', label: 'Chưa có danh mục' },
                { value: 'other', label: 'Thuộc danh mục khác' },
                { value: 'current', label: 'Đang trong danh mục này' },
              ]}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={priceFilter}
              onChange={(val) => setPriceFilter(val)}
              className="w-full text-xs"
              options={[
                { value: 'all', label: 'Mọi mức giá' },
                { value: 'under_1m', label: '< 1 triệu' },
                { value: '1m_5m', label: '1 - 5 triệu' },
                { value: '5m_15m', label: '5 - 15 triệu' },
                { value: 'above_15m', label: '> 15 triệu' },
              ]}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={stockFilter}
              onChange={(val) => setStockFilter(val)}
              className="w-full text-xs"
              options={[
                { value: 'all', label: 'Tất cả kho' },
                { value: 'in_stock', label: 'Còn hàng' },
                { value: 'out_of_stock', label: 'Hết hàng' },
              ]}
            />
          </div>

          <div className="md:col-span-1 flex items-center justify-center">
            <Button
              size="small"
              icon={<ClearOutlined />}
              title="Đặt lại bộ lọc"
              onClick={handleResetFilters}
              className="text-xs w-full !h-8"
            />
          </div>
        </div>

        {/* Thống kê kết quả lọc */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Tìm thấy <b>{filteredProducts.length}</b> sản phẩm phù hợp
            {search || catStatusFilter !== 'all' || priceFilter !== 'all' || stockFilter !== 'all' ? (
              <span className="text-sky-600 ml-1">(đang lọc)</span>
            ) : null}
          </span>
          <div className="flex items-center gap-1.5">
            <span>Sắp xếp:</span>
            <Select
              size="small"
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              className="w-36 text-xs"
              options={[
                { value: 'newest', label: 'Mới nhất' },
                { value: 'price_asc', label: 'Giá tăng dần' },
                { value: 'price_desc', label: 'Giá giảm dần' },
                { value: 'name_asc', label: 'Tên A - Z' },
              ]}
            />
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <Table
          rowKey={(r) => r.s_ID || r.id || r._id}
          dataSource={filteredProducts}
          columns={columns}
          loading={isLoading}
          size="small"
          scroll={{ y: 320 }}
          pagination={{ pageSize: 7, size: 'small' }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
        />
      </div>
    </Modal>
  );
};

export default SelectProductsModal;
