import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const QualityCommitmentBanner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="bg-linear-to-r from-stone-950 via-stone-900 to-red-950/90 rounded-3xl overflow-hidden border border-red-900/40 text-white grid grid-cols-1 lg:grid-cols-2 items-center shadow-xl">
        <div className="p-8 sm:p-14 space-y-6">
          <Tag color="error" className="font-bold border-none text-xs tracking-widest uppercase">
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
              <CheckCircle2 size={16} className="text-red-500" /> Da Bò Ý Nhập Khẩu
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-red-500" /> Bảo Hành 5 Năm Gỗ
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-red-500" /> Sơn PU Chống Trầy
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-red-500" /> Lắp Đặt Tận Nơi
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/products"
              className="hero-btn-white px-7 py-3 rounded-full text-xs"
              style={{
                backgroundColor: '#ffffff',
                color: '#b91c1c',
                border: '2px solid #ffffff',
              }}
            >
              <span style={{ color: '#b91c1c', fontWeight: 700 }}>
                Đặt Hàng Ngay
              </span>
              <ArrowRight size={14} style={{ color: '#b91c1c' }} />
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
  );
};
