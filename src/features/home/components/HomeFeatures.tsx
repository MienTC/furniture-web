import React from 'react';
import { SafetyCertificateOutlined, CarOutlined, ToolOutlined, TrophyOutlined } from '@ant-design/icons';

const POLICIES = [
  {
    icon: <SafetyCertificateOutlined className="text-brand-coral" style={{ fontSize: 26 }} />,
    title: 'Bảo Hành 5 Năm',
    desc: 'Cam kết chất lượng chuẩn xuất khẩu, bảo hành tận nhà trên toàn quốc.',
  },
  {
    icon: <CarOutlined className="text-brand-coral" style={{ fontSize: 26 }} />,
    title: 'Miễn Phí Vận Chuyển',
    desc: 'Giao hàng và lắp đặt tận nơi trên toàn quốc, không điều kiện tối thiểu.',
  },
  {
    icon: <ToolOutlined className="text-brand-coral" style={{ fontSize: 26 }} />,
    title: 'Lắp Đặt Trọn Gói',
    desc: 'Đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ lắp ráp, setup hoàn thiện.',
  },
  {
    icon: <TrophyOutlined className="text-brand-coral" style={{ fontSize: 26 }} />,
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
            className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 hover:border-brand-coral/40 shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div className="w-13 h-13 rounded-2xl bg-stone-50 border border-stone-200/80 group-hover:bg-brand-coral/10 group-hover:border-brand-coral/30 flex items-center justify-center shrink-0 transition-colors duration-300">
              {p.icon}
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-1 group-hover:text-brand-coral transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
