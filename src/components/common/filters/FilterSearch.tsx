import React, { useState, useEffect } from 'react';
import USearchInput from '~/components/ui/usearch-input';

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  width?: string | number;
}

export const FilterSearch: React.FC<FilterSearchProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm từ khóa...',
  debounceMs = 300,
  className = '',
  width = 250,
}) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localVal !== value) {
        onChange(localVal);
      }
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [localVal, debounceMs, onChange, value]);

  return (
    <div style={{ width }} className={`min-w-[200px] ${className}`}>
      <USearchInput
        placeholder={placeholder}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
      />
    </div>
  );
};

export default FilterSearch;
