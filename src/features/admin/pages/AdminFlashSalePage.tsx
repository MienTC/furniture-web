import React from 'react';
import { message, Spin } from 'antd';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import { useAdminFlashSale, useAdminProducts } from '~/features/admin/hooks';
import { FlashSaleConfigForm } from '~/features/admin/components/flashsale';
import type { FlashSaleConfig } from '~/types';

export const AdminFlashSalePage: React.FC = () => {
  const { flashSaleData, isLoading: isFetching, isUpdating, updateConfig } = useAdminFlashSale();
  const { products, isLoading: isLoadingProducts } = useAdminProducts({ limit: 50 });

  const handleSave = async (payload: FlashSaleConfig) => {
    try {
      await updateConfig(payload);
      message.success('Đã lưu cấu hình Flash Sale thành công!');
    } catch (e: any) {
      message.error(e.message || 'Lỗi lưu cấu hình Flash Sale');
    }
  };

  if (isFetching) {
    return (
      <div className="p-12 text-center">
        <Spin tip="Đang tải dữ liệu cấu hình Flash Sale..." size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 font-sans max-w-4xl">
      <UBreadcrumb
        title="Quản Lý Module Flash Sale"
        items={[
          { title: 'Quản trị' },
          { title: 'Flash Sale Hôm Nay' },
        ]}
      />

      <FlashSaleConfigForm
        initialConfig={flashSaleData?.config}
        products={products}
        isLoadingProducts={isLoadingProducts}
        isSubmitting={isUpdating}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default AdminFlashSalePage;
