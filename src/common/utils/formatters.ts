/**
 * Format currency number to VND string (e.g. 15,500,000 ₫)
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format date string (e.g. "14/08/2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Calculate discounted price
 */
export function calculateDiscountPrice(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100));
}
