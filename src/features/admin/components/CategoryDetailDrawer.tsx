import React, { useState } from 'react';
import {
  Drawer,
  Table,
  Button,
  Space,
  Empty,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAdminProducts } from '~/features/admin/hooks';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import { formatVND } from '~/common/utils/formatters';
import UBadge from '~/components/ui/ubadge';
import ProductFormModal from './ProductFormModal';
import SelectProductsModal from './SelectProductsModal';
import type { AdminProductDto } from '~/types/admin.type';

interface CategoryDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  category: any;
  categories: Array<{ id: string; name: string }>;
}

export const CategoryDetailDrawer: React.FC<CategoryDetailDrawerProps> = ({
  open,
  onClose,
  category,
  categories,
}) => {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const categoryId = category?.s_ID || category?.id;

  // Lấy danh sách sản phẩm thuộc danh mục này
  const {
    products,
    total,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isSubmitting,
  } = useAdminProducts({
    categoryId,
    limit: 100,
  });

  const removeBatchMutation = useMutation({
    mutationFn: (ids: string[]) => adminService.removeProductsFromCategory(categoryId, ids),
    onSuccess: (res) => {
      message.success(res || `Đã gỡ ${selectedRowKeys.length} sản phẩm khỏi danh mục`);
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.products] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.categories] });
      setSelectedRowKeys([]);
    },
    onError: (err: any) => {
      message.error(err.message || 'Lỗi khi gỡ sản phẩm khỏi danh mục');
    },
  });

  const handleOpenEditProduct = (prod: any) => {
    setSelectedProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleOpenCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (data: AdminProductDto) => {
    if (selectedProduct) {
      await updateProduct({ id: selectedProduct.id, payload: data });
    } else {
      await createProduct({ ...data, categoryId });
    }
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRemoveSingle = (productId: string) => {
    removeBatchMutation.mutate([productId]);
  };

  const handleRemoveMultiple = () => {
    if (selectedRowKeys.length === 0) return;
    removeBatchMutation.mutate(selectedRowKeys as string[]);
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 55,
      render: (imgs: string[]) => (
        <img
          src={imgs?.[0] || 'https://via.placeholder.com/80'}
          alt=""
          className="size-9 rounded-lg object-cover border border-gray-200"
        />
      ),
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      render: (name: string, row: any) => (
        <div>
          <button
            type="button"
            onClick={() => handleOpenEditProduct(row)}
            className="text-left font-semibold text-xs text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
          >
            {name}
          </button>
          <p className="text-[10px] text-gray-400 font-mono m-0">{row.s_ID}</p>
        </div>
      ),
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      width: 110,
      render: (price: number) => (
        <span className="font-bold text-sky-600 text-xs">{formatVND(price)}</span>
      ),
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'stockQuantity',
      width: 80,
      render: (qty: number) => (
        <span className="font-medium text-gray-700 text-xs">{qty} cái</span>
      ),
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'inStock',
      width: 95,
      render: (inStock: boolean) => (
        <UBadge color={inStock ? 'green' : 'red'}>
          {inStock ? 'Còn hàng' : 'Hết hàng'}
        </UBadge>
      ),
    },
    {
      title: 'Thao Tác',
      width: 85,
      render: (_: any, record: any) => (
        <Space size={2}>
          <Button
            size="small"
            type="text"
            icon={<EditOutlined style={{ fontSize: 15, color: '#64748b' }} />}
            onClick={() => handleOpenEditProduct(record)}
            title="Chỉnh sửa sản phẩm"
          />
          <Popconfirm
            title="Gỡ sản phẩm này khỏi danh mục?"
            okText="Gỡ"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleRemoveSingle(record.id || record.s_ID)}
          >
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined style={{ fontSize: 15 }} />}
              title="Gỡ khỏi danh mục"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={
          category && (
            <div className="flex items-center justify-between w-full pr-4 font-sans">
              <div className="flex items-center gap-3">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt=""
                    className="size-10 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                    DM
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-gray-900 m-0">
                    {category.s_Name || category.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono m-0">/{category.slug}</p>
                </div>
              </div>
              <Tag color="blue" className="text-xs font-semibold px-2 py-0.5">
                {total} sản phẩm
              </Tag>
            </div>
          )
        }
        open={open}
        onClose={onClose}
        width={860}
        destroyOnClose
        extra={
          <Space>
            <Button
              type="primary"
              icon={<AppstoreAddOutlined />}
              onClick={() => setIsSelectModalOpen(true)}
              className="!bg-sky-500 hover:!bg-sky-400 !font-semibold"
            >
              Chọn sản phẩm có sẵn
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={handleOpenCreateProduct}
            >
              Tạo mới
            </Button>
          </Space>
        }
      >
        <div className="space-y-4 font-sans">
          {category?.description && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
              <span className="font-semibold text-gray-700">Mô tả danh mục: </span>
              {category.description}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">
                  Danh sách sản phẩm trong danh mục ({total})
                </span>
                {selectedRowKeys.length > 0 && (
                  <Tag color="orange" className="font-semibold text-xs m-0">
                    Đã chọn {selectedRowKeys.length} sản phẩm
                  </Tag>
                )}
              </div>

              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`Xác nhận gỡ ${selectedRowKeys.length} sản phẩm đã chọn khỏi danh mục?`}
                  okText="Xóa tất cả đã chọn"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={handleRemoveMultiple}
                >
                  <Button
                    size="small"
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    loading={removeBatchMutation.isPending}
                  >
                    Gỡ {selectedRowKeys.length} sản phẩm đã chọn
                  </Button>
                </Popconfirm>
              )}
            </div>

            <Table
              dataSource={products}
              rowKey={(r) => r.id || r.s_ID}
              columns={columns}
              loading={isLoading}
              pagination={{ pageSize: 10, showTotal: (t) => `Tổng cộng ${t} sản phẩm` }}
              size="small"
              scroll={{ y: 'calc(100vh - 280px)' }}
              className="border border-gray-100 rounded-xl overflow-hidden"
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="Chưa có sản phẩm nào trong danh mục này."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Space>
                      <Button
                        type="primary"
                        icon={<AppstoreAddOutlined />}
                        size="small"
                        onClick={() => setIsSelectModalOpen(true)}
                        className="!bg-sky-500"
                      >
                        Chọn sản phẩm có sẵn
                      </Button>
                      <Button
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={handleOpenCreateProduct}
                      >
                        Tạo sản phẩm mới
                      </Button>
                    </Space>
                  </Empty>
                ),
              }}
            />
          </div>
        </div>
      </Drawer>

      {/* Modal chọn các sản phẩm đang có sẵn */}
      <SelectProductsModal
        open={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        categoryId={categoryId}
        categoryName={category?.s_Name || category?.name || ''}
      />

      {/* Modal Chỉnh Sửa / Tạo Mới Sản Phẩm */}
      <ProductFormModal
        open={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleProductSubmit}
        initialData={
          selectedProduct
            ? selectedProduct
            : { categoryId }
        }
        categories={categories}
        loading={isSubmitting}
      />
    </>
  );
};

export default CategoryDetailDrawer;
