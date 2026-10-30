import React, { useEffect } from 'react';
import { Modal, Flex, Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { BannerForm, type BannerFormValues } from './BannerForm';

export interface BannerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialData?: any;
  defaultType?: string;
  loading?: boolean;
}

export const BannerModal: React.FC<BannerModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  defaultType = 'hero',
  loading = false,
}) => {
  const formMethods = useForm<BannerFormValues>({
    defaultValues: {
      title: '',
      subtitle: '',
      badge_text: '',
      highlights: '',
      link_url: '',
      image_url: '',
      type: 'hero',
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        formMethods.reset({
          title: initialData.title || '',
          subtitle: initialData.subtitle || '',
          badge_text: initialData.badge_text || '',
          highlights: Array.isArray(initialData.highlights)
            ? initialData.highlights.join('\n')
            : (initialData.highlights || ''),
          link_url: initialData.link_url || '',
          image_url: initialData.image_url || '',
          type: initialData.type || 'hero',
          is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        });
      } else {
        formMethods.reset({
          title: '',
          subtitle: '',
          badge_text: '',
          highlights: '',
          link_url: '',
          image_url: '',
          type: (defaultType !== 'all' ? defaultType : 'hero') as any,
          is_active: true,
        });
      }
    }
  }, [open, initialData, defaultType, formMethods]);

  const handleClose = () => {
    formMethods.reset();
    onClose();
  };

  const onInternalSubmit = async (values: BannerFormValues) => {
    const rawHighlights = values.highlights;
    const highlightsArr = typeof rawHighlights === 'string'
      ? rawHighlights.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    await onSubmit({
      title: values.title.trim(),
      subtitle: values.subtitle?.trim() || '',
      badge_text: values.badge_text?.trim() || '',
      highlights: highlightsArr,
      link_url: values.link_url?.trim() || '',
      image_url: values.image_url || '',
      type: values.type,
      is_active: values.is_active,
    });
  };

  return (
    <Modal
      title={
        <div className="pb-2 border-b border-stone-100 font-sans font-bold text-stone-900 text-base">
          {initialData ? 'Chỉnh Sửa Banner' : 'Tạo Banner Mới'}
        </div>
      }
      open={open}
      onCancel={handleClose}
      centered
      destroyOnClose
      width={680}
      footer={
        <Flex justify="end" gap={8} className="pt-2 border-t border-stone-100">
          <Button onClick={handleClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            form="admin-banner-modal-form"
            loading={loading}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold"
          >
            {initialData ? 'Lưu thay đổi' : 'Tạo banner'}
          </Button>
        </Flex>
      }
    >
      <FormProvider {...formMethods}>
        <form
          id="admin-banner-modal-form"
          onSubmit={formMethods.handleSubmit(onInternalSubmit)}
          className="max-h-[68vh] overflow-y-auto px-1 pr-2 custom-scrollbar"
        >
          <BannerForm />
        </form>
      </FormProvider>
    </Modal>
  );
};
