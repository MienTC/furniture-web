import React from 'react';
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
  const displayData =
    data.length > 0
      ? data
      : [
          { name: 'Sofa & Ghế', count: 28 },
          { name: 'Bàn Ăn', count: 22 },
          { name: 'Giường Ngủ', count: 19 },
          { name: 'Tủ Quần Áo', count: 15 },
          { name: 'Kệ Tivi', count: 12 },
          { name: 'Đèn Trang Trí', count: 9 },
        ];

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
