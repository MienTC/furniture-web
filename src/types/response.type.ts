export type ResponseAPI<T = any> = {
  error: boolean;
  code: number;
  message: string;
  data: T;
  traceId: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface ProductListResponse {
  products: import('./index').Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IFTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export enum StoreKey {
  ACCESS_TOKEN = 'luxdecor_access_token',
  REFRESH_TOKEN = 'luxdecor_refresh_token',
}
