import instanceBE from './instance';
import type { ResponseAPI, FlashSaleConfig, FlashSaleData } from '~/types';

export const flashSaleService = {
  /**
   * Lấy dữ liệu và cấu hình Flash Sale
   */
  getFlashSale: async (): Promise<FlashSaleData> => {
    const res = await instanceBE.get<any, ResponseAPI<FlashSaleData>>('/flash-sale');
    return res.data;
  },

  /**
   * Cập nhật cấu hình Flash Sale (Admin)
   */
  updateConfig: async (payload: FlashSaleConfig): Promise<FlashSaleConfig> => {
    const res = await instanceBE.put<any, ResponseAPI<FlashSaleConfig>>('/flash-sale/config', payload);
    return res.data;
  },
};

export default flashSaleService;
