import { useState, useCallback } from 'react';
import type { ITableFilterState } from '~/types';

export const useTableFilters = (initialState: ITableFilterState = {}) => {
  const [filters, setFilters] = useState<ITableFilterState>({
    page: 1,
    limit: 10,
    search: '',
    ...initialState,
  });

  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: initialState.limit || 10,
      search: '',
      ...initialState,
    });
  }, [initialState]);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.categoryId ||
    filters.startDate ||
    filters.endDate ||
    filters.urgentOnly ||
    (filters.paymentStatus && filters.paymentStatus !== 'all')
  );

  return {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
  };
};

export default useTableFilters;
