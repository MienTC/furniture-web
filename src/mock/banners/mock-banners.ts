export interface IFBanner {
  id: string;
  imageUrl: string;
  alt: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface IFQualityBadge { id: string; label: string; colorClass: string; }
export interface IFShowcaseSection {
  title: string; description: string; imageUrl: string;
  badges: IFQualityBadge[]; highlights: string[];
  ctaLabel: string; ctaLink: string;
}

export const MOCK_BANNERS: IFBanner[] = [
  { id: 'b1', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80', alt: 'Phòng Khách Cao Cấp', isActive: true, sortOrder: 1 },
  { id: 'b2', imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80', alt: 'Nội Thất Phòng Ngủ', isActive: true, sortOrder: 2 },
  { id: 'b3', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80', alt: 'Bộ Bàn Ăn Cao Cấp', isActive: true, sortOrder: 3 },
];

export const MOCK_SHOWCASE: IFShowcaseSection = {
  title: 'Chất Liệu Gỗ Sồi & Óc Chó Nhập Khẩu 100% Nguyên Tấm',
  description: 'Mỗi sản phẩm nội thất tại LuxDecor được kiểm định nghiêm ngặt theo tiêu chuẩn quốc tế. Quy trình sấy chuẩn 8-12% chống nứt nẻ cong vênh tuyệt đối dưới khí hậu Việt Nam.',
  imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
  badges: [
    { id: 'bg1', label: 'Cam Kết Chất Lượng', colorClass: 'bg-amber-700/80' },
    { id: 'bg2', label: 'Bảo Hành 5 Năm',    colorClass: 'bg-stone-700'    },
    { id: 'bg3', label: 'Nhập Khẩu 100%',    colorClass: 'bg-amber-900/80' },
  ],
  highlights: ['Da Bò Ý Nhập Khẩu', 'Bảo Hành 5 Năm Gỗ', 'Sơn PU Chống Trầy', 'Lắp Đặt Tận Nơi'],
  ctaLabel: 'Đặt Hàng Ngay',
  ctaLink: '/products',
};
