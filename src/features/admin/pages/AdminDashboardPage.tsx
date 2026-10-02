import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useCategories } from '~/features/products/hooks/useCategory';
import { useProducts } from '~/features/products/hooks/useProduct';
import { orderService } from '~/services/orderService';
import { formatVND } from '~/common/utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const { categories } = useCategories();
  const { products, totalCount } = useProducts({ limit: 5 });
  const orders = orderService.getOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalProducts = totalCount || 668;

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!rounded-2xl border-stone-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs text-stone-500 font-semibold uppercase">Tổng Doanh Thu</span>}
              value={formatVND(totalRevenue)}
              prefix={<DollarSign size={20} className="text-amber-700 mr-1" />}
              valueStyle={{ color: '#78350f', fontWeight: 'bold', fontSize: '1.25rem' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!rounded-2xl border-stone-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs text-stone-500 font-semibold uppercase">Tổng Đơn Hàng</span>}
              value={orders.length}
              prefix={<ShoppingBag size={20} className="text-amber-700 mr-1" />}
              valueStyle={{ color: '#1c1917', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!rounded-2xl border-stone-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs text-stone-500 font-semibold uppercase">Tổng Sản Phẩm</span>}
              value={totalProducts}
              prefix={<Package size={20} className="text-amber-700 mr-1" />}
              valueStyle={{ color: '#1c1917', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!rounded-2xl border-stone-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs text-stone-500 font-semibold uppercase">Danh Mục</span>}
              value={categories.length}
              prefix={<TrendingUp size={20} className="text-amber-700 mr-1" />}
              valueStyle={{ color: '#1c1917', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sản Phẩm Mới Cập Nhật" className="!rounded-2xl border-stone-200 shadow-2xs">
        <Table
          dataSource={products}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Hình ảnh',
              dataIndex: 'images',
              render: (images: string[]) => (
                <img
                  src={images?.[0]}
                  alt=""
                  className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                />
              ),
            },
            {
              title: 'Tên sản phẩm',
              dataIndex: 'name',
              render: (name: string) => <span className="font-semibold text-stone-900">{name}</span>,
            },
            {
              title: 'Danh mục',
              dataIndex: 'categoryName',
              render: (cat: string) => <Tag color="gold">{cat}</Tag>,
            },
            {
              title: 'Giá bán',
              dataIndex: 'price',
              render: (price: number) => <span className="font-bold text-amber-900">{formatVND(price)}</span>,
            },
            {
              title: 'Trạng thái',
              dataIndex: 'inStock',
              render: (inStock: boolean) => (
                <Tag color={inStock ? 'success' : 'error'}>
                  {inStock ? 'Còn hàng' : 'Hết hàng'}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
