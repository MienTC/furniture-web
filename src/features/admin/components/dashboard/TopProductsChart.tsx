import React from 'react';
import { Empty } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatVND } from '~/common/utils/formatters';

interface TopProductsChartProps {
  data?: Array<{ name: string; revenue: number; quantity?: number }>;
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({
  data = [],
}) => {
  if (!data || data.length === 0 || data.every((d) => d.revenue === 0)) {
    return (
      <div className="h-[260px] w-full flex flex-col items-center justify-center font-sans bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <Empty description="Chưa có dữ liệu bán hàng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  const formatShortVND = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)} tỷ`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)} tr`;
    return `${val.toLocaleString()} đ`;
  };

  return (
    <div className="h-[280px] w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 15, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatShortVND}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={145}
            tickFormatter={(val: string) => (val && val.length > 18 ? `${val.substring(0, 16)}...` : val || '')}
          />
          <Tooltip
            formatter={(value: any, _: any, item: any) => [
              `${formatVND(value)} (${item.payload.quantity || 0} sản phẩm)`,
              'Doanh số',
            ]}
            labelFormatter={(label: any) => (label ? `Sản phẩm: ${label}` : '')}
            contentStyle={{
              backgroundColor: '#171717',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="revenue" fill="#2B5A50" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
