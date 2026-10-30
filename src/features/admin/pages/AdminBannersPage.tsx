import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Switch,
  Space,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAdminBanners, useTableFilters } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UBadge from '~/components/ui/ubadge';
import UAlertDialog from '~/components/ui/ualert-dialog';
import {
  FilterBar,
  FilterSelect,
  FilterResetButton,
} from '~/components/common/filters';
import { BannerModal } from '~/features/admin/components/banners';

const BANNER_TYPE_OPTIONS = [
  { value: 'all', label: 'Tất cả phân loại' },
  { value: 'hero', label: 'Banner chính đầu trang (Hero)' },
  { value: 'showcase', label: 'Bộ sưu tập nổi bật (Showcase)' },
  { value: 'trust_bar', label: 'Cam kết dịch vụ (Trust Bar)' },
];

export const AdminBannersPage: React.FC = () => {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useTableFilters({
    type: 'all',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const {
    banners,
    isLoading,
    createBanner,
    updateBanner,
    deleteBanner,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminBanners();

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingBanner(record);
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    if (editingBanner) {
      await updateBanner({ id: editingBanner.s_ID || editingBanner.id, payload: values });
    } else {
      await createBanner(values);
    }
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleToggleStatus = async (record: any, checked: boolean) => {
    const bannerId = record.s_ID || record.id;
    await updateBanner({ id: bannerId, payload: { is_active: checked } });
  };

  const filteredBanners = useMemo(() => {
    return banners.filter((b: any) => {
      if (filters.type !== 'all' && b.type !== filters.type) return false;
      return true;
    });
  }, [banners, filters.type]);

  const columns = [
    {
      title: 'Hình Ảnh',
      dataIndex: 'image_url',
      width: 120,
      render: (img: string, row: any) =>
        img ? (
          <img
            src={img}
            alt=""
            className="w-24 h-14 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-24 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
            {row.type === 'trust_bar' ? 'Dạng Text' : 'Không có ảnh'}
          </div>
        ),
    },
    {
      title: 'Tiêu Đề & Nội Dung',
      dataIndex: 'title',
      render: (title: string, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-gray-900">{title}</span>
            {row.badge_text && (
              <span className="text-[10px] bg-brand-peach/30 text-stone-800 font-bold px-2 py-0.5 rounded-full">
                {row.badge_text}
              </span>
            )}
          </div>
          {row.subtitle && (
            <p className="text-[11px] text-gray-500 m-0 line-clamp-1">{row.subtitle}</p>
          )}
          {row.highlights && row.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {row.highlights.map((h: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Vị Trí Hiển Thị',
      dataIndex: 'type',
      width: 140,
      render: (type: string) => {
        if (type === 'hero') return <UBadge color="blue">Hero Banner</UBadge>;
        if (type === 'showcase') return <UBadge color="indigo">Bộ Sưu Tập</UBadge>;
        if (type === 'trust_bar') return <UBadge color="green">Trust Bar</UBadge>;
        return <UBadge color="gray">{type}</UBadge>;
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'is_active',
      width: 110,
      render: (active: boolean, record: any) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleStatus(record, checked)}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
        />
      ),
    },
    {
      title: 'Thao Tác',
      width: 100,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Tooltip title="Chỉnh sửa nội dung banner">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined style={{ fontSize: 16, color: '#2B5A50' }} />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>

          <UAlertDialog
            title="Xác nhận xóa banner?"
            description={`Bạn có chắc chắn muốn xóa banner "${record.title}" không?`}
            onDelete={() => deleteBanner(record.s_ID || record.id)}
            loading={isDeleting}
            iconChildren={<DeleteOutlined style={{ fontSize: 16, color: '#ef4444' }} />}
            titleTooltip="Xóa banner"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans">
      <UBreadcrumb
        title="Quản Lý Banner & Bộ Sưu Tập"
        trailing={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !shadow-xs !h-9 !px-4 !rounded-lg cursor-pointer"
          >
            Tạo banner mới
          </Button>
        }
      />

      <FilterBar
        trailing={
          <div className="text-xs text-gray-400 font-medium">
            Tổng cộng <strong>{filteredBanners.length}</strong> banner
          </div>
        }
      >
        <FilterSelect
          value={filters.type}
          onChange={(val) => setFilter('type', val)}
          options={BANNER_TYPE_OPTIONS}
          className="w-64"
        />

        {hasActiveFilters && (
          <FilterResetButton onReset={resetFilters} />
        )}
      </FilterBar>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-col">
        <Table
          dataSource={filteredBanners}
          rowKey={(r) => r.s_ID || r.id}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ['8', '15', '30'],
            showTotal: (t) => `Tổng số ${t} banner`,
          }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>

      <BannerModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        onSubmit={handleFinish}
        initialData={editingBanner}
        defaultType={filters.type}
        loading={isCreating || isUpdating}
      />
    </div>
  );
};

export default AdminBannersPage;
