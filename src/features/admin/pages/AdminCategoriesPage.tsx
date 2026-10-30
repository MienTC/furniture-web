import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAdminCategories, useTableFilters } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UButtonCopy from '~/components/ui/ubutton-copy';
import UAlertDialog from '~/components/ui/ualert-dialog';
import {
  FilterBar,
  FilterSearch,
  FilterResetButton,
} from '~/components/common/filters';
import CategoryDetailDrawer from '~/features/admin/components/CategoryDetailDrawer';
import { CategoryModal } from '~/features/admin/components/categories';
import type { AdminCategoryPayload } from '~/types';

export const AdminCategoriesPage: React.FC = () => {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useTableFilters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Hook tập trung quản lý categories
  const {
    categories,
    isLoading,
    createCategory,
    deleteCategory,
    isCreating,
    isDeleting,
  } = useAdminCategories();

  const handleFinish = async (values: AdminCategoryPayload) => {
    await createCategory(values);
    setIsModalOpen(false);
  };

  const handleOpenDetail = (cat: any) => {
    setSelectedCategory(cat);
    setIsDetailDrawerOpen(true);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c: any) =>
      (c.s_Name || c.name || '')
        .toLowerCase()
        .includes((filters.search || '').toLowerCase().trim())
    );
  }, [categories, filters.search]);

  const columns = [
    {
      title: 'Tên Danh Mục',
      dataIndex: 's_Name',
      render: (name: string, row: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleOpenDetail(row)}
        >
          {row.image_url ? (
            <img
              src={row.image_url}
              alt=""
              className="size-10 rounded-lg object-cover border border-gray-200 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="size-10 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              <AppstoreOutlined style={{ fontSize: 18 }} />
            </div>
          )}
          <div>
            <p className="font-semibold text-xs text-gray-900 group-hover:text-[#2B5A50] transition-colors m-0">
              {name || row.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-gray-400 font-mono">/{row.slug}</span>
              <UButtonCopy copyValue={row.slug} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      render: (desc: string) => (
        <span className="text-xs text-gray-600 line-clamp-1">
          {desc || <span className="text-slate-400">-</span>}
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      width: 100,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Tooltip title="Xem chi tiết & danh sách sản phẩm">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined style={{ fontSize: 16, color: '#2B5A50' }} />}
              onClick={() => handleOpenDetail(record)}
            />
          </Tooltip>

          <UAlertDialog
            title="Xác nhận xóa danh mục?"
            description={`Bạn có chắc chắn muốn xóa danh mục "${record.s_Name || record.name}" không?`}
            onDelete={() => deleteCategory(record.s_ID)}
            loading={isDeleting}
            iconChildren={<DeleteOutlined style={{ fontSize: 16, color: '#ef4444' }} />}
            titleTooltip="Xóa danh mục"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans">
      <UBreadcrumb
        title="Quản Lý Danh Mục"
        trailing={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !shadow-xs !h-9 !px-4 !rounded-lg cursor-pointer"
          >
            Thêm danh mục mới
          </Button>
        }
      />

      <FilterBar
        trailing={
          <div className="text-xs text-gray-400 font-medium">
            Tổng cộng <strong>{filteredCategories.length}</strong> danh mục
          </div>
        }
      >
        <FilterSearch
          value={filters.search || ''}
          onChange={(val) => setFilter('search', val)}
          placeholder="Tìm kiếm danh mục..."
          className="w-72"
        />

        {hasActiveFilters && (
          <FilterResetButton onReset={resetFilters} />
        )}
      </FilterBar>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-col">
        <Table
          dataSource={filteredCategories}
          rowKey={(r) => r.s_ID || r.id || r.slug}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t) => `Tổng số ${t} danh mục`,
          }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>

      <CategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFinish}
        loading={isCreating}
      />

      {selectedCategory && (
        <CategoryDetailDrawer
          open={isDetailDrawerOpen}
          onClose={() => {
            setIsDetailDrawerOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          categories={categories}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
