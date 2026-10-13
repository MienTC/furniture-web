import React from 'react';
import { Alert, Button } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

interface OrderUrgentAlertProps {
  urgentCount: number;
  urgentOnly: boolean;
  onToggleUrgent: () => void;
}

export const OrderUrgentAlert: React.FC<OrderUrgentAlertProps> = ({
  urgentCount,
  urgentOnly,
  onToggleUrgent,
}) => {
  if (urgentCount <= 0) return null;

  return (
    <Alert
      type="error"
      showIcon
      className="!rounded-xl !border-rose-300 !bg-rose-50/80 shadow-2xs"
      message={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
              <AlertOutlined /> CÓ {urgentCount} ĐƠN HÀNG ĐÃ ĐẶT QUÁ 3 NGÀY CHƯA CHUYỂN GIAO HÀNG!
            </span>
            <p className="text-xs text-rose-700 m-0 mt-0.5">
              Các đơn hàng đang ở trạng thái <b>Chờ duyệt</b> hoặc <b>Đang xử lý</b> quá 3 ngày. Vui lòng đóng gói và cập nhật trạng thái bàn giao vận chuyển gấp.
            </p>
          </div>
          <Button
            size="small"
            type={urgentOnly ? 'primary' : 'default'}
            danger
            onClick={onToggleUrgent}
            className="!font-bold !text-xs !h-8 !px-4 !rounded-lg cursor-pointer shrink-0"
          >
            {urgentOnly ? 'Xem tất cả đơn hàng' : `Lọc ${urgentCount} đơn cần xử lý gấp`}
          </Button>
        </div>
      }
    />
  );
};

export default OrderUrgentAlert;
