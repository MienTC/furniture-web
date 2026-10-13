import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatVND } from '~/common/utils/formatters';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-xl border border-neutral-800 text-xs font-sans">
        <p className="font-semibold text-neutral-300 mb-1">Ngày {label}</p>
        <p className="text-sky-400 font-bold">
          Doanh thu: {formatVND(data.revenue || 0)}
        </p>
        <p className="text-emerald-400 font-medium">
          Đơn hàng: {data.orders || 0} đơn
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  // Dữ liệu mẫu nếu chưa có giao dịch phát sinh
  const displayData =
    data && data.length > 0
      ? data
      : [
          { date: '01/10', revenue: 15400000, orders: 4 },
          { date: '02/10', revenue: 23200000, orders: 7 },
          { date: '03/10', revenue: 18900000, orders: 5 },
          { date: '04/10', revenue: 32500000, orders: 9 },
          { date: '05/10', revenue: 28400000, orders: 8 },
          { date: '06/10', revenue: 41200000, orders: 12 },
        ];

  return (
    <div className="h-[320px] w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={displayData}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(val) =>
              val >= 1000000 ? `${(val / 1000000).toFixed(0)}tr` : `${val}`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
