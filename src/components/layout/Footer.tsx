import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "~/features/products/hooks/useCategory";
import { APP_NAME, APP_SLOGAN } from "~/common/constants";
import {
  MapPin,
  Phone,
  Sparkles,
  MessageSquareText,
  QrCode,
  X,
} from "lucide-react";
import { Input, Button, Modal } from "antd";

const REGISTRATION_CONTACTS = [
  {
    id: 1,
    name: "Zalo 1",
    phone: "0999888777",
    link: "https://zalo.me/0999888777",
  },
  {
    id: 2,
    name: "Zalo 2",
    phone: "0777666555",
    link: "https://zalo.me/0777666555",
  },
  {
    id: 3,
    name: "Zalo 3",
    phone: "0555444333",
    link: "https://zalo.me/0555444333",
  },
];

const qrCodeUrl = (value: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(value)}`;

export const Footer: React.FC = () => {
  const [openRegister, setOpenRegister] = useState(false);
  const { categories } = useCategories();

  return (
    <>
      <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-amber-950/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-15 h-15 bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src="/logo1.png" alt="" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-stone-400 pr-6">
              {APP_SLOGAN}. Chúng tôi tự hào mang tới những kiệt tác nội thất
              cao cấp từ chất liệu gỗ tự nhiên & da Ý sang trọng.
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
            <div className="rounded-xl overflow-hidden border border-stone-700 mt-2">
              <iframe
                title="LuxDecor Showroom Hà Nội"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9027935990297!2d105.84697147599727!3d21.02785528061073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1babf6b7a3f9b9f!2zTMO9IFRoxrDhu51uZyBLaeG7h3QsIEhvw6BuIEvhuq9tLCBIw6AgTuG7mWk!5e0!3m2!1svi!2svn!4v1700000000000"
                width="100%"
                height="160"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-base mb-4">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories
                .filter((c) => !c.parentId)
                .slice(0, 6)
                .map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?category=${cat.id}`}
                      className="hover:text-amber-400 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-base mb-4">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/orders"
                  className="hover:text-amber-400 transition-colors"
                >
                  Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Chính sách bảo hành 5 năm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Chính sách vận chuyển & lắp đặt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Hướng dẫn thanh toán QR Bank
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Quy trình đổi trả sản phẩm
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-base mb-4">
              Đăng Ký Nhận Ưu Đãi
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Nhận mã giảm giá 10% cho đơn hàng đầu tiên.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Email của bạn..."
                className="!rounded-lg text-xs"
              />
              <Button
                type="primary"
                onClick={() => setOpenRegister(true)}
                className="!bg-amber-800 hover:!bg-amber-700 font-bold text-xs"
              >
                Đăng Ký Ngay
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© 2026 {APP_NAME}. Bản quyền thuộc về LuxDecor Furniture Team.</p>
        </div>
      </footer>

      <Modal
        open={openRegister}
        onCancel={() => setOpenRegister(false)}
        footer={null}
        centered
        width={760}
        closeIcon={<X size={18} />}
        className="register-modal"
      >
        <div className="grid gap-5 p-1 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 p-5 text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
              <Sparkles size={12} /> Khuyến mãi đặc biệt
            </div>
            <h3 className="text-2xl font-black leading-tight">
              Đăng ký nhận ưu đãi & tư vấn ngay
            </h3>
            <p className="mt-3 text-sm text-amber-100/80">
              Nhận ưu đãi lên đến 10% và được đội ngũ tư vấn hỗ trợ tìm giải
              pháp nội thất phù hợp với không gian của bạn.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5">
                <MessageSquareText size={16} className="text-amber-300" />
                <span>Hỗ trợ nhanh qua Zalo, WhatsApp và hotline.</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5">
                <QrCode size={16} className="text-amber-300" />
                <span>
                  Quét mã QR để liên hệ trực tiếp với nhân viên tư vấn.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Họ và tên
              </label>
              <Input
                placeholder="Nhập họ tên của bạn"
                className="!h-11 !rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Số điện thoại
              </label>
              <Input
                placeholder="Nhập số điện thoại"
                className="!h-11 !rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Email
              </label>
              <Input
                placeholder="Email nhận ưu đãi"
                className="!h-11 !rounded-xl"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Liên hệ nhanh qua Zalo
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {REGISTRATION_CONTACTS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-stone-200 bg-white p-2 text-center shadow-sm"
                  >
                    <img
                      src={qrCodeUrl(item.link)}
                      alt={`QR Zalo ${item.phone}`}
                      className="mx-auto h-20 w-20 rounded-xl object-cover"
                    />
                    <p className="mt-2 text-[11px] font-bold text-stone-800">
                      {item.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="primary"
              className="!h-11 !w-full !bg-amber-800 hover:!bg-amber-700 !font-bold"
            >
              Đăng ký nhận ưu đãi
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
