export const APP_NAME = "LuxDecor Furniture";
export const APP_SLOGAN = "Kiến Tạo Không Gian Sống Sang Trọng & Đẳng Cấp";

export const SHIPPING_FEE = 300000; // 300,000 VND
export const FREE_SHIPPING_THRESHOLD = 15000000; // Miễn phí vận chuyển cho đơn trên 15 triệu

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
