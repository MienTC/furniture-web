import React from 'react';
import { Button } from 'antd';
import { IconRotateClockwise } from '@tabler/icons-react';

interface FilterResetButtonProps {
  onReset: () => void;
  visible?: boolean;
}

export const FilterResetButton: React.FC<FilterResetButtonProps> = ({
  onReset,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <Button
      type="dashed"
      icon={<IconRotateClockwise size={14} />}
      onClick={onReset}
      className="!text-xs text-gray-500 !h-9 cursor-pointer"
    >
      Đặt lại bộ lọc
    </Button>
  );
};

export default FilterResetButton;
