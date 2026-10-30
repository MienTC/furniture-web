import React, { useState, useEffect } from 'react';
import { Modal, Input, Checkbox, Table, Button, Flex, Avatar, Empty, Tag, Spin } from 'antd';
import { SearchOutlined, CloseCircleFilled, ShoppingOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '~/services/v1/admin.service';
import { useDebounce } from '~/common/hooks/use-debounce';
import { formatVND } from '~/common/utils/formatters';

export interface ProductItem {
  id?: string;
  s_ID?: string;
  name: string;
  price?: number;
  discountPercent?: number;
  images?: string[];
  stockQuantity?: number;
  categoryName?: string;
}

interface ProductPickerModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (selectedIds: string[], selectedProducts: ProductItem[]) => void;
  initialSelectedIds?: string[];
  initialSelectedProducts?: ProductItem[];
  title?: string;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  open,
  onCancel,
  onOk,
  initialSelectedIds = [],
  initialSelectedProducts = [],
  title = 'Chọn Sản Phẩm Tham Gia Flash Sale',
}) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMap, setSelectedMap] = useState<Map<string, ProductItem>>(new Map());

  // Reset & load initial data khi modal mở
  useEffect(() => {
    if (open) {
      setSearch('');
      setCurrentPage(1);

      const initialMap = new Map<string, ProductItem>();
      // Nạp từ initialSelectedProducts nếu có
      (initialSelectedProducts || []).forEach((p) => {
        const id = p.s_ID || p.id || '';
        if (id) initialMap.set(id, p);
      });

      // Nếu có ID mà chưa có full object trong products, tạo placeholder object
      (initialSelectedIds || []).forEach((id) => {
        if (id && !initialMap.has(id)) {
          initialMap.set(id, { id, s_ID: id, name: `Sản phẩm ${id}` });
        }
      });

      setSelectedMap(initialMap);
    }
  }, [open, initialSelectedIds, initialSelectedProducts]);

  // Reset về page 1 mỗi khi đổi từ khóa tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Query dữ liệu sản phẩm từ backend với phân trang chuẩn Antd
  const { data, isLoading } = useQuery({
    queryKey: ['adminPickerProducts', currentPage, debouncedSearch],
    queryFn: async () => {
      const res = await adminService.getProducts({
        page: currentPage,
        limit: 6,
        search: debouncedSearch ? debouncedSearch.trim() : undefined,
      });
      return res;
    },
    enabled: open,
    staleTime: 30 * 1000,
  });

  const productItems: ProductItem[] = data?.items || [];
  const totalProducts = data?.pagination?.total || 0;

  // Cập nhật thông tin chi tiết của sản phẩm đã chọn khi chúng xuất hiện trong kết quả query
  useEffect(() => {
    if (productItems.length > 0) {
      setSelectedMap((prev) => {
        let hasChanges = false;
        const next = new Map(prev);
        productItems.forEach((p) => {
          const id = p.s_ID || p.id || '';
          if (id && next.has(id)) {
            const current = next.get(id);
            if (!current?.price || current.name.startsWith('Sản phẩm ')) {
              next.set(id, p);
              hasChanges = true;
            }
          }
        });
        return hasChanges ? next : prev;
      });
    }
  }, [productItems]);

  const toggleProduct = (record: ProductItem) => {
    const prodId = record.s_ID || record.id || '';
    if (!prodId) return;

    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(prodId)) {
        next.delete(prodId);
      } else {
        next.set(prodId, record);
      }
      return next;
    });
  };

  const removeProduct = (prodId: string) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      next.delete(prodId);
      return next;
    });
  };

  const handleSelectAllCurrentPage = () => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      productItems.forEach((p) => {
        const id = p.s_ID || p.id || '';
        if (id) next.set(id, p);
      });
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedMap(new Map());
  };

  const selectedList = Array.from(selectedMap.values());
  const selectedKeys = Array.from(selectedMap.keys());

  // Columns cho Table
  const columns = [
    {
      title: '',
      dataIndex: 'select',
      width: 36,
      render: (_: any, record: ProductItem) => {
        const prodId = record.s_ID || record.id || '';
        const isChecked = selectedMap.has(prodId);
        return (
          <Checkbox
            checked={isChecked}
            onChange={(e) => {
              e.stopPropagation();
              toggleProduct(record);
            }}
          />
        );
      },
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 46,
      render: (images: string[]) => (
        <Avatar
          src={images?.[0]}
          shape="square"
          size={34}
          className="rounded-md bg-stone-100 border border-stone-200"
        />
      ),
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      render: (name: string, record: ProductItem) => {
        const prodId = record.s_ID || record.id || '';
        const isChecked = selectedMap.has(prodId);
        return (
          <div className="min-w-0 pr-1">
            <p className={`text-xs font-semibold line-clamp-1 m-0 ${isChecked ? 'text-[#2B5A50]' : 'text-stone-800'}`}>
              {name}
            </p>
            {record.categoryName && (
              <span className="text-[10px] text-stone-400 font-normal">
                {record.categoryName}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      width: 110,
      render: (price: number, record: ProductItem) => (
        <div className="text-right">
          <p className="text-xs font-bold text-[#2B5A50] m-0">
            {formatVND(price || 0)}
          </p>
          {record.discountPercent && record.discountPercent > 0 ? (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
              -{record.discountPercent}%
            </span>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={840}
      title={
        <div className="flex items-center gap-2 text-stone-900 font-bold text-base pb-2 border-b border-stone-100">
          <ShoppingOutlined className="text-[#2B5A50]" />
          <span>{title}</span>
        </div>
      }
      centered
      destroyOnClose
      footer={
        <Flex justify="end" gap={8} className="pt-2 border-t border-stone-100">
          <Button onClick={onCancel} className="!rounded-lg">
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={() => onOk(selectedKeys, selectedList)}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !rounded-lg"
          >
            Xác nhận ({selectedKeys.length} sản phẩm)
          </Button>
        </Flex>
      }
    >
      <div className="py-2 font-sans space-y-3">
        {/* Thanh tìm kiếm & Hành động chọn nhanh */}
        <div className="flex items-center gap-2">
          <Input
            prefix={<SearchOutlined className="text-stone-400 mr-1" />}
            placeholder="Tìm sản phẩm theo tên hoặc mã SP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="!rounded-lg !py-1.5 text-xs flex-1"
          />
          <Button
            size="small"
            onClick={handleSelectAllCurrentPage}
            disabled={productItems.length === 0}
            className="text-xs !h-8 !rounded-lg"
          >
            Chọn cả trang này
          </Button>
          {selectedKeys.length > 0 && (
            <Button
              size="small"
              danger
              onClick={handleDeselectAll}
              className="text-xs !h-8 !rounded-lg"
            >
              Bỏ chọn tất cả ({selectedKeys.length})
            </Button>
          )}
        </div>

        {/* Khung 2 cột chuẩn Pick theo tev-fe-admin có Pagination Antd */}
        <div className="grid grid-cols-12 gap-3 min-h-[360px] border border-stone-200 rounded-xl p-2.5 bg-white">
          {/* Cột trái (7 cols): Bảng sản phẩm phân trang Ant Design chuẩn 6 item/trang */}
          <div className="col-span-7 flex flex-col justify-between border-r border-stone-200 pr-2">
            <div>
              <Table
                rowKey={(r) => r.s_ID || r.id || ''}
                columns={columns}
                dataSource={productItems}
                loading={isLoading}
                size="small"
                pagination={{
                  current: currentPage,
                  pageSize: 6,
                  total: totalProducts,
                  size: 'small',
                  showSizeChanger: false,
                  showTotal: (total) => `Tổng ${total} SP`,
                  onChange: (page) => setCurrentPage(page),
                }}
                onRow={(record) => ({
                  onClick: () => toggleProduct(record),
                  className: 'cursor-pointer hover:bg-stone-50 transition-colors',
                })}
              />
            </div>
          </div>

          {/* Cột phải (5 cols): Danh sách sản phẩm ĐÃ CHỌN chuẩn tev-fe-admin */}
          <div className="col-span-5 flex flex-col h-full pl-1">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs flex-none">
              <span className="font-semibold text-stone-700">Đã chọn:</span>
              <Tag color="green" className="!m-0 font-bold !text-xs !rounded-full !px-2.5">
                {selectedList.length} sản phẩm
              </Tag>
            </div>

            {selectedList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-xs text-stone-400">
                <Empty description="Chưa chọn sản phẩm nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pt-2 max-h-[310px] pr-1">
                {selectedList.map((p) => {
                  const prodId = p.s_ID || p.id || '';
                  return (
                    <div
                      key={prodId}
                      className="flex items-center justify-between w-full rounded-full px-2.5 py-1 bg-[#EDF5F2] border border-[#D0DBD6] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Avatar
                          size={22}
                          src={p.images?.[0]}
                          shape="circle"
                          className="bg-white border border-[#D0DBD6] shrink-0"
                        />
                        <p className="truncate text-xs font-medium text-[#1A2421] m-0">
                          {p.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProduct(prodId);
                        }}
                        className="text-stone-400 hover:text-rose-500 transition-colors shrink-0 ml-1.5 flex items-center justify-center cursor-pointer border-0 bg-transparent p-0"
                        title="Gỡ bỏ sản phẩm"
                      >
                        <CloseCircleFilled style={{ fontSize: 15 }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductPickerModal;
