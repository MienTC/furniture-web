import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Popconfirm,
  Select,
  Switch,
  Space,
  Tooltip,
  Input,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAdminBanners } from '~/features/admin/hooks';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import UImageUpload from '~/components/ui/uimage-upload';
import UTag from '~/components/ui/utag';

export const AdminBannersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [form] = Form.useForm();

  // Hook tập trung quản lý banners
  const {
    banners,
    isLoading,
    createBanner,
    updateBanner,
    deleteBanner,
    isCreating,
    isUpdating,
  } = useAdminBanners();

  const handleOpenCreate = () => {
    setEditingBanner(null);
    form.resetFields();
    form.setFieldsValue({
      title: typeFilter === 'showcase' ? 'Không Gian Sang Trọng Cho Căn Hộ Đương Đại' : '',
      subtitle: typeFilter === 'showcase' ? 'Khám phá giải pháp kiến tạo không gian sống với những bộ sưu tập nội thất thông minh, tối ưu diện tích và chuẩn gu thượng lưu.' : '',
      badge_text: typeFilter === 'showcase' ? 'BỘ SƯU TẬP 2026' : '',
      highlights: typeFilter === 'showcase' ? 'Gỗ tự nhiên nguyên khối\nĐộng cơ tự động nhập khẩu\nGiao lắp tận nhà 24/7\nBảo hành chính hãng 5 năm' : '',
      link_url: '/products',
      image_url: '',
      type: typeFilter !== 'all' ? typeFilter : 'hero',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingBanner(record);
    form.setFieldsValue({
      title: record.title || '',
      subtitle: record.subtitle || '',
      badge_text: record.badge_text || '',
      highlights: Array.isArray(record.highlights) ? record.highlights.join('\n') : (record.highlights || ''),
      link_url: record.link_url || '',
      image_url: record.image_url,
      type: record.type || 'hero',
      is_active: record.is_active !== undefined ? record.is_active : true,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const rawHighlights = values.highlights;
    const highlightsArr = Array.isArray(rawHighlights)
      ? rawHighlights
      : (typeof rawHighlights === 'string'
        ? rawHighlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : []);

    const payload = {
      title: values.title || 'Banner',
      subtitle: values.subtitle || '',
      badge_text: values.badge_text || '',
      highlights: highlightsArr,
      link_url: values.link_url || '',
      image_url: values.image_url,
      type: values.type || 'hero',
      is_active: values.is_active !== undefined ? values.is_active : true,
    };
    if (editingBanner) {
      await updateBanner({
        id: editingBanner.s_ID || editingBanner._id,
        payload,
      });
    } else {
      await createBanner(payload);
    }
    setIsModalOpen(false);
    setEditingBanner(null);
    form.resetFields();
  };

  const filteredBanners = banners.filter((b: any) => {
    if (typeFilter !== 'all' && b.type !== typeFilter) return false;
    return true;
  });

  const columns = [
    {
      title: 'Hình Ảnh Banner',
      dataIndex: 'image_url',
      width: 220,
      render: (img: string) => (
        <img
          src={img || 'https://via.placeholder.com/260x100?text=Banner'}
          alt=""
          className="h-16 w-40 rounded-lg object-cover border border-gray-200 shadow-2xs"
        />
      ),
    },
    {
      title: 'Thông Tin & Tiêu Đề',
      dataIndex: 'title',
      render: (title: string, record: any) => (
        <div className="space-y-1">
          <p className="font-bold text-gray-900 text-xs">{title || 'Banner'}</p>
          {record.subtitle && <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{record.subtitle}</p>}
          <div className="flex items-center gap-2">
            {record.badge_text && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-coral/10 text-brand-coral border border-brand-coral/20">
                {record.badge_text}
              </span>
            )}
            {record.link_url && (
              <span className="text-[10px] text-gray-400 font-mono">
                Link: {record.link_url}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Vị Trí Hiển Thị',
      dataIndex: 'type',
      width: 160,
      render: (type: string) => {
        const typeMap: Record<string, { label: string; color: any }> = {
          hero: { label: 'Hero Slider', color: 'sky' },
          showcase: { label: 'Showcase', color: 'orange' },
          trustbar: { label: 'Trustbar', color: 'slate' },
        };
        const cur = typeMap[type] || { label: type?.toUpperCase() || 'HERO', color: 'slate' };
        return <UTag color={cur.color}>{cur.label}</UTag>;
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'is_active',
      width: 140,
      render: (active: boolean, record: any) => (
        <Switch
          checked={active !== false}
          checkedChildren="Hiển thị"
          unCheckedChildren="Tạm ẩn"
          onChange={(checked) => {
            updateBanner({
              id: record.s_ID || record._id,
              payload: { is_active: checked },
            });
          }}
        />
      ),
    },
    {
      title: 'Thao Tác',
      width: 100,
      render: (_: any, record: any) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa ảnh banner">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined style={{ fontSize: 16, color: '#64748b' }} />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa banner này?"
            onConfirm={() => deleteBanner(record.s_ID || record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa banner">
              <Button
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: 16 }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans h-full">
      <UBreadcrumb
        title="Quản Lý Banner Quảng Cáo"
        trailing={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
            className="!bg-sky-500 hover:!bg-sky-400 !font-semibold !shadow-xs"
          >
            Tải banner lên
          </Button>
        }
      >
        <div className="flex items-center gap-3">
          <Select
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
            className="w-56 !h-9"
            options={[
              { value: 'all', label: 'Tất cả vị trí' },
              { value: 'hero', label: 'Hero Slider (Đầu trang)' },
              { value: 'showcase', label: 'Showcase (Nổi bật)' },
              { value: 'trustbar', label: 'Trustbar (Cam kết)' },
            ]}
          />
        </div>
      </UBreadcrumb>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex-1 min-h-0 flex flex-col justify-between">
        <Table
          dataSource={filteredBanners}
          rowKey={(r) => r.s_ID || r._id}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 8, showTotal: (t) => `Tổng số ${t} banner` }}
          size="middle"
          scroll={{ y: 'calc(100vh - 290px)' }}
        />
      </div>

      {/* Modal Thêm Mới / Chỉnh Sửa Banner */}
      <Modal
        title={
          <span className="font-bold text-base text-gray-900">
            {editingBanner ? 'Chỉnh Sửa Ảnh Banner' : 'Tải Banner Lên'}
          </span>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        confirmLoading={isCreating || isUpdating}
        okText={editingBanner ? 'Lưu thay đổi' : 'Tải lên ngay'}
        cancelText="Hủy"
        width={520}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Form.Item name="type" label={<span className="font-semibold text-gray-700">Vị trí hiển thị</span>}>
              <Select
                className="w-full !h-9"
                options={[
                  { value: 'hero', label: 'Hero Slider (Đầu trang)' },
                  { value: 'showcase', label: 'Showcase (Bộ Sưu Tập Nổi Bật)' },
                  { value: 'trustbar', label: 'Trustbar (Cam kết)' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="is_active"
              label={<span className="font-semibold text-gray-700">Trạng thái</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Hiển thị" unCheckedChildren="Tạm ẩn" />
            </Form.Item>
          </div>

          <Form.Item
            name="title"
            label={<span className="font-semibold text-gray-700">Tiêu đề (Title)</span>}
            help="Hiển thị nổi bật trên banner hoặc khối Showcase Bộ Sưu Tập"
          >
            <Input placeholder="Ví dụ: Không Gian Sang Trọng Cho Căn Hộ Đương Đại" className="!rounded-lg !py-1.5" />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label={<span className="font-semibold text-gray-700">Đoạn mô tả / Phụ đề (Description)</span>}
          >
            <Input.TextArea rows={3} placeholder="Ví dụ: Khám phá giải pháp kiến tạo không gian sống với những bộ sưu tập nội thất thông minh..." className="!rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="badge_text"
              label={<span className="font-semibold text-gray-700">Nhãn Badge (Huy hiệu)</span>}
            >
              <Input placeholder="Ví dụ: BỘ SƯU TẬP 2026" className="!rounded-lg !py-1.5" />
            </Form.Item>

            <Form.Item
              name="link_url"
              label={<span className="font-semibold text-gray-700">Đường dẫn khi click (Link CTA)</span>}
            >
              <Input placeholder="Ví dụ: /products" className="!rounded-lg !py-1.5" />
            </Form.Item>
          </div>

          <Form.Item
            name="highlights"
            label={<span className="font-semibold text-gray-700">Các điểm nổi bật / Đánh dấu (Mỗi dòng 1 điểm - Cho Showcase)</span>}
            help="Ví dụ: Gỗ tự nhiên nguyên khối [xuống dòng] Động cơ tự động nhập khẩu"
          >
            <Input.TextArea rows={3} placeholder="Gỗ tự nhiên nguyên khối&#10;Động cơ tự động nhập khẩu&#10;Giao lắp tận nhà 24/7&#10;Bảo hành chính hãng 5 năm" className="!rounded-lg" />
          </Form.Item>

          <Form.Item
            name="image_url"
            label={<span className="font-semibold text-gray-700">Tải tệp ảnh hoặc dán link ảnh</span>}
            rules={[{ required: true, message: 'Vui lòng chọn hoặc tải ảnh banner lên' }]}
          >
            <UImageUpload aspectRatio="banner" placeholderText="Bấm để chọn ảnh từ máy hoặc dán URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBannersPage;
