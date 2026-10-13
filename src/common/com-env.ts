const rawApiUrl = (import.meta.env.VITE_API_URL || '/api/v1').trim().replace(/\/+$/, '');
const normalizedApiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;

export const APP_ENV = {
  apiUrl:  normalizedApiUrl,
  isDev:   import.meta.env.DEV,
  isProd:  import.meta.env.PROD,
  useMock: false,
} as const;