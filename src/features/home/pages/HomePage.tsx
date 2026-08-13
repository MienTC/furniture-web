import React from 'react';
import { Link } from 'react-router-dom';
import { productService } from '~/services/productService';
import { ProductCard } from '~/components/ui/ProductCard';
import { MOCK_CATEGORIES, MOCK_VOUCHERS } from '~/mock/data';
import { formatVND } from '~/common/utils/formatters';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Truck, 
  Flame, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { Carousel, Tag, Button } from 'antd';

export const HomePage: React.FC = () => {
  const featuredProducts = productService.getProducts({ sortBy: 'featured' }).slice(0, 6);
  const bestSellers = productService.getProducts({ sortBy: 'rating' }).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Carousel */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <Carousel autoplay effect="fade">
          {/* Slide 1 */}
          <div className="relative h-[550px] sm:h-[620px]">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Living Room"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full space-y-6">
                <Tag color="gold" className="font-bold border-none px-3 py-1 text-xs tracking-wider uppercase">
                  Bộ Sưu Tập Mới 2026
                </Tag>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-heading font-bold text-white leading-tight max-w-2xl">
                  Kiến Tạo Không Gian Sống <span className="gold-gradient-text">Đẳng Cấp & Sang Trọng</span>
                </h1>
                <p className="text-sm sm:text-base text-stone-300 max-w-xl font-light">
                  Chế tác hoàn hảo từ gỗ sồi Mỹ tuyển chọn và da bò Ý nguyên tấm. Bảo hành 5 năm toàn quốc, miễn phí thiết kế & lắp đặt.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/products"
                    className="bg-amber-800 hover:bg-amber-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    Khám Phá Bộ Sưu Tập <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/products?category=phong-khach"
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-semibold px-6 py-3.5 rounded-full border border-white/30 transition-all"
                  >
                    Sofa Da Bò Ý
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative h-[550px] sm:h-[620px]">
            <img
              src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Bedroom"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full space-y-6">
                <Tag color="volcano" className="font-bold border-none px-3 py-1 text-xs tracking-wider uppercase">
                  Bắc Âu Style
                </Tag>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-heading font-bold text-white leading-tight max-w-2xl">
                  Nội Thất Phòng Ngủ <span className="gold-gradient-text"> Nordic Royal</span>
                </h1>
                <p className="text-sm sm:text-base text-stone-300 max-w-xl font-light">
                  Đường nét tối giản Bắc Âu mang lại trải nghiệm nghỉ ngơi êm ái và không gian thư giãn tuyệt đối cho gia đình bạn.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/products?category=phong-ngu"
                    className="bg-amber-800 hover:bg-amber-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    Xem Giường Ngủ Gỗ Sồi <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Voucher Bar Promos */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_VOUCHERS.map((v) => (
            <div
              key={v.code}
              className="p-5 rounded-2xl bg-amber-950 text-amber-50 border border-amber-800/40 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Mã Giảm Giá Ưu Đãi
                </span>
                <h4 className="font-bold text-lg text-white font-mono">{v.code}</h4>
                <p className="text-xs text-amber-200/80 mt-1 line-clamp-1">{v.description}</p>
              </div>
              <Button
                type="primary"
                size="small"
                onClick={() => navigator.clipboard?.writeText(v.code)}
                className="!bg-amber-700 hover:!bg-amber-600 font-bold text-xs"
              >
                Lấy Mã
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Không Gian Sống
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900">
            Khám Phá Theo Danh Mục Nội Thất
          </h2>
          <div className="w-16 h-0.5 bg-amber-800 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-4/5 flex flex-col justify-end p-5"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent"></div>
              
              <div className="relative z-10 space-y-1 text-white">
                <h3 className="font-serif-heading font-bold text-lg leading-tight group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 font-light">{cat.itemCount}+ Sản phẩm</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Xem ngay <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale / Featured Products */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-stone-200 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame size={16} className="text-rose-500 animate-bounce" /> Flash Sale Nội Thất Tuần Này
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900">
              Sản Phẩm Nổi Bật & Ưu Đãi
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            Xem Tất Cả ({productService.getProducts().length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Showcase Banner Feature */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-stone-900 rounded-3xl overflow-hidden border border-amber-900/30 text-white grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-8 sm:p-14 space-y-6">
            <Tag color="amber" className="font-bold border-none text-xs tracking-widest uppercase">
              Cam Kết Chất Lượng
            </Tag>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading leading-snug">
              Chất Liệu Gỗ Sồi & Óc Chó Nhập Khẩu 100% Nguyên Tấm
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed font-light">
              Mỗi sản phẩm nội thất tại LuxDecor được kiểm định nghiêm ngặt theo tiêu chuẩn quốc tế. Quy trình sấy chuẩn 8-12% chống nứt nẻ cong vênh tuyệt đối dưới khí hậu Việt Nam.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400" /> Da Bò Ý Nhập Khẩu
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400" /> Bảo Hành 5 Năm Gỗ
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400" /> Sơn PU Chống Trầy
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-400" /> Lắp Đặt Tận Nơi
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/products"
                className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full text-xs inline-flex items-center gap-2"
              >
                Đặt Hàng Ngay <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="relative h-80 lg:h-full min-h-[350px]">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"
              alt="Showroom LuxDecor"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Lựa Chọn Hàng Đầu
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900">
            Sản Phẩm Bán Chạy Nhất
          </h2>
          <div className="w-16 h-0.5 bg-amber-800 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};
