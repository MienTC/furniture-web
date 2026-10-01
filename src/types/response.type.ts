export type ResponseAPI<T = any> = {
  error: boolean;
  code: number;
  message: string;
  data: T;
  traceId: string;
};

export type ResponsePagination<T = any> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface IFTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export enum StoreKey {
  ACCESS_TOKEN = 'luxdecor_access_token',
  REFRESH_TOKEN = 'luxdecor_refresh_token',
}
