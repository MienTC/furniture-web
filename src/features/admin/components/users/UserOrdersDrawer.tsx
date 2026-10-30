import React from 'react';
import { Drawer, Table } from 'antd';
import { useAdminUserOrders } from '~/features/admin/hooks';
import { formatVND } from '~/common/utils/formatters';
import UTag from '~/components/ui/utag';

export interface UserOrdersDrawerProps {
  user: any;
  onClose: () => void;
}

export const UserOrdersDrawer: React.FC<UserOrdersDrawerProps> = ({ user, onClose }) => {
  const userId = user?.s_ID || user?.id;
  const { data: userOrders = [], isLoading } = useAdminUserOrders(userId);

  return (
    <Drawer
      title={
        <div>
          <h4 className="text-sm font-bold text-gray-900 m-0">
            Lịch sử đơn hàng: {user?.s_user || user?.name}
          </h4>
          <p className="text-xs text-gray-400 m-0 mt-0.5">{user?.email}</p>
        </div>
      }
      open={Boolean(user)}
      onClose={onClose}
      width={680}
    >
      <Table
        dataSource={userOrders as any[]}
        rowKey={(r: any) => r.s_ID || r.s_order_id || r.id}
        loading={isLoading}
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Mã đơn',
            dataIndex: 's_order_id',
            render: (id: string) => <span className="font-mono text-xs font-semibold">{id}</span>,
          },
          {
            title: 'Ngày đặt',
            dataIndex: 'dt_created',
            render: (d: string) => (
              <span className="text-xs text-gray-500">
                {d ? new Date(d).toLocaleDateString('vi-VN') : <span className="text-slate-400">-</span>}
              </span>
            ),
          },
          {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            render: (a: number) => (
              <span className="font-bold text-brand-coral text-xs">{formatVND(a)}</span>
            ),
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (st: string) => <UTag color="sky">{st?.toUpperCase()}</UTag>,
          },
        ]}
      />
    </Drawer>
  );
};
