import React, { useState } from 'react';
import { productService } from '~/services/productService';
import { Product, CategoryId } from '~/types';
import { formatVND } from '~/common/utils/formatters';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Modal, Form, Select, InputNumber, Switch, Tag, message } from 'antd';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => productService.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm();

  const categories = productService.getCategories();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({
      inStock: true,
      stockQuantity: 10,
      discountPercent: 0,
      origin: 'Việt Nam',
      warranty: '36 tháng',
      colorOptions: ['Gỗ Tự Nhiên', 'Nâu Óc Chó'],
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: 'Bạn có chắc chắn muốn xóa mẫu nội thất này khỏi hệ thống?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        productService.deleteProduct(id);
        setProducts(productService.getProducts());
        message.success('Đã xóa sản phẩm!');
      },
    });
  };

  const handleFormSubmit = (values: any) => {
    const category = categories.find((c) => c.id === values.categoryId);
    const categoryName = category ? category.name : 'Nội Thất';

    if (editingProduct) {
      productService.updateProduct(editingProduct.id, {
        ...values,
        categoryName,
      });
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      productService.addProduct({
        ...values,
        categoryName,
        rating: 5.0,
        reviewCount: 1,
        slug: values.name.toLowerCase().replace(/\s+/g, '-'),
        dimensions: values.dimensions || 'D200 x R90 x C75 cm',
        material: values.material || 'Gỗ Sồi Tự Nhiên',
        specifications: { 'Chất liệu': values.material || 'Gỗ Sồi' },
      });
      message.success('Thêm sản phẩm mới thành công!');
    }

    setProducts(productService.getProducts());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-stone-900">Danh Sách Sản Phẩm Nội Thất</h2>
          <p className="text-xs text-stone-500">Quản lý kho hàng, thông tin giá cả & hình ảnh sản phẩm</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Tìm theo tên mẫu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<Search size={14} className="text-stone-400" />}
            className="!rounded-lg text-xs"
          />

          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={handleOpenAddModal}
            className="!bg-amber-900 font-bold text-xs !rounded-lg shrink-0"
          >
            Thêm Sản Phẩm Mới
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="p-3.5 font-bold">Hình Ảnh</th>
                <th className="p-3.5 font-bold">Tên Sản Phẩm</th>
                <th className="p-3.5 font-bold">Danh Mục</th>
                <th className="p-3.5 font-bold">Giá Bán (VND)</th>
                <th className="p-3.5 font-bold">Tồn Kho</th>
                <th className="p-3.5 font-bold">Trạng Thái</th>
                <th className="p-3.5 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50/80">
                  <td className="p-3.5">
                    <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-stone-900">{product.name}</p>
                    <p className="text-stone-400 text-[10px]">{product.material}</p>
                  </td>
                  <td className="p-3.5">
                    <Tag color="amber" className="text-[10px] font-bold">{product.categoryName}</Tag>
                  </td>
                  <td className="p-3.5 font-bold text-amber-950">
                    {formatVND(product.price)}
                    {product.discountPercent && (
                      <span className="block text-[10px] text-rose-600">-{product.discountPercent}%</span>
                    )}
                  </td>
                  <td className="p-3.5 font-bold">{product.stockQuantity} món</td>
                  <td className="p-3.5">
                    {product.inStock ? (
                      <Tag color="green" className="text-[10px] font-bold">Còn Hàng</Tag>
                    ) : (
                      <Tag color="red" className="text-[10px] font-bold">Hết Hàng</Tag>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-600"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Chỉnh Sửa Sản Phẩm Nội Thất' : 'Thêm Sản Phẩm Nội Thất Mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu Thông Tin"
        cancelText="Hủy"
        width={700}
        okButtonProps={{ className: '!bg-amber-900 font-bold' }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="py-2">
          <Form.Item
            name="name"
            label={<span className="text-xs font-bold text-stone-700">Tên Sản Phẩm Nội Thất</span>}
            rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
          >
            <Input placeholder="Ví dụ: Sofa Da Bò Ý Milano..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="categoryId"
              label={<span className="text-xs font-bold text-stone-700">Danh Mục</span>}
              rules={[{ required: true, message: 'Chọn danh mục' }]}
            >
              <Select options={categories.map((c) => ({ value: c.id, label: c.name }))} />
            </Form.Item>

            <Form.Item
              name="price"
              label={<span className="text-xs font-bold text-stone-700">Giá Bán Niêm Yết (VND)</span>}
              rules={[{ required: true, message: 'Nhập giá bán' }]}
            >
              <InputNumber className="w-full" formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="discountPercent"
              label={<span className="text-xs font-bold text-stone-700">Giảm giá (%)</span>}
            >
              <InputNumber min={0} max={90} className="w-full" />
            </Form.Item>

            <Form.Item
              name="stockQuantity"
              label={<span className="text-xs font-bold text-stone-700">Số lượng tồn kho</span>}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="inStock"
              label={<span className="text-xs font-bold text-stone-700">Còn hàng</span>}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>

          <Form.Item
            name="material"
            label={<span className="text-xs font-bold text-stone-700">Chất liệu chế tác chính</span>}
          >
            <Input placeholder="Gỗ Sồi Tự Nhiên / Da Bò Ý..." />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-xs font-bold text-stone-700">Mô tả sản phẩm</span>}
          >
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết kiểu dáng, trải nghiệm sử dụng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
