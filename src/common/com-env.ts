export const APP_ENV = {
  apiUrl:  import.meta.env.VITE_API_URL  ?? '',
  isDev:   import.meta.env.DEV,
  isProd:  import.meta.env.PROD,
  useMock: !import.meta.env.VITE_API_URL,
} as const;
