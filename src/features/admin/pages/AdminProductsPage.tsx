import React, { useState } from 'react';
import { Card, Table, Tag, Input, Button, Pagination } from 'antd';
import { Search, Plus } from 'lucide-react';
import { useProducts } from '~/features/products/hooks/useProduct';
import { formatVND } from '~/common/utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const { products, totalCount, isProductsLoading } = useProducts({
    page: currentPage,
    limit: 10,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-stone-500">Danh sách các mẫu nội thất trong kho hệ thống ({totalCount} sản phẩm)</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            prefix={<Search size={14} className="text-stone-400 mr-1" />}
            className="!rounded-xl"
            allowClear
          />
        </div>
      </div>

      <Card className="!rounded-2xl border-stone-200 shadow-2xs">
        <Table
          dataSource={products}
          rowKey="id"
          loading={isProductsLoading}
          pagination={false}
          columns={[
            {
              title: 'Ảnh',
              dataIndex: 'images',
              width: 80,
              render: (imgs: string[]) => (
                <img
                  src={imgs?.[0]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                />
              ),
            },
            {
              title: 'Tên Sản Phẩm',
              dataIndex: 'name',
              render: (name: string) => <span className="font-semibold text-stone-900 text-xs sm:text-sm">{name}</span>,
            },
            {
              title: 'Danh Mục',
              dataIndex: 'categoryName',
              render: (cat: string) => <Tag color="gold">{cat}</Tag>,
            },
            {
              title: 'Giá Bán',
              dataIndex: 'price',
              render: (price: number) => <span className="font-bold text-amber-900 tabular-nums">{formatVND(price)}</span>,
            },
            {
              title: 'Tồn Kho',
              dataIndex: 'stockQuantity',
              render: (qty: number) => <span className="font-medium text-stone-700">{qty || 100}</span>,
            },
            {
              title: 'Trạng Thái',
              dataIndex: 'inStock',
              render: (inStock: boolean) => (
                <Tag color={inStock ? 'success' : 'error'}>
                  {inStock ? 'Đang bán' : 'Hết hàng'}
                </Tag>
              ),
            },
          ]}
        />

        <div className="flex justify-end mt-4 pt-4 border-t border-stone-100">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={totalCount}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      </Card>
    </div>
  );
};
