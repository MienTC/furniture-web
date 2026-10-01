import type { IFBanner, IFShowcaseSection, IFTrustBarItem, ResponseAPI } from '~/types';
import instanceBE from './instance';

export class BannerService {
  async fetchBanners(): Promise<IFBanner[]> {
    const res = await instanceBE.get<any, ResponseAPI<IFBanner[]>>('/banners');
    return res.data;
  }

  async fetchTrustBar(): Promise<IFTrustBarItem[]> {
    const res = await instanceBE.get<any, ResponseAPI<IFTrustBarItem[]>>('/banners/trustbar');
    return res.data;
  }

  async fetchShowcase(): Promise<IFShowcaseSection> {
    const res = await instanceBE.get<any, ResponseAPI<IFShowcaseSection>>('/banners/showcase');
    return res.data;
  }
}
