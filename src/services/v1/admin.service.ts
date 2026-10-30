import instanceBE from './instance';
import type {
  ResponseAPI,
  AdminStats,
  AdminProductPayload,
  ContactSettingsData,
  AdminOrderQueryParams,
  AdminCreateOrderPayload,
  AdminOrderDetail,
  AdminUpdateOrderPayload,
} from '~/types';

export class AdminService {
  async getStats(): Promise<AdminStats> {
    const res = await instanceBE.get<any, ResponseAPI<AdminStats>>('/admin/stats');
    return res.data;
  }

  async getProducts(params?: { page?: number; limit?: number; search?: string; categoryId?: string }): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/products', { params });
    return res.data;
  }

  async createProduct(data: AdminProductPayload): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/admin/products', data);
    return res.data;
  }

  async updateProduct(id: string, data: Partial<AdminProductPayload>): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>(`/admin/products/${id}`, data);
    return res.data;
  }

  async deleteProduct(id: string): Promise<any> {
    const res = await instanceBE.delete<any, ResponseAPI<any>>(`/admin/products/${id}`);
    return res.data;
  }

  async getOrders(params?: AdminOrderQueryParams): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/orders', { params });
    return res.data;
  }

  async getOrderDetail(id: string): Promise<AdminOrderDetail> {
    const res = await instanceBE.get<any, ResponseAPI<AdminOrderDetail>>(`/admin/orders/${id}`);
    return res.data;
  }

  async createOrder(data: AdminCreateOrderPayload): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/admin/orders', data);
    return res.data;
  }

  async updateOrderStatus(id: string, status: string): Promise<any> {
    const res = await instanceBE.patch<any, ResponseAPI<any>>(`/admin/orders/${id}/status`, { status });
    return res.data;
  }

  async updateOrder(id: string, data: AdminUpdateOrderPayload): Promise<AdminOrderDetail> {
    const res = await instanceBE.put<any, ResponseAPI<AdminOrderDetail>>(`/admin/orders/${id}`, data);
    return res.data;
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/users', { params });
    return res.data;
  }

  async toggleUserStatus(id: string, status: boolean): Promise<any> {
    const res = await instanceBE.patch<any, ResponseAPI<any>>(`/admin/users/${id}/status`, { status });
    return res.data;
  }

  async updateUser(id: string, data: { role?: string; phone?: string; s_user?: string }): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>(`/admin/users/${id}`, data);
    return res.data;
  }

  async resetUserPassword(id: string, newPassword: string): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>(`/admin/users/${id}/reset-password`, { newPassword });
    return res.data;
  }

  async getUserOrders(id: string): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>(`/admin/users/${id}/orders`);
    return res.data;
  }

  async getCategories(): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/categories');
    return res.data;
  }

  async createCategory(data: { name: string; description?: string; image_url?: string }): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/admin/categories', data);
    return res.data;
  }

  async updateCategory(id: string, data: { name?: string; description?: string; image_url?: string }): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>(`/admin/categories/${id}`, data);
    return res.data;
  }

  async deleteCategory(id: string): Promise<any> {
    const res = await instanceBE.delete<any, ResponseAPI<any>>(`/admin/categories/${id}`);
    return res.data;
  }

  async addProductsToCategory(categoryId: string, productIds: string[]): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>(`/admin/categories/${categoryId}/products`, { productIds });
    return res.data;
  }

  async assignProductsToCategory(categoryId: string, productIds: string[]): Promise<any> {
    return this.addProductsToCategory(categoryId, productIds);
  }

  async removeProductsFromCategory(categoryId: string, productIds: string[]): Promise<any> {
    const res = await instanceBE.delete<any, ResponseAPI<any>>(`/admin/categories/${categoryId}/products`, { data: { productIds } });
    return res.data;
  }

  async getBanners(): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/banners');
    return res.data;
  }

  async createBanner(data: any): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/admin/banners', data);
    return res.data;
  }

  async updateBanner(id: string, data: any): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>(`/admin/banners/${id}`, data);
    return res.data;
  }

  async deleteBanner(id: string): Promise<any> {
    const res = await instanceBE.delete<any, ResponseAPI<any>>(`/admin/banners/${id}`);
    return res.data;
  }

  async getVouchers(): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/vouchers');
    return res.data;
  }

  async createVoucher(data: any): Promise<any> {
    const res = await instanceBE.post<any, ResponseAPI<any>>('/admin/vouchers', data);
    return res.data;
  }

  async updateVoucher(id: string, data: any): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>(`/admin/vouchers/${id}`, data);
    return res.data;
  }

  async deleteVoucher(id: string): Promise<any> {
    const res = await instanceBE.delete<any, ResponseAPI<any>>(`/admin/vouchers/${id}`);
    return res.data;
  }

  async getReviews(): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/reviews');
    return res.data;
  }

  async replyReview(id: string, reply: string): Promise<any> {
    const res = await instanceBE.patch<any, ResponseAPI<any>>(`/admin/reviews/${id}/reply`, { reply });
    return res.data;
  }

  async toggleReviewStatus(id: string): Promise<any> {
    const res = await instanceBE.patch<any, ResponseAPI<any>>(`/admin/reviews/${id}/toggle-status`);
    return res.data;
  }

  async deleteReview(id: string): Promise<any> {
    const res = await instanceBE.delete<any, ResponseAPI<any>>(`/admin/reviews/${id}`);
    return res.data;
  }

  async getPaymentSettings(): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/payment/admin-settings');
    return res.data;
  }

  async updatePaymentSettings(data: any): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>('/payment/settings', data);
    return res.data;
  }

  async getContactSettings(): Promise<ContactSettingsData | null> {
    const res = await instanceBE.get<any, ResponseAPI<ContactSettingsData | null>>('/admin/contact-settings');
    return res.data;
  }

  async updateContactSettings(data: ContactSettingsData): Promise<ContactSettingsData> {
    const res = await instanceBE.put<any, ResponseAPI<ContactSettingsData>>('/admin/contact-settings', data);
    return res.data;
  }

  async getPublicContactSettings(): Promise<ContactSettingsData | null> {
    const res = await instanceBE.get<any, ResponseAPI<ContactSettingsData | null>>('/contact-settings');
    return res.data;
  }

  async getInvoiceSettings(): Promise<any> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/admin/invoice-settings');
    return res.data;
  }

  async updateInvoiceSettings(data: any): Promise<any> {
    const res = await instanceBE.put<any, ResponseAPI<any>>('/admin/invoice-settings', data);
    return res.data;
  }
}

export const adminService = new AdminService();
