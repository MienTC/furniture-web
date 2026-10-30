import React, { useMemo } from 'react';
import { Table, Image, InputNumber, Button, Tooltip, type TableColumnsType } from 'antd';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { formatVND } from '~/common/utils/formatters';
import type { AdminOrderItem } from '~/types';

interface OrderDetailItemsTableProps {
  items: AdminOrderItem[];
  isEditing: boolean;
  onQuantityChange?: (itemId: string, qty: number | null) => void;
  onPriceChange?: (itemId: string, price: number | null) => void;
  onRemoveItem?: (itemId: string) => void;
  onOpenPicker?: () => void;
}

export const OrderDetailItemsTable: React.FC<OrderDetailItemsTableProps> = ({
  items,
  isEditing,
  onQuantityChange,
  onPriceChange,
  onRemoveItem,
  onOpenPicker,
}) => {
  const columns = useMemo<TableColumnsType<AdminOrderItem>>(() => {
    const baseCols: TableColumnsType<AdminOrderItem> = [
      {
        title: 'STT',
        width: 50,
        align: 'center' as const,
        render: (_: unknown, __: unknown, index: number) => (
          <span className="text-slate-400 font-mono text-xs">{index + 1}</span>
        ),
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'productName',
        render: (name: string, row: AdminOrderItem) => (
          <div className="flex items-center gap-3">
            <Image
              src={row.imageUrl}
              alt={name}
              width={46}
              height={46}
              className="rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div>
              <p className="font-semibold text-xs text-slate-900 leading-snug m-0">{name}</p>
              {row.selectedColor && (
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Màu sắc / Phân loại: {row.selectedColor}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        title: 'Đơn giá',
        dataIndex: 'unitPrice',
        width: isEditing ? 160 : 140,
        align: 'right' as const,
        render: (price: number, row: AdminOrderItem) =>
          isEditing ? (
            <InputNumber
              min={0}
              value={price}
              onChange={(val) => onPriceChange?.(row.id || row.productId, val)}
              formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(val) => Number(val?.replace(/\$\s?|(,*)/g, '') || 0)}
              className="w-32 text-right !font-medium"
            />
          ) : (
            <span className="text-xs text-slate-700">{formatVND(price || 0)}</span>
          ),
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        width: isEditing ? 110 : 90,
        align: 'center' as const,
        render: (qty: number, row: AdminOrderItem) =>
          isEditing ? (
            <InputNumber
              min={1}
              max={999}
              value={qty}
              onChange={(val) => onQuantityChange?.(row.id || row.productId, val)}
              className="w-20 text-center font-bold"
            />
          ) : (
            <span className="text-xs font-bold text-slate-900">{qty}</span>
          ),
      },
      {
        title: 'Thành tiền',
        dataIndex: 'lineTotal',
        width: 140,
        align: 'right' as const,
        render: (_: unknown, row: AdminOrderItem) => (
          <span className="text-xs font-bold text-[#2B5A50]">
            {formatVND((row.quantity || 1) * (row.unitPrice || 0))}
          </span>
        ),
      },
    ];

    if (isEditing) {
      baseCols.push({
        title: 'Xóa',
        width: 60,
        align: 'center' as const,
        render: (_: unknown, row: AdminOrderItem) => (
          <Tooltip title="Xóa sản phẩm này khỏi đơn">
            <Button
              type="text"
              danger
              size="small"
              icon={<IconTrash size={16} />}
              onClick={() => onRemoveItem?.(row.id || row.productId)}
              className="cursor-pointer"
            />
          </Tooltip>
        ),
      });
    }

    return baseCols;
  }, [isEditing, onQuantityChange, onPriceChange, onRemoveItem]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider m-0">
          Danh Sách Sản Phẩm Đặt Mua ({items.length} mặt hàng)
        </h4>

        {isEditing && (
          <Button
            type="primary"
            size="small"
            icon={<IconPlus size={15} />}
            onClick={onOpenPicker}
            className="!bg-[#2B5A50] hover:!bg-[#20453D] !font-semibold !rounded-lg cursor-pointer"
          >
            Thêm sản phẩm vào đơn
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table
          dataSource={items}
          rowKey={(r) => r.id || r.productId}
          columns={columns}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default OrderDetailItemsTable;
