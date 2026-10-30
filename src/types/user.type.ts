export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  s_ID?: string;
  s_user?: string;
  avatar_url?: string;
  is_active?: boolean;
}

export interface UseAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface AdminUserUpdatePayload {
  role?: string;
  phone?: string;
  s_user?: string;
}

export interface AdminUserResetPasswordPayload {
  newPassword: string;
}
