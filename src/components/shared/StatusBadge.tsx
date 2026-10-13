import React from "react";
import UBadge, { colorMap } from "../ui/ubadge";

type BadgeColor = keyof typeof colorMap;

interface StatusConfig {
  label: string;
  color: BadgeColor;
}

const GLOBAL_STATUS_MAP: Record<string, StatusConfig> = {
  // Trạng thái chung (General Status)
  active: { label: "Hoạt động", color: "green" },
  inactive: { label: "Tạm dừng", color: "red" },
  true: { label: "Hoạt động", color: "green" },
  false: { label: "Tạm ẩn", color: "red" },

  // Trạng thái đơn hàng (Order Status)
  pending: { label: "Chờ xác nhận", color: "orange" },
  processing: { label: "Đang xử lý", color: "orange" },
  shipping: { label: "Đang giao", color: "blue" },
  completed: { label: "Hoàn thành", color: "green" },
  cancelled: { label: "Đã hủy", color: "red" },

  // Trạng thái thanh toán (Payment Status)
  paid: { label: "Đã thanh toán", color: "green" },
  unpaid: { label: "Chưa thanh toán", color: "red" },
  refunded: { label: "Đã hoàn tiền", color: "gray" },

  // Kho hàng & Sản phẩm (Stock / Product)
  in_stock: { label: "Còn hàng", color: "green" },
  out_of_stock: { label: "Hết hàng", color: "red" },
};

interface StatusBadgeProps {
  status: string | boolean | undefined | null;
  text?: string;
  color?: BadgeColor;
  className?: string;
  isTable?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  color,
  className,
  isTable,
}) => {
  if (status === undefined || status === null) return null;

  const key = String(status).toLowerCase();
  const config = GLOBAL_STATUS_MAP[key] || {
    label: String(status),
    color: "gray",
  };

  const finalColor: BadgeColor = color || config.color;
  const finalLabel = text || config.label;

  return (
    <UBadge color={finalColor} className={className} isTable={isTable}>
      {finalLabel}
    </UBadge>
  );
};

export default StatusBadge;
