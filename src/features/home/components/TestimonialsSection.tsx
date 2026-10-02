import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Nguyễn Thu Trang',
    role: 'Kiến trúc sư nội thất, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    content: 'Bộ sofa phòng khách của LuxDecor thực sự vượt mong đợi. Chất da Ý mềm mịn, đường may tỉ mỉ. Khách đến chơi nhà ai cũng khen gu thẩm mỹ tinh tế.',
    rating: 5,
    product: 'Sofa Da Bò Ý Cao Cấp STD8840',
  },
  {
    name: 'Trần Minh Hoàng',
    role: 'Chủ căn hộ Vinhomes Smart City',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    content: 'Mẫu sofa giường tự động rất tiện lợi cho căn hộ diện tích vừa phải. Động cơ êm ái, kéo ra thu vào mượt mà, khung thép chịu lực cực kỳ chắc chắn.',
    rating: 5,
    product: 'Sofa Giường Tự Động STD2690',
  },
  {
    name: 'Lê Hoàng Yến',
    role: 'Giám đốc Marketing, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    content: 'Dịch vụ giao hàng và lắp đặt trọn gói của LuxDecor cực kỳ chu đáo. Nhân viên hỗ trợ tận tình, bọc lót cẩn thận không một vết trầy xước sàn.',
    rating: 5,
    product: 'Bàn Ăn Thông Minh Mặt Đá Cẩm Thạch',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          Khách Hàng Nói Về LuxDecor
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
          Trải Nghiệm Từ Những Không Gian Sống Thực Tế
        </h2>
        <div className="w-16 h-0.5 bg-amber-800 mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-lg transition-all duration-300 relative group"
          >
            <Quote
              size={36}
              className="text-stone-100 group-hover:text-amber-100 transition-colors absolute top-4 right-4"
            />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                "{r.content}"
              </p>
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] font-medium text-amber-900 flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-600" /> Đã mua: {r.product}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 mt-4 border-t border-stone-100">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover border border-amber-800/20"
              />
              <div>
                <h4 className="font-bold text-xs text-stone-900">{r.name}</h4>
                <p className="text-[10px] text-stone-400">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
