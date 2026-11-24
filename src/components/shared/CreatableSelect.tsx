import React, { useState, useRef } from 'react';
import { Select, Input, Button, Divider, Space } from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export interface CreatableSelectOption {
  label: string;
  value: string;
}

export interface CreatableSelectProps {
  value?: string | string[];
  onChange?: (val: any) => void;
  options: CreatableSelectOption[];
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  allowClear?: boolean;
  className?: string;
  style?: React.CSSProperties;
  status?: '' | 'error' | 'warning';
  createPlaceholder?: string;
  createBtnText?: string;
  disabled?: boolean;
}

/**
 * CreatableSelect - Cho phép chọn từ danh sách có sẵn HOẶC tự tạo mới option ngay trong dropdown
 * Tham chiếu kiến trúc Clean Component từ E:\FW\Pet_Manager & chuẩn GEMINI.md
 */
export const CreatableSelect: React.FC<CreatableSelectProps> = ({
  value,
  onChange,
  options: initialOptions,
  placeholder = 'Chọn hoặc thêm tùy chọn mới...',
  mode,
  allowClear = true,
  className = '',
  style,
  status,
  createPlaceholder = 'Nhập tùy chọn mới...',
  createBtnText = 'Thêm mới',
  disabled = false,
}) => {
  const [items, setItems] = useState<CreatableSelectOption[]>(initialOptions);
  const [newOptionName, setNewOptionName] = useState('');
  const inputRef = useRef<InputRef>(null);

  // Đồng bộ items khi initialOptions thay đổi từ ngoài
  React.useEffect(() => {
    setItems((prev) => {
      const existingValues = new Set(prev.map((o) => o.value));
      const combined = [...prev];
      for (const opt of initialOptions) {
        if (!existingValues.has(opt.value)) {
          combined.push(opt);
          existingValues.add(opt.value);
        }
      }
      return combined;
    });
  }, [initialOptions]);

  const handleAddNewItem = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const trimmed = newOptionName.trim();
    if (!trimmed) return;

    // Kiểm tra xem đã tồn tại chưa
    const alreadyExists = items.some(
      (it) => it.value.toLowerCase() === trimmed.toLowerCase() || it.label.toLowerCase() === trimmed.toLowerCase()
    );

    if (!alreadyExists) {
      const newOpt: CreatableSelectOption = { label: trimmed, value: trimmed };
      setItems((prev) => [...prev, newOpt]);
    }

    // Tự động chọn item vừa tạo
    if (mode === 'multiple' || mode === 'tags') {
      const currentArr = Array.isArray(value) ? value : [];
      if (!currentArr.includes(trimmed)) {
        onChange?.([...currentArr, trimmed]);
      }
    } else {
      onChange?.(trimmed);
    }

    setNewOptionName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      options={items}
      mode={mode}
      placeholder={placeholder}
      allowClear={allowClear}
      className={`w-full ${className}`}
      style={style}
      status={status}
      disabled={disabled}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase()) ||
        (option?.value ?? '').toString().toLowerCase().includes(input.toLowerCase())
      }
      dropdownRender={(menu) => (
        <div className="font-sans">
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 6px', display: 'flex', width: '100%' }}>
            <Input
              ref={inputRef}
              placeholder={createPlaceholder}
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  handleAddNewItem(e);
                }
              }}
              className="!text-xs !rounded-md"
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNewItem}
              className="!bg-[#2B5A50] hover:!bg-[#20453D] !text-xs !font-semibold !rounded-md shrink-0 cursor-pointer"
            >
              {createBtnText}
            </Button>
          </Space>
        </div>
      )}
    />
  );
};

export default CreatableSelect;
