import React from 'react';
import { SafetyCertificateOutlined, CarOutlined, ToolOutlined, TrophyOutlined } from '@ant-design/icons';

const POLICIES = [
  {
    icon: <SafetyCertificateOutlined className="text-brand-coral" style={{ fontSize: 28 }} />,
    title: 'Bảo Hành 5 Năm',
    desc: 'Cam kết chất lượng chuẩn xuất khẩu, bảo hành tận nhà trên toàn quốc.',
    bg: 'bg-brand-coral/10 border-brand-coral/30',
  },
  {
    icon: <CarOutlined className="text-brand-coral" style={{ fontSize: 28 }} />,
    title: 'Miễn Phí Vận Chuyển',
    desc: 'Giao hàng và lắp đặt tận nơi trên toàn quốc, không điều kiện tối thiểu.',
    bg: 'bg-brand-peach/20 border-brand-peach/40',
  },
  {
    icon: <ToolOutlined className="text-stone-800" style={{ fontSize: 28 }} />,
    title: 'Lắp Đặt Trọn Gói',
    desc: 'Đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ lắp ráp, setup hoàn thiện.',
    bg: 'bg-brand-mint/30 border-brand-mint/50',
  },
  {
    icon: <TrophyOutlined className="text-brand-coral" style={{ fontSize: 28 }} />,
    title: 'Vật Liệu Thượng Hạng',
    desc: 'Gỗ sồi, óc chó tự nhiên tuyển chọn và da bò Ý nhập khẩu 100%.',
    bg: 'bg-brand-cream/50 border-brand-peach/30',
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
            <div className={`w-14 h-14 rounded-2xl ${p.bg} border flex items-center justify-center shrink-0`}>
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
