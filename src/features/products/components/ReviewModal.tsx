import React, { useState } from "react";
import { Modal, Rate, Input, message } from "antd";
import { useCreateReview } from "~/features/products/hooks/useProductReviews";
import type { Product } from "~/types";

interface ReviewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, open, onClose }) => {
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const { mutateAsync: createReview, isPending } = useCreateReview(product.id);

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
    >
      <div className="space-y-4 py-3 font-sans">
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
            className="!rounded-lg !py-2"
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
            className="!rounded-lg"
          />
        </div>
      </div>
    </Modal>
  );
};
