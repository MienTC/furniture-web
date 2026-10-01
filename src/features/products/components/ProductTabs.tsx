import React, { useState } from "react";
import { Tabs, Tag, Rate, Button } from "antd";
import { MessageSquare } from "lucide-react";
import { RatingStars } from "~/components/ui/RatingStars";
import { ReviewModal } from "./ReviewModal";
import type { Product } from "~/types";

export const ProductTabs: React.FC<{ product: Product }> = ({ product }) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <Tabs
          defaultActiveKey="description"
          items={[
            {
              key: "description",
              label: <span className="font-bold text-sm">Mô Tả</span>,
              children: (
                <div className="text-stone-700 text-xs sm:text-sm leading-relaxed py-4">
                  <div 
                    className="prose prose-sm prose-stone max-w-none text-stone-700 leading-relaxed ck-content" 
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                </div>
              ),
            },
            {
              key: "specs",
              label: <span className="font-bold text-sm">Thông Số</span>,
              children: (
                <div className="py-4">
                  <table className="w-full text-xs text-stone-700 border-collapse">
                    <tbody>
                      {[
                        ["Kích thước", product.dimensions],
                        ["Chất liệu", product.material],
                        ["Xuất xứ", product.origin],
                        ["Bảo hành", product.warranty],
                        ...Object.entries(product.specifications || {}),
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-stone-100">
                          <td className="py-2.5 font-bold text-stone-900 w-1/3">
                            {k}
                          </td>
                          <td className="py-2.5">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            },
            {
              key: "reviews",
              label: (
                <span className="font-bold text-sm">
                  Đánh Giá ({product.reviews?.length ?? 0})
                </span>
              ),
              children: (
                <div className="py-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">
                        Ý kiến người mua
                      </h4>
                      <RatingStars
                        rating={product.rating}
                        count={product.reviewCount}
                        size={16}
                      />
                    </div>
                    <Button
                      onClick={() => setReviewOpen(true)}
                      icon={<MessageSquare size={14} />}
                      type="primary"
                      className="!bg-amber-900 font-bold text-xs"
                    >
                      Viết Đánh Giá
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(product.reviews ?? []).map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">
                              {rev.userName}
                            </span>
                            {rev.verifiedPurchase && (
                              <Tag
                                color="green"
                                className="text-[10px] font-bold"
                              >
                                Đã mua hàng
                              </Tag>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">
                            {rev.date}
                          </span>
                        </div>
                        <Rate
                          disabled
                          defaultValue={rev.rating}
                          className="!text-amber-500 text-xs"
                        />
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
      <ReviewModal
        product={product}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
};
