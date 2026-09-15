import { APP_ENV } from '~/common/com-env';
import { MOCK_BANNERS, MOCK_SHOWCASE } from '~/mock/banners/mock-banners';
import { MOCK_TRUST_BAR } from '~/mock/trustbar/mock-trustbar';
import type { IFBanner, IFShowcaseSection } from '~/mock/banners/mock-banners';
import type { IFTrustBarItem } from '~/mock/trustbar/mock-trustbar';
import instanceBE from './instance';

export class BannerService {
  async fetchBanners(): Promise<IFBanner[]> {
    if (APP_ENV.useMock) return MOCK_BANNERS.filter(b => b.isActive).sort((a,b) => a.sortOrder - b.sortOrder);
    const res = await instanceBE.get<any, any>('/banners');
    return res.data;
  }
  async fetchTrustBar(): Promise<IFTrustBarItem[]> {
    if (APP_ENV.useMock) return MOCK_TRUST_BAR.sort((a,b) => a.sortOrder - b.sortOrder);
    const res = await instanceBE.get<any, any>('/banners/trustbar');
    return res.data;
  }
  async fetchShowcase(): Promise<IFShowcaseSection> {
    if (APP_ENV.useMock) return MOCK_SHOWCASE;
    const res = await instanceBE.get<any, any>('/banners/showcase');
    return res.data;
  }
}
