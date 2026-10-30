import axios from 'axios';
import { APP_ENV } from '~/common/com-env';

const instanceBE = axios.create({
  baseURL: APP_ENV.apiUrl,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

instanceBE.interceptors.request.use(
  (config) => {
    // Separate admin token from customer storefront token
    const isAdminRequest = config.url?.includes('/admin') || window.location.pathname.startsWith('/admin');
    const adminToken = localStorage.getItem('luxdecor_admin_token');
    const customerToken = localStorage.getItem('luxdecor_access_token');
    const token = isAdminRequest ? (adminToken || customerToken) : (customerToken || adminToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instanceBE.interceptors.response.use(
  (response) => {
    if (response.data?.error) {
      return Promise.reject({ message: response.data.message || 'Unknown error' });
    }
    return response.data;
  },
  (error: any) => Promise.reject({
    message: error.response?.data?.message || error.message || 'Network error',
    code: error.response?.status,
  })
);

export default instanceBE;
