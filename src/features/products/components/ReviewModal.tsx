import React, { useState } from "react";
import { Modal, Rate, Input, message } from "antd";
import { ProductService } from "~/services/v1/product.service";
import type { Product } from "~/types";

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<Props> = ({ product, open, onClose }) => {
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const productService = new ProductService();

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      message.error("Vui lòng điền đầy đủ!");
      return;
    }
    const review = {
      id: `rev-${Date.now()}`,
      userName: form.name,
      rating: form.rating,
      date: new Date().toISOString().split("T")[0],
      comment: form.comment,
      verifiedPurchase: true,
    };
    if (!product.reviews) product.reviews = [];
    const newReviews = [review, ...product.reviews];
    try {
      await productService.updateProduct(product.id, { reviews: newReviews });
      message.success("Cảm ơn đã đánh giá!");
    } catch (err) {
      message.error("Lỗi khi gửi đánh giá");
    }
    onClose();
    setForm({ name: "", rating: 5, comment: "" });
  };

  return (
    <Modal
      title="Gửi Đánh Giá Sản Phẩm"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Gửi"
      cancelText="Hủy"
      okButtonProps={{ className: "!bg-amber-900" }}
    >
      <div className="space-y-4 py-3">
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Số sao:
          </label>
          <Rate
            value={form.rating}
            onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Họ & Tên:
          </label>
          <Input
            placeholder="Nhập họ tên..."
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Nội dung:
          </label>
          <Input.TextArea
            rows={4}
            placeholder="Chia sẻ cảm nhận..."
            value={form.comment}
            onChange={(e) =>
              setForm((p) => ({ ...p, comment: e.target.value }))
            }
          />
        </div>
      </div>
    </Modal>
  );
};
