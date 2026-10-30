import React, { useState, useEffect } from "react";
import { Modal, Rate, Input, message } from "antd";
import { useCreateReview } from "~/features/products/hooks/useProductReviews";
import { useAuth } from "~/contexts/AuthContext";

interface ReviewModalProps {
  product: { id: string; name: string; images?: string[] };
  open: boolean;
  onClose: () => void;
  orderId?: string;
  defaultName?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  product,
  open,
  onClose,
  orderId,
  defaultName,
}) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const { mutateAsync: createReview, isPending } = useCreateReview(product?.id);

  useEffect(() => {
    if (open) {
      setForm({
        name: defaultName || user?.name || "",
        rating: 5,
        comment: "",
      });
    }
  }, [open, defaultName, user]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      message.error("Vui lòng điền đầy đủ họ tên và nội dung đánh giá!");
      return;
    }

    try {
      await createReview({
        productId: product.id,
        rating: form.rating,
        comment: form.comment.trim(),
        name: form.name.trim(),
        orderId,
      });
      message.success("Cảm ơn bạn đã gửi đánh giá sản phẩm!");
      onClose();
      setForm({ name: "", rating: 5, comment: "" });
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || "Lỗi khi gửi đánh giá");
    }
  };

  return (
    <Modal
      title="Gửi Đánh Giá Sản Phẩm"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Gửi đánh giá"
      cancelText="Hủy"
      confirmLoading={isPending}
      okButtonProps={{ className: "!bg-[#2B5A50] hover:!bg-[#20453D] font-bold" }}
      destroyOnClose
    >
      <div className="space-y-4 py-3 font-sans">
        {product && (
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            {product.images && product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover bg-white border border-stone-200 shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-bold text-xs text-stone-900 truncate m-0">{product.name}</p>
              {orderId && (
                <span className="text-[11px] text-emerald-700 font-semibold">
                  ✓ Đánh giá đơn hàng #{orderId}
                </span>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Số sao đánh giá:
          </label>
          <Rate
            value={form.rating}
            onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Họ & Tên của bạn:
          </label>
          <Input
            placeholder="Nhập họ và tên..."
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="!rounded-lg !py-2 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Nội dung nhận xét:
          </label>
          <Input.TextArea
            rows={4}
            placeholder="Chia sẻ cảm nhận thực tế về chất lượng, kiểu dáng hoặc độ hoàn thiện của sản phẩm..."
            value={form.comment}
            onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
            className="!rounded-lg text-xs"
          />
        </div>
      </div>
    </Modal>
  );
};
