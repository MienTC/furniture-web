import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '~/services/productService';
import { useCart } from '~/contexts/CartContext';
import { useWishlist } from '~/contexts/WishlistContext';
import { formatVND, calculateDiscountPrice } from '~/common/utils/formatters';
import { RatingStars } from '~/components/ui/RatingStars';
import { ProductCard } from '~/components/ui/ProductCard';
import { 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Share2, 
  Check, 
  ArrowLeft,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';
import { Tag, Tabs, Button, Input, Modal, Rate, message } from 'antd';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const product = productService.getProductBySlug(slug || '');

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  // Review Form state
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Không tìm thấy sản phẩm</h2>
        <p className="text-stone-500 text-xs">Sản phẩm này có thể đã ngừng sản xuất hoặc đường dẫn không đúng.</p>
        <Link to="/products" className="inline-block bg-amber-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const activeImage = selectedImage || product.images[0];
  const activeColor = selectedColor || product.colorOptions[0];
  const liked = isWishlisted(product.id);

  const finalPrice = product.discountPercent
    ? calculateDiscountPrice(product.price, product.discountPercent)
    : product.price;

  const relatedProducts = productService.getProducts({ categoryId: product.categoryId }).filter(p => p.id !== product.id).slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, activeColor);
    navigate('/checkout');
  };

  const handleAddReview = () => {
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      message.error('Vui lòng điền họ tên và nội dung đánh giá!');
      return;
    }
    const createdReview = {
      id: `rev-${Date.now()}`,
      userName: newReview.name,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      verifiedPurchase: true,
    };
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift(createdReview);
    productService.updateProduct(product.id, { reviews: product.reviews });
    message.success('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
    setReviewModalOpen(false);
    setNewReview({ name: '', rating: 5, comment: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Back button */}
      <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-amber-900">
        <ArrowLeft size={16} /> Quay lại danh sách sản phẩm
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent && (
              <Tag color="error" className="absolute top-4 left-4 font-bold border-none px-3 py-1 text-xs shadow-md">
                GIẢM {product.discountPercent}%
              </Tag>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img ? 'border-red-700 ring-2 ring-red-700/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                {product.categoryName}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">Xuất xứ: {product.origin}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <RatingStars rating={product.rating} count={product.reviewCount} size={16} />
              <span className="text-stone-300">|</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check size={14} /> Còn {product.stockQuantity} sản phẩm trong kho
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-red-950/5 border border-red-900/10 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-red-700 font-serif-heading">
              {formatVND(finalPrice)}
            </span>
            {product.discountPercent && (
              <span className="text-base text-stone-400 line-through">
                {formatVND(product.price)}
              </span>
            )}
          </div>

          {/* Color Options */}
          {product.colorOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 block">
                Tùy chọn màu sắc / hoàn thiện: <span className="text-red-700">{activeColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      activeColor === color
                        ? 'bg-red-700 text-white border-red-700 font-bold shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specs Quick Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-stone-100/70 border border-stone-200">
            <div>
              <span className="text-stone-400 block">Kích thước:</span>
              <span className="font-semibold text-stone-800">{product.dimensions}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Chất liệu chính:</span>
              <span className="font-semibold text-stone-800">{product.material}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Thời gian bảo hành:</span>
              <span className="font-semibold text-red-700">{product.warranty}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Vận chuyển:</span>
              <span className="font-semibold text-stone-800">Lắp đặt miễn phí</span>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-800">Số lượng:</span>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-bold text-xs text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, quantity, activeColor)}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
              >
                <ShoppingBag size={18} /> Thêm Vào Giỏ Hàng
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
              >
                Mua Ngay Thanh Toán
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${
                  liked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                }`}
                title="Yêu thích"
              >
                <Heart size={20} className={liked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specs & Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <Tabs
          defaultActiveKey="description"
          items={[
            {
              key: 'description',
              label: <span className="font-bold text-sm">Mô Tả Sản Phẩm</span>,
              children: (
                <div className="space-y-4 text-stone-700 text-xs sm:text-sm leading-relaxed py-4">
                  <p>{product.description}</p>
                  <div className="bg-red-50/70 p-4 rounded-xl border border-red-200/60">
                    <h4 className="font-bold text-red-950 text-sm mb-2">Đặc điểm nổi bật:</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-900">
                      <li>Chất liệu chính: {product.material} qua xử lý chống ẩm mốc.</li>
                      <li>Khung kết cấu vững chắc, chịu lực đến 500kg.</li>
                      <li>Thiết kế chuẩn công thái học nâng đỡ tối ưu không gian sống.</li>
                    </ul>
                  </div>
                </div>
              ),
            },
            {
              key: 'specifications',
              label: <span className="font-bold text-sm">Thông Số Kỹ Thuật</span>,
              children: (
                <div className="py-4">
                  <table className="w-full text-xs text-stone-700 border-collapse">
                    <tbody>
                      <tr className="border-b border-stone-100">
                        <td className="py-2.5 font-bold text-stone-900 w-1/3">Kích thước chuẩn</td>
                        <td className="py-2.5">{product.dimensions}</td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-2.5 font-bold text-stone-900">Chất liệu chính</td>
                        <td className="py-2.5">{product.material}</td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-2.5 font-bold text-stone-900">Xuất xứ</td>
                        <td className="py-2.5">{product.origin}</td>
                      </tr>
                      <tr className="border-b border-stone-100">
                        <td className="py-2.5 font-bold text-stone-900">Bảo hành</td>
                        <td className="py-2.5">{product.warranty}</td>
                      </tr>
                      {Object.entries(product.specifications || {}).map(([key, val]) => (
                        <tr key={key} className="border-b border-stone-100">
                          <td className="py-2.5 font-bold text-stone-900">{key}</td>
                          <td className="py-2.5">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            },
            {
              key: 'reviews',
              label: (
                <span className="font-bold text-sm">
                  Đánh Giá Từ Khách Hàng ({product.reviews?.length || 0})
                </span>
              ),
              children: (
                <div className="py-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">Ý kiến phản hồi từ người mua</h4>
                      <RatingStars rating={product.rating} count={product.reviewCount} size={16} />
                    </div>
                    <Button
                      onClick={() => setReviewModalOpen(true)}
                      icon={<MessageSquare size={14} />}
                      type="primary"
                      className="!bg-red-700 hover:!bg-red-600 font-bold text-xs"
                    >
                      Viết Đánh Giá
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(product.reviews || []).map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <Tag color="green" className="text-[10px] font-bold">Đã mua hàng</Tag>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">{rev.date}</span>
                        </div>
                        <Rate disabled defaultValue={rev.rating} className="!text-amber-500 text-xs" />
                        <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-serif-heading text-stone-900">Sản Phẩm Cùng Danh Mục</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      <Modal
        title="Gửi Đánh Giá Sản Phẩm"
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        onOk={handleAddReview}
        okText="Gửi Đánh Giá"
        cancelText="Hủy"
        okButtonProps={{ className: '!bg-red-700' }}
      >
        <div className="space-y-4 py-3">
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">Số sao đánh giá:</label>
            <Rate value={newReview.rating} onChange={(val) => setNewReview((prev) => ({ ...prev, rating: val }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">Họ & Tên người dùng:</label>
            <Input
              placeholder="Nhập họ tên của bạn..."
              value={newReview.name}
              onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">Nội dung nhận xét:</label>
            <Input.TextArea
              rows={4}
              placeholder="Chia sẻ cảm nhận về chất lượng sản phẩm nội thất..."
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
