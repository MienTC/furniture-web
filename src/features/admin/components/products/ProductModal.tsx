import React, { useEffect } from 'react';
import { Modal, Flex, Button, Tag } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductForm } from './ProductForm';
import type { AdminProductDto, ProductFormValues } from '~/types';

export interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AdminProductDto) => Promise<void>;
  initialData?: any;
  categories: Array<{ id: string; name: string }>;
  loading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
  loading = false,
}) => {
  const formMethods = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      categoryId: '',
      price: 0,
      originalPrice: 0,
      stockQuantity: 0,
      material: '',
      dimensions: '',
      origin: '',
      warranty: '',
      videoUrl: '',
      description: '',
      images: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        formMethods.reset({
          name: initialData.name || '',
          categoryId: initialData.categoryId || '',
          price: initialData.price || 0,
          originalPrice: initialData.originalPrice || 0,
          stockQuantity: initialData.stockQuantity || 0,
          material: initialData.material || '',
          dimensions: initialData.dimensions || '',
          origin: initialData.origin || '',
          warranty: initialData.warranty || '',
          videoUrl: initialData.videoUrl || initialData.video_url || '',
          description: initialData.description || '',
          images: initialData.images || [],
        });
      } else {
        formMethods.reset({
          name: '',
          categoryId: categories[0]?.id || '',
          price: 0,
          originalPrice: 0,
          stockQuantity: 0,
          material: '',
          dimensions: '',
          origin: '',
          warranty: '',
          videoUrl: '',
          description: '',
          images: [],
        });
      }
    }
  }, [open, initialData, categories, formMethods]);

  const handleClose = () => {
    formMethods.reset();
    onClose();
  };

  const onInternalSubmit = async (values: any) => {
    const payload: AdminProductDto = {
      name: values.name.trim(),
      categoryId: values.categoryId,
      price: Number(values.price || 0),
      originalPrice: Number(values.originalPrice || 0),
      stockQuantity: Number(values.stockQuantity || 0),
      material: values.material?.trim() || '',
      dimensions: values.dimensions?.trim() || '',
      origin: values.origin?.trim() || '',
      warranty: values.warranty?.trim() || '',
      images: values.images || [],
      videoUrl: values.videoUrl?.trim() || '',
      description: values.description || '',
    };
    await onSubmit(payload);
  };

  const formId = 'admin-product-modal-form';

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100 font-sans">
          <span className="text-base font-bold text-stone-900">
            {initialData ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Mới Sản Phẩm'}
          </span>
          {initialData?.s_ID && (
            <Tag color="blue" className="font-mono text-xs">
              {initialData.s_ID}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      width={900}
      centered
      destroyOnClose
      footer={
        <Flex justify="space-between" align="center" className="pt-2.5 border-t border-stone-100 font-sans">
          <span className="text-xs text-stone-400">
            * Vui lòng điền đủ tên, danh mục và giá bán hợp lệ
          </span>
          <Flex gap={8}>
            <Button onClick={() => formMethods.reset()} disabled={loading} size="middle">
              Đặt lại
            </Button>
            <Button onClick={handleClose} disabled={loading} size="middle">
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form={formId}
              loading={loading}
              className="!bg-brand-coral hover:!bg-[#1E433B] !font-bold cursor-pointer"
              size="middle"
            >
              {initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
            </Button>
          </Flex>
        </Flex>
      }
    >
      <FormProvider {...formMethods}>
        <form id={formId} onSubmit={formMethods.handleSubmit(onInternalSubmit)}>
          <div className="max-h-[68vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
            <ProductForm categories={categories} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
