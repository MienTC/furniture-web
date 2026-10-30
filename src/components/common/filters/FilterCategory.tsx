import React from 'react';
import { Select } from 'antd';
import { useCategories } from '~/features/products/hooks/useCategory';

interface FilterCategoryProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allLabel?: string;
}

export const FilterCategory: React.FC<FilterCategoryProps> = ({
  value,
  onChange,
  placeholder = 'Chọn danh mục',
  className = 'w-48',
  allLabel = 'Tất cả danh mục',
}) => {
  const { categories, isCategoriesLoading } = useCategories();

  const options = [
    { value: '', label: allLabel },
    ...categories.map((c) => ({
      value: c.id || c.s_ID || '',
      label: c.name,
    })),
  ];

  return (
    <Select
      value={value ?? ''}
      onChange={onChange}
      loading={isCategoriesLoading}
      options={options}
      placeholder={placeholder}
      className={`!rounded-lg ${className}`}
      popupMatchSelectWidth={false}
    />
  );
};
