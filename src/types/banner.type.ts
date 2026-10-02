export interface IFBanner {
  id: string;
  imageUrl: string;
  alt: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface IFQualityBadge {
  id: string;
  label: string;
  colorClass: string;
}

export interface IFShowcaseSection {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  badges: IFQualityBadge[];
  highlights: string[];
  ctaLabel: string;
  ctaLink: string;
}

export interface IFTrustBarItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  sortOrder: number;
}

export interface IFVoucher {
  id: string;
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate?: string;
  usageCount?: number;
  maxUsage?: number;
  isActive?: boolean;
}
