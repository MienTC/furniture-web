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
import { FieldCell } from '~/components/shared/FieldCell';
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
  { value: 'trustbar', label: 'Cam kết dịch vụ (Trust Bar)' },
  { value: 'promo_img4', label: 'Quảng bá ưu đãi (Promo)' },
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
      if (filters.type === 'all') return true;
      if (filters.type === 'trustbar') {
        return b.type === 'trustbar' || b.type === 'trust_bar';
      }
      return b.type === filters.type;
    });
  }, [banners, filters.type]);

  const columns = [
    {
      title: 'Thứ Tự',
      dataIndex: 'sort_order',
      width: 80,
      align: 'center' as const,
      sorter: (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0),
      render: (order: number) => (
        <span className="inline-flex items-center justify-center size-7 rounded-lg bg-stone-100 text-stone-700 font-bold text-xs">
          {order ?? 0}
        </span>
      ),
    },
    {
      title: 'Hình Ảnh',
      dataIndex: 'image_url',
      width: 140,
      render: (img: string, row: any) =>
        img ? (
          <img
            src={img}
            alt=""
            className="w-28 h-16 object-cover rounded-lg border border-stone-200 shadow-2xs"
          />
        ) : (
          <div className="w-28 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-[11px] text-stone-400 border border-dashed border-stone-200">
            {row.type === 'trustbar' || row.type === 'trust_bar' ? 'Dạng Text' : 'Chưa có ảnh'}
          </div>
        ),
    },
    {
      title: 'Tiêu Đề & Nội Dung',
      dataIndex: 'title',
      render: (title: string, row: any) => (
        <div className="space-y-1 py-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-xs text-stone-900">
              <FieldCell value={title} />
            </div>
            {row.badge_text && (
              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {row.badge_text}
              </span>
            )}
          </div>
          {row.subtitle && (
            <p className="text-[11px] text-stone-500 m-0 line-clamp-1">{row.subtitle}</p>
          )}
          {row.highlights && row.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {row.highlights.map((h: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          )}
          {row.link_url && (
            <p className="text-[10px] text-stone-400 m-0 font-mono truncate max-w-xs">
              Link: {row.link_url}
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'Vị Trí Hiển Thị',
      dataIndex: 'type',
      width: 150,
      render: (type: string) => {
        if (type === 'hero') return <UBadge color="blue">Hero Banner</UBadge>;
        if (type === 'showcase') return <UBadge color="indigo">Bộ Sưu Tập</UBadge>;
        if (type === 'trustbar' || type === 'trust_bar') return <UBadge color="green">Trust Bar</UBadge>;
        if (type === 'promo_img4') return <UBadge color="orange">Banner Ưu Đãi</UBadge>;
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
          className={active ? '!bg-[#2B5A50]' : undefined}
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
            description={`Bạn có chắc chắn muốn xóa banner "${record.title || record.s_ID}" không?`}
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
    <div className="h-full flex flex-col min-h-0 overflow-hidden font-sans gap-3">
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
          <div className="text-xs text-stone-500 font-medium">
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

      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-stone-200/80 shadow-2xs p-4 overflow-hidden">
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
          scroll={{ y: 'calc(100vh - 290px)', x: 'max-content' }}
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
