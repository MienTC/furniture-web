import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '~/services/v1/admin.service';
import { ADMIN_QUERY_KEYS } from '~/common/admin-query-key';

export const useAdminReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, refetch } = useQuery({
    queryKey: [ADMIN_QUERY_KEYS.reviews.list],
    queryFn: () => adminService.getReviews(),
  });

  const { mutateAsync: replyReview, isPending: isReplying } = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      adminService.replyReview(id, reply),
    onSuccess: () => {
      toast.success('Đã gửi phản hồi đánh giá');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.reviews.list] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  const { mutateAsync: toggleReviewStatus, isPending: isToggling } = useMutation({
    mutationFn: (id: string) => adminService.toggleReviewStatus(id),
    onSuccess: (data: any) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.reviews.list] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  const { mutateAsync: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      toast.success('Đã xóa đánh giá');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.reviews.list] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message);
    },
  });

  return {
    reviews,
    isLoading,
    refetch,
    replyReview,
    toggleReviewStatus,
    deleteReview,
    isReplying,
    isToggling,
    isDeleting,
  };
};
