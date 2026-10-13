export interface IFilterOption {
  value: string | number;
  label: string;
}

export interface ITableFilterState {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  urgentOnly?: boolean;
  [key: string]: any;
}
