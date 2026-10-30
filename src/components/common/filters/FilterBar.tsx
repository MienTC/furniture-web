import React from 'react';

export interface FilterBarProps {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, trailing, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3 w-full font-sans ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
        {children}
      </div>
      {trailing && <div className="ml-auto shrink-0">{trailing}</div>}
    </div>
  );
};

export default FilterBar;
