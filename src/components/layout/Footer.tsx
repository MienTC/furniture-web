import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_SLOGAN } from '~/common/constants';
import { Sparkles, MapPin, Phone, Mail, Clock, Shield, Award, Truck, Wrench } from 'lucide-react';
import { Input, Button } from 'antd';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-amber-950/30">
      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 pb-12 mb-12 border-b border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-amber-400 shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Giao Hàng & Lắp Đặt</h4>
            <p className="text-xs text-stone-400 mt-1">Miễn phí lắp đặt tận nhà tại Hà Nội & TP.HCM</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-amber-400 shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Bảo Hành 5 Năm</h4>
            <p className="text-xs text-stone-400 mt-1">Cam kết gỗ sồi & gỗ óc chó 100% tự nhiên</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-amber-400 shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Thiết Kế Độc Bản</h4>
            <p className="text-xs text-stone-400 mt-1">Kiến tạo theo từng không gian sống của bạn</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-amber-400 shrink-0">
            <Wrench size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Bảo Trì Trọn Đời</h4>
            <p className="text-xs text-stone-400 mt-1">Dịch vụ đánh bóng & bảo dưỡng định kỳ</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-amber-700 flex items-center justify-center text-amber-100 font-bold">
              <Sparkles size={20} />
            </div>
            <span className="text-2xl font-bold font-serif-heading text-white tracking-tight">
              {APP_NAME}
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-stone-400 pr-6">
            {APP_SLOGAN}. Chúng tôi tự hào mang tới những kiệt tác nội thất cao cấp từ chất liệu gỗ tự nhiên & da Ý sang trọng.
          </p>
          <div className="space-y-2 text-xs text-stone-300">
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-amber-500 shrink-0" />
              Showroom 1: 88 Phố Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-amber-500 shrink-0" />
              Showroom 2: 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-amber-500 shrink-0" />
              Hotline: 1900 8888 - 0988 888 999
            </p>
          </div>
        </div>

        {/* Column 2: Categories */}
        <div>
          <h4 className="font-serif-heading font-bold text-white text-base mb-4">Danh Mục Sản Phẩm</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/products?category=phong-khach" className="hover:text-amber-400 transition-colors">Sofa Da Bò Ý</Link></li>
            <li><Link to="/products?category=phong-khach" className="hover:text-amber-400 transition-colors">Bàn Trà Mặt Đá Marble</Link></li>
            <li><Link to="/products?category=phong-ngu" className="hover:text-amber-400 transition-colors">Giường Ngủ Gỗ Sồi</Link></li>
            <li><Link to="/products?category=phong-an" className="hover:text-amber-400 transition-colors">Bàn Ăn Gỗ Óc Chó</Link></li>
            <li><Link to="/products?category=phong-lam-viec" className="hover:text-amber-400 transition-colors">Bàn Làm Việc Thông Minh</Link></li>
            <li><Link to="/products?category=den-trang-tri" className="hover:text-amber-400 transition-colors">Đèn Chùm Pha Lê</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div>
          <h4 className="font-serif-heading font-bold text-white text-base mb-4">Hỗ Trợ Khách Hàng</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/orders" className="hover:text-amber-400 transition-colors">Tra cứu đơn hàng</Link></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Chính sách bảo hành 5 năm</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Chính sách vận chuyển & lắp đặt</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Hướng dẫn thanh toán QR Bank</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Quy trình đổi trả sản phẩm</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="font-serif-heading font-bold text-white text-base mb-4">Đăng Ký Nhận Ưu Đãi</h4>
          <p className="text-xs text-stone-400 mb-3">
            Nhận mã giảm giá 10% cho đơn hàng đầu tiên và thông báo bộ sưu tập mới nhất.
          </p>
          <div className="flex flex-col gap-2">
            <Input placeholder="Email của bạn..." className="!rounded-lg text-xs" />
            <Button type="primary" className="!bg-amber-800 hover:!bg-amber-700 font-bold text-xs">
              Đăng Ký Ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
        <p>© 2026 {APP_NAME}. Bản quyền thuộc về LuxDecor Furniture Team. Tổ chức theo mẫu dự án tev-fe-admin.</p>
      </div>
    </footer>
  );
};
