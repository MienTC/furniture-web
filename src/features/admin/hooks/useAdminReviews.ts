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
      toast.error(e.message || 'Lỗi khi gửi phản hồi');
    },
  });

  const { mutateAsync: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      toast.success('Đã xóa đánh giá');
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.reviews.list] });
    },
    onError: (e: any) => {
      toast.error(e.message || 'Lỗi khi xóa đánh giá');
    },
  });

  return {
    reviews,
    isLoading,
    refetch,
    replyReview,
    deleteReview,
    isReplying,
    isDeleting,
  };
};
