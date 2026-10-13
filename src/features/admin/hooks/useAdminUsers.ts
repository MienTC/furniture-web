import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';

interface UseAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useAdminUsers = (params?: UseAdminUsersParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.users.list, params?.page, params?.search],
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
      toast.error(err.message || 'Lỗi khi cập nhật trạng thái người dùng');
    },
  });

  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin người dùng thành công');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.users.list] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi khi cập nhật thông tin người dùng');
    },
  });

  const { mutateAsync: resetPassword, isPending: isResetting } = useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      adminService.resetUserPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Đã đặt lại mật khẩu thành công');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi khi đặt lại mật khẩu');
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
