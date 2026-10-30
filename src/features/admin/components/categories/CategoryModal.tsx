import React, { useEffect } from 'react';
import { Modal, Flex, Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { CategoryForm } from './CategoryForm';
import type { AdminCategoryPayload } from '~/types';

export interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AdminCategoryPayload) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const formMethods = useForm<AdminCategoryPayload>({
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        formMethods.reset({
          name: initialData.s_Name || initialData.name || '',
          description: initialData.description || '',
          image_url: initialData.image_url || '',
        });
      } else {
        formMethods.reset({
          name: '',
          description: '',
          image_url: '',
        });
      }
    }
  }, [open, initialData, formMethods]);

  const handleClose = () => {
    formMethods.reset();
    onClose();
  };

  const onInternalSubmit = async (values: AdminCategoryPayload) => {
    await onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || '',
      image_url: values.image_url || '',
    });
  };

  return (
    <Modal
      title={
        <div className="pb-2 border-b border-stone-100 font-sans font-bold text-stone-900 text-base">
          {initialData ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
        </div>
      }
      open={open}
      onCancel={handleClose}
      centered
      destroyOnClose
      width={560}
      footer={null}
    >
      <FormProvider {...formMethods}>
        <form id="admin-category-modal-form" onSubmit={formMethods.handleSubmit(onInternalSubmit)}>
          <CategoryForm />
          <Flex justify="end" gap={8} className="pt-3 border-t border-stone-100 mt-3">
            <Button onClick={handleClose} disabled={loading}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold"
            >
              {initialData ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Modal>
  );
};
