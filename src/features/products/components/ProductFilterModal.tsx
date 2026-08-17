import React, { useEffect } from 'react';
import { Modal, Form, Slider, Checkbox, Radio, Button, Divider, Space } from 'antd';
import { ProductFilterParams, Category } from '~/types';
import { MATERIAL_OPTIONS } from '~/common/constants';
import { formatVND } from '~/common/utils/formatters';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface ProductFilterModalProps {
  open: boolean;
  onClose: () => void;
  filterParams: ProductFilterParams;
  onApply: (values: ProductFilterParams) => void;
  onReset: () => void;
  categories: Category[];
  totalProductsCount: number;
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  open,
  onClose,
  filterParams,
  onApply,
  onReset,
  categories,
  totalProductsCount,
}) => {
  const [form] = Form.useForm();

  // Populate form with current filter values when modal opens
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        categoryId: filterParams.categoryId || '',
        priceRange: [filterParams.minPrice || 0, filterParams.maxPrice || 60000000],
        materials: filterParams.materials || [],
        inStockOnly: filterParams.inStockOnly || false,
        onSaleOnly: filterParams.onSaleOnly || false,
      });
    }
  }, [open, filterParams, form]);

  const handleFinish = (values: any) => {
    const updated: ProductFilterParams = {
      ...filterParams,
      categoryId: values.categoryId || '',
      minPrice: values.priceRange ? values.priceRange[0] : 0,
      maxPrice: values.priceRange ? values.priceRange[1] : 60000000,
      materials: values.materials || [],
      inStockOnly: !!values.inStockOnly,
      onSaleOnly: !!values.onSaleOnly,
    };
    onApply(updated);
    onClose();
  };

  const handleFormReset = () => {
    form.setFieldsValue({
      categoryId: '',
      priceRange: [0, 60000000],
      materials: [],
      inStockOnly: false,
      onSaleOnly: false,
    });
    onReset();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-stone-900 pb-2 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold leading-tight">Bộ Lọc Sản Phẩm Nội Thất</h3>
            <p className="text-xs text-stone-500 font-normal">Tùy chỉnh tiêu chí tìm kiếm theo nhu cầu của bạn</p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      className="product-filter-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="py-3 space-y-5"
      >
        {/* Category Radio Group */}
        <Form.Item
          name="categoryId"
          label={<span className="font-bold text-xs text-stone-800 uppercase tracking-wider">Danh Mục Sản Phẩm</span>}
        >
          <Radio.Group className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Radio.Button
                value=""
                className="!h-auto !py-2 !px-3 text-center !rounded-xl !text-xs font-medium"
              >
                Tất Cả ({totalProductsCount})
              </Radio.Button>
              {categories.map((cat) => (
                <Radio.Button
                  key={cat.id}
                  value={cat.id}
                  className="!h-auto !py-2 !px-3 text-center !rounded-xl !text-xs font-medium truncate"
                >
                  {cat.name}
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>
        </Form.Item>

        <Divider className="!my-2" />

        {/* Price Slider */}
        <Form.Item
          name="priceRange"
          label={<span className="font-bold text-xs text-stone-800 uppercase tracking-wider">Khoảng Giá (VND)</span>}
        >
          <Slider
            range
            min={0}
            max={60000000}
            step={1000000}
            tooltip={{
              formatter: (val) => `${((val || 0) / 1000000).toFixed(0)} triệu`,
            }}
          />
        </Form.Item>

        <Divider className="!my-2" />

        {/* Materials */}
        <Form.Item
          name="materials"
          label={<span className="font-bold text-xs text-stone-800 uppercase tracking-wider">Chất Liệu Chế Tác</span>}
        >
          <Checkbox.Group className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MATERIAL_OPTIONS.map((mat) => (
                <Checkbox key={mat} value={mat} className="!text-xs text-stone-700">
                  {mat}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <Divider className="!my-2" />

        {/* Status Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Form.Item name="inStockOnly" valuePropName="checked" className="!mb-0">
            <Checkbox className="!text-xs text-stone-800 font-medium">
              Chỉ hiện sản phẩm còn hàng
            </Checkbox>
          </Form.Item>

          <Form.Item name="onSaleOnly" valuePropName="checked" className="!mb-0">
            <Checkbox className="!text-xs text-stone-800 font-medium">
              Chỉ hiện sản phẩm giảm giá
            </Checkbox>
          </Form.Item>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <Button
            onClick={handleFormReset}
            icon={<RotateCcw size={14} />}
            className="!rounded-xl text-xs font-semibold text-stone-600"
          >
            Đặt Lại
          </Button>

          <Space>
            <Button onClick={onClose} className="!rounded-xl text-xs">
              Đóng
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Check size={14} />}
              className="!bg-red-700 hover:!bg-red-800 !rounded-xl text-xs font-bold px-6 shadow-md"
            >
              Áp Dụng Bộ Lọc
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};
