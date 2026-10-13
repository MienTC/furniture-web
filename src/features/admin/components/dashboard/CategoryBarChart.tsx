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

interface CategoryBarChartProps {
  data?: Array<{ name: string; count: number }>;
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({
  data = [],
}) => {
  if (!data || data.length === 0 || data.every(d => d.count === 0)) {
    return (
      <div className="h-[260px] w-full flex flex-col items-center justify-center font-sans bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <Empty description="Chưa có dữ liệu danh mục" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  const displayData = data;

  return (
    <div className="h-[260px] w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={95}
          />
          <Tooltip
            formatter={(value: any) => [`${value} sản phẩm`, 'Số lượng']}
            contentStyle={{
              backgroundColor: '#171717',
              borderRadius: '12px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;
