import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_SLOGAN } from '~/common/constants';
import { Sparkles, MapPin, Phone } from 'lucide-react';
import { Input, Button } from 'antd';

export const Footer: React.FC = () => (
  <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-amber-950/30">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
      {/* Brand */}
      <div className="lg:col-span-2 space-y-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-amber-700 flex items-center justify-center text-amber-100">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</span>
        </Link>
        <p className="text-xs leading-relaxed text-stone-400 pr-6">
          {APP_SLOGAN}. Chúng tôi tự hào mang tới những kiệt tác nội thất cao cấp từ chất liệu gỗ tự nhiên & da Ý sang trọng.
        </p>
        <div className="space-y-2 text-xs text-stone-300">
          <p className="flex items-center gap-2"><MapPin size={16} className="text-amber-500 shrink-0" />Showroom 1: 88 Phố Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-amber-500 shrink-0" />Showroom 2: 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-amber-500 shrink-0" />Hotline: 1900 8888 - 0988 888 999</p>
        </div>
        {/* Google Maps embed */}
        <div className="rounded-xl overflow-hidden border border-stone-700 mt-2">
          <iframe
            title="LuxDecor Showroom Hà Nội"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9027935990297!2d105.84697147599727!3d21.02785528061073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1babf6b7a3f9b9f!2zTMO9IFRoxrDhu51uZyBLaeG7h3QsIEhvw6BuIEvhuq9tLCBIw6AgTuG7mWk!5e0!3m2!1svi!2svn!4v1700000000000"
            width="100%" height="160"
            style={{ border: 0, display: 'block' }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-white text-base mb-4">Danh Mục Sản Phẩm</h4>
        <ul className="space-y-2.5 text-xs">
          {[
            { to: '/products?category=phong-khach', label: 'Sofa Da Bò Ý' },
            { to: '/products?category=phong-khach', label: 'Bàn Trà Mặt Đá Marble' },
            { to: '/products?category=phong-ngu',   label: 'Giường Ngủ Gỗ Sồi' },
            { to: '/products?category=phong-an',    label: 'Bàn Ăn Gỗ Óc Chó' },
            { to: '/products?category=phong-lam-viec', label: 'Bàn Làm Việc Thông Minh' },
            { to: '/products?category=den-trang-tri',  label: 'Đèn Chùm Pha Lê' },
          ].map(l => <li key={l.to+l.label}><Link to={l.to} className="hover:text-amber-400 transition-colors">{l.label}</Link></li>)}
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="font-bold text-white text-base mb-4">Hỗ Trợ Khách Hàng</h4>
        <ul className="space-y-2.5 text-xs">
          <li><Link to="/orders" className="hover:text-amber-400 transition-colors">Tra cứu đơn hàng</Link></li>
          <li><a href="#" className="hover:text-amber-400 transition-colors">Chính sách bảo hành 5 năm</a></li>
          <li><a href="#" className="hover:text-amber-400 transition-colors">Chính sách vận chuyển & lắp đặt</a></li>
          <li><a href="#" className="hover:text-amber-400 transition-colors">Hướng dẫn thanh toán QR Bank</a></li>
          <li><a href="#" className="hover:text-amber-400 transition-colors">Quy trình đổi trả sản phẩm</a></li>
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h4 className="font-bold text-white text-base mb-4">Đăng Ký Nhận Ưu Đãi</h4>
        <p className="text-xs text-stone-400 mb-3">Nhận mã giảm giá 10% cho đơn hàng đầu tiên.</p>
        <div className="flex flex-col gap-2">
          <Input placeholder="Email của bạn..." className="!rounded-lg text-xs" />
          <Button type="primary" className="!bg-amber-800 hover:!bg-amber-700 font-bold text-xs">Đăng Ký Ngay</Button>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
      <p>© 2026 {APP_NAME}. Bản quyền thuộc về LuxDecor Furniture Team.</p>
    </div>
  </footer>
);
