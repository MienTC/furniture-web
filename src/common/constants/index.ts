export const APP_NAME = "LuxDecor Furniture";
export const APP_SLOGAN = "Kiến Tạo Không Gian Sống Sang Trọng & Đẳng Cấp";

export const SHIPPING_FEE = 0; // Miễn phí vận chuyển toàn quốc
export const FREE_SHIPPING_THRESHOLD = 0; // Luôn miễn phí vận chuyển

export const MATERIAL_OPTIONS = [
  "Gỗ Sồi Tự Nhiên",
  "Gỗ Óc Chó (Walnut)",
  "Da Bò Ý Cao Cấp",
  "Vải Nỉ Hàn Quốc",
  "Đá Marble Tự Nhiên",
  "Khung Thép Sơn Tĩnh Điện",
  "Pha Lê & Thủy Tinh"
];

export const ORDER_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "warning" },
  processing: { label: "Đang xử lý", color: "processing" },
  shipping: { label: "Đang giao hàng", color: "blue" },
  completed: { label: "Đã hoàn thành", color: "success" },
  cancelled: { label: "Đã hủy", color: "error" },
};

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao hàng' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'unpaid', label: 'Chưa thanh toán' },
];
