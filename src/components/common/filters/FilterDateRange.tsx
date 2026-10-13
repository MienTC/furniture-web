import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

interface FilterDateRangeProps {
  value: [string, string] | null;
  onChange: (range: [string, string] | null) => void;
  placeholder?: [string, string];
  format?: string;
  width?: string | number;
  className?: string;
}

export const FilterDateRange: React.FC<FilterDateRangeProps> = ({
  value,
  onChange,
  placeholder = ['Từ ngày', 'Đến ngày'],
  format = 'DD/MM/YYYY',
  width = 250,
  className = '',
}) => {
  return (
    <div style={{ width }} className={`min-w-[220px] ${className}`}>
      <RangePicker
        placeholder={placeholder}
        format={format}
        className="!h-9 !w-full"
        style={{ width: '100%' }}
        onChange={(_, dateStrings) => {
          if (dateStrings[0] && dateStrings[1]) {
            onChange([dateStrings[0], dateStrings[1]]);
          } else {
            onChange(null);
          }
        }}
      />
    </div>
  );
};

export default FilterDateRange;
