export type TrustBarIconName = 'truck' | 'shield' | 'award' | 'wrench';

export interface IFTrustBarItem {
  id: string;
  iconName: TrustBarIconName;
  title: string;
  description: string;
  sortOrder: number;
}

export const MOCK_TRUST_BAR: IFTrustBarItem[] = [
  { id: 't1', iconName: 'truck',  title: 'Giao Hàng & Lắp Đặt', description: 'Miễn phí tận nhà tại Hà Nội & TP.HCM', sortOrder: 1 },
  { id: 't2', iconName: 'shield', title: 'Bảo Hành 5 Năm',      description: 'Gỗ sồi & gỗ óc chó 100% tự nhiên',      sortOrder: 2 },
  { id: 't3', iconName: 'award',  title: 'Thiết Kế Độc Bản',    description: 'Kiến tạo theo từng không gian sống',    sortOrder: 3 },
  { id: 't4', iconName: 'wrench', title: 'Bảo Trì Trọn Đời',    description: 'Đánh bóng & bảo dưỡng định kỳ',         sortOrder: 4 },
];
