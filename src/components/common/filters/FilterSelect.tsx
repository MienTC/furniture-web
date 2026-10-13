import React from 'react';
import { Select } from 'antd';
import type { IFilterOption } from '~/types';

interface FilterSelectProps {
  value: any;
  onChange: (value: any) => void;
  options: IFilterOption[];
  placeholder?: string;
  allowClear?: boolean;
  className?: string;
  width?: string | number;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Lọc theo...',
  allowClear = true,
  className = '',
  width = 160,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      allowClear={allowClear}
      className={`!h-9 ${className}`}
      style={{ width }}
    />
  );
};

export default FilterSelect;
