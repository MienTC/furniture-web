export const APP_ENV = {
  apiUrl:  import.meta.env.VITE_API_URL || '/api/v1',
  isDev:   import.meta.env.DEV,
  isProd:  import.meta.env.PROD,
  useMock: false,
} as const;