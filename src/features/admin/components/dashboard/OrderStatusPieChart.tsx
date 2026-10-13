import React from 'react';
import { Empty } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OrderStatusPieChartProps {
  counts?: Record<string, number>;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  completed: { label: 'Hoàn thành', color: '#10b981' },
  shipping: { label: 'Đang giao hàng', color: '#0ea5e9' },
  processing: { label: 'Đang xử lý', color: '#f59e0b' },
  pending: { label: 'Chờ xác nhận', color: '#8b5cf6' },
  cancelled: { label: 'Đã hủy đơn', color: '#ef4444' },
};

export const OrderStatusPieChart: React.FC<OrderStatusPieChartProps> = ({
  counts = {},
}) => {
  const data = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    name: config.label,
    value: counts[key] || 0,
    color: config.color,
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-[220px] w-full flex flex-col items-center justify-center font-sans bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <Empty description="Chưa có đơn hàng nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  const displayData = data;
  const total = displayData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center font-sans">
      <div className="relative w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value} đơn hàng`, name]}
              contentStyle={{
                backgroundColor: '#171717',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900 leading-tight">{total}</span>
          <span className="text-[11px] font-medium text-gray-400">Tổng đơn</span>
        </div>
      </div>

      {/* Legend Badges */}
      <div className="grid grid-cols-2 gap-2 w-full mt-3 px-2">
        {displayData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}</span>
            <span className="font-bold text-gray-900 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusPieChart;
