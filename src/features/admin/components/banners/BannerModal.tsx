import React, { useEffect } from 'react';
import { Modal, Flex, Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { IconPhotoPlus, IconEdit } from '@tabler/icons-react';
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
      sort_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const rawType = initialData.type || 'hero';
        const normalizedType = rawType === 'trust_bar' ? 'trustbar' : rawType;

        formMethods.reset({
          title: initialData.title || '',
          subtitle: initialData.subtitle || '',
          badge_text: initialData.badge_text || '',
          highlights: Array.isArray(initialData.highlights)
            ? initialData.highlights.join('\n')
            : (initialData.highlights || ''),
          link_url: initialData.link_url || '',
          image_url: initialData.image_url || '',
          type: normalizedType as any,
          sort_order: initialData.sort_order !== undefined ? initialData.sort_order : 0,
          is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        });
      } else {
        const rawDefault = defaultType !== 'all' ? defaultType : 'hero';
        const normalizedDefault = rawDefault === 'trust_bar' ? 'trustbar' : rawDefault;

        formMethods.reset({
          title: '',
          subtitle: '',
          badge_text: '',
          highlights: '',
          link_url: '',
          image_url: '',
          type: normalizedDefault as any,
          sort_order: 0,
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
      sort_order: Number(values.sort_order) || 0,
      is_active: values.is_active,
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 font-sans">
          <div className="size-8 rounded-lg bg-[#EDF5F2] text-[#2B5A50] flex items-center justify-center">
            {initialData ? <IconEdit size={18} /> : <IconPhotoPlus size={18} />}
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 m-0">
              {initialData ? 'Chỉnh Sửa Banner' : 'Tạo Banner Mới'}
            </h3>
            <p className="text-xs text-stone-400 font-normal m-0">
              {initialData ? 'Cập nhật nội dung, thứ tự hoặc hình ảnh' : 'Thêm banner trình chiếu mới vào hệ thống'}
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={handleClose}
      centered
      destroyOnHidden
      width={760}
      footer={
        <Flex justify="end" gap={10} className="pt-3 border-t border-stone-100 font-sans">
          <Button onClick={handleClose} disabled={loading} className="!rounded-lg !px-4">
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            form="admin-banner-modal-form"
            loading={loading}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-bold !rounded-lg !px-5 !shadow-xs"
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
          className="max-h-[72vh] overflow-y-auto px-1 pr-2 custom-scrollbar"
        >
          <BannerForm />
        </form>
      </FormProvider>
    </Modal>
  );
};

export default BannerModal;
