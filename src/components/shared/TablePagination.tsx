import { Pagination } from 'antd';
import React from 'react';

interface TablePaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  className?: string;
  itemUnit?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  className = '',
  itemUnit = 'bản ghi',
}) => {
  return (
    <div className={`flex justify-end mt-4 pt-4 border-t border-gray-100 ${className}`}>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        showTotal={(t) => `Tổng số ${t.toLocaleString()} ${itemUnit}`}
      />
    </div>
  );
};

export default TablePagination;
