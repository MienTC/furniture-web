import React from 'react';
import { ShieldCheck, Truck, Wrench, Award } from 'lucide-react';

const POLICIES = [
  {
    icon: <ShieldCheck size={28} className="text-amber-800" />,
    title: 'Bảo Hành 5 Năm',
    desc: 'Cam kết chất lượng chuẩn xuất khẩu, bảo hành tận nhà trên toàn quốc.',
  },
  {
    icon: <Truck size={28} className="text-amber-800" />,
    title: 'Miễn Phí Vận Chuyển',
    desc: 'Giao hàng và lắp đặt tận nơi cho các đơn hàng từ 15 triệu đồng.',
  },
  {
    icon: <Wrench size={28} className="text-amber-800" />,
    title: 'Lắp Đặt Trọn Gói',
    desc: 'Đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ lắp ráp, setup hoàn thiện.',
  },
  {
    icon: <Award size={28} className="text-amber-800" />,
    title: 'Vật Liệu Thượng Hạng',
    desc: 'Gỗ sồi, óc chó tự nhiên tuyển chọn và da bò Ý nhập khẩu 100%.',
  },
];

export const HomeFeatures: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {POLICIES.map((p, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
              {p.icon}
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
