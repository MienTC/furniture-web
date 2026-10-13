import React, { useEffect, useState } from 'react';
import { Card, Switch, Input, Select, Button, message, Spin } from 'antd';
import { ThunderboltOutlined, SaveOutlined } from '@ant-design/icons';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import { useFlashSale, useUpdateFlashSaleConfig } from '~/features/home/hooks/useFlashSale';
import { useAdminProducts } from '~/features/admin/hooks';

export const AdminFlashSalePage: React.FC = () => {
  const { data: flashSale, isLoading: isFetching } = useFlashSale();
  const { mutateAsync: updateConfig, isPending: isUpdating } = useUpdateFlashSaleConfig();
  const { products, isLoading: isLoadingProducts } = useAdminProducts({ limit: 50 });

  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState('Flash Sale Hôm Nay');
  const [discountBadge, setDiscountBadge] = useState('Giảm tới 45%');
  const [description, setDescription] = useState('Số lượng có hạn trong khung giờ vàng nội thất');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (flashSale?.config) {
      setIsActive(Boolean(flashSale.config.is_active));
      setTitle(flashSale.config.title || 'Flash Sale Hôm Nay');
      setDiscountBadge(flashSale.config.discount_badge || 'Giảm tới 45%');
      setDescription(flashSale.config.description || 'Số lượng có hạn trong khung giờ vàng nội thất');
      setSelectedProductIds(flashSale.config.product_ids || []);
    }
  }, [flashSale]);

  const handleSave = async () => {
    try {
      await updateConfig({
        is_active: isActive,
        title,
        discount_badge: discountBadge,
        description,
        product_ids: selectedProductIds,
      });
      message.success('Đã lưu cấu hình Flash Sale thành công!');
    } catch (e: any) {
      message.error(e.message || 'Lỗi lưu cấu hình Flash Sale');
    }
  };

  if (isFetching) {
    return (
      <div className="p-8 text-center">
        <Spin tip="Đang tải dữ liệu cấu hình..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 font-sans max-w-4xl">
      <UBreadcrumb
        title="Quản Lý Module Flash Sale"
        trailing={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isUpdating}
            onClick={handleSave}
            className="!bg-[#DE7272] hover:!bg-[#c95f5f] font-semibold"
          >
            Lưu Cấu Hình
          </Button>
        }
      />

      <Card
        title={
          <div className="flex items-center gap-2 text-[#DE7272] font-bold">
            <ThunderboltOutlined style={{ fontSize: 18 }} />
            <span>Thiết Lập Chương Trình Flash Sale Trang Chủ</span>
          </div>
        }
        className="rounded-2xl border-stone-200 shadow-xs"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <p className="font-bold text-stone-800 text-sm m-0">Hiển thị Flash Sale ngoài trang chủ</p>
              <p className="text-xs text-stone-500 m-0">
                Nếu TẮT, khối Flash Sale trên trang chủ sẽ tự động ẩn hoàn toàn
              </p>
            </div>
            <Switch
              checked={isActive}
              onChange={setIsActive}
              checkedChildren="ĐANG BẬT"
              unCheckedChildren="ĐÃ TẮT"
              className={isActive ? '!bg-[#DE7272]' : ''}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Tiêu đề Flash Sale</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Flash Sale Hôm Nay"
                className="!rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Badge ưu đãi</label>
              <Input
                value={discountBadge}
                onChange={(e) => setDiscountBadge(e.target.value)}
                placeholder="VD: Giảm tới 45%"
                className="!rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Mô tả phụ</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Số lượng có hạn trong khung giờ vàng nội thất"
              className="!rounded-lg"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Chọn danh sách sản phẩm tham gia Flash Sale ({selectedProductIds.length} sản phẩm)
            </label>
            <Select
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Chọn các sản phẩm hiển thị trong khung Flash Sale..."
              value={selectedProductIds}
              onChange={setSelectedProductIds}
              loading={isLoadingProducts}
              options={products.map((p: any) => ({
                value: p.s_ID || p.id,
                label: `${p.name} - ${p.price?.toLocaleString('vi-VN')}₫ (Giảm: ${p.discountPercent || 0}%)`,
              }))}
            />
            <p className="text-[11px] text-stone-400 mt-1 mb-0">
              Chỉ những sản phẩm được Admin chọn ở đây mới hiển thị trong Flash Sale.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminFlashSalePage;
