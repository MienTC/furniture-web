import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-wrap items-center gap-3 w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default FilterBar;
