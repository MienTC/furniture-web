import React from 'react';
import { Avatar, Checkbox } from 'antd';
import clsx from 'clsx';
import { isInvalid } from '~/lib';
import UBadge from '../ui/ubadge';

export type FieldCellProps = {
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'tag'
    | 'object'
    | 'checkbox'
    | 'custom';
  label?: string;
  value: any;
  className?: string;
  isAvatar?: boolean;
  tagColor?: 'green' | 'orange' | 'red' | 'indigo' | 'blue' | 'gray';
};

export const FieldCell: React.FC<FieldCellProps> = ({
  type = 'text',
  label = 'Label',
  value,
  className,
  isAvatar,
  tagColor = 'gray',
}) => {
  const renderValue = () => {
    if (isInvalid(value) && type !== 'checkbox') {
      return <p className="text-slate-400 m-0">-</p>;
    }

    switch (type) {
      case 'text':
        return <p className="text-slate-900 font-medium m-0">{value}</p>;

      case 'number':
        return (
          <p className="text-slate-900 font-medium m-0">
            {Number(value).toLocaleString()}
          </p>
        );

      case 'date':
        try {
          const d = new Date(value);
          const dateStr = d.toLocaleDateString('vi-VN');
          return <p className="text-slate-900 font-medium m-0">{dateStr}</p>;
        } catch {
          return <p className="text-slate-400 m-0">-</p>;
        }

      case 'datetime':
        try {
          const d = new Date(value);
          const dtStr = `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${d.toLocaleDateString('vi-VN')}`;
          return <p className="text-slate-900 font-medium m-0">{dtStr}</p>;
        } catch {
          return <p className="text-slate-400 m-0">-</p>;
        }

      case 'custom':
        return <div>{value}</div>;

      case 'tag':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.length > 0 ? (
                value.map((v: string, i: number) => (
                  <UBadge key={i} color={tagColor}>
                    {v}
                  </UBadge>
                ))
              ) : (
                <p className="text-slate-400 m-0">-</p>
              )}
            </div>
          );
        }
        return <UBadge color={tagColor}>{value}</UBadge>;

      case 'checkbox':
        return <Checkbox checked={Boolean(value)} />;

      case 'object':
        if (typeof value === 'object' && value !== null) {
          return (
            <div className="flex items-center gap-2">
              {isAvatar && (
                <div className="flex-none w-6 h-6">
                  <Avatar src={value?.thumbnail} size="small">
                    {value?.label?.[0] || 'U'}
                  </Avatar>
                </div>
              )}
              <p className="text-slate-900 font-medium m-0">{value.label || '-'}</p>
            </div>
          );
        }
        return <p className="text-slate-400 m-0">-</p>;

      default:
        return <p className="text-slate-900 font-medium m-0">{String(value)}</p>;
    }
  };

  return (
    <div className={clsx('flex flex-col text-sm space-y-1', className)}>
      <p className="text-xs text-slate-500 font-medium m-0">{label}</p>
      <div className="min-h-7 flex flex-col justify-around">
        {renderValue()}
      </div>
    </div>
  );
};

export default FieldCell;
