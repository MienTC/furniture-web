import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';
import type { UseAdminUsersParams, AdminUserUpdatePayload, AdminUserResetPasswordPayload } from '~/types';

export const useAdminUsers = (params?: UseAdminUsersParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.users.list, params?.page, params?.search, params?.role, params?.status],
    queryFn: () => adminService.getUsers(params),
  });

  const { mutateAsync: toggleUserStatus, isPending: isToggling } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      adminService.toggleUserStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái tài khoản thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.users.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUserUpdatePayload }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin người dùng thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.users.list] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  const { mutateAsync: resetPassword, isPending: isResetting } = useMutation({
    mutationFn: ({ id, newPassword }: { id: string } & AdminUserResetPasswordPayload) =>
      adminService.resetUserPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Đã đặt lại mật khẩu thành công');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message);
    },
  });

  return {
    users: data?.items || [],
    total: data?.pagination?.total || 0,
    pagination: data?.pagination,
    isLoading,
    refetch,
    toggleUserStatus,
    isToggling,
    updateUser,
    isUpdating,
    resetPassword,
    isResetting,
  };
};

export const useAdminUserOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['admin-user-orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await adminService.getUserOrders(userId);
      return res || [];
    },
    enabled: Boolean(userId),
  });
};
