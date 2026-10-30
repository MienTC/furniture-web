import React from 'react';
import { Spin, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import UBreadcrumb from '~/components/ui/ubreadcrumb';
import { useAdminFlashSale } from '~/features/admin/hooks';
import { FlashSaleConfigForm } from '~/features/admin/components/flashsale';
import type { FlashSaleConfig } from '~/types';

export const AdminFlashSalePage: React.FC = () => {
  const { flashSaleData, isLoading: isFetching, isUpdating, updateConfig } = useAdminFlashSale();

  const handleSave = async (payload: FlashSaleConfig) => {
    try {
      await updateConfig(payload);
    } catch {
      // Toast error is handled inside the hook
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
    <div className="flex flex-col gap-4 font-sans w-full min-h-full pb-10">
      <UBreadcrumb
        title="Quản Lý Module Flash Sale Trang Chủ"
        trailing={
          <Button
            type="primary"
            htmlType="submit"
            form="admin-flash-sale-form"
            icon={<SaveOutlined />}
            loading={isUpdating}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !h-9 !px-6 !rounded-lg cursor-pointer shadow-xs"
          >
            Lưu Cấu Hình
          </Button>
        }
      />

      <FlashSaleConfigForm
        id="admin-flash-sale-form"
        initialConfig={flashSaleData?.config}
        initialProducts={flashSaleData?.products}
        isSubmitting={isUpdating}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default AdminFlashSalePage;
