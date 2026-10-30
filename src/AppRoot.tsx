import React from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, App } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from '~/contexts/CartContext';
import { WishlistProvider } from '~/contexts/WishlistContext';
import { AuthProvider } from '~/contexts/AuthContext';
import { QueryProvider } from '~/contexts/QueryProvider';
import AppRoutes from '~/routes';

const antdTheme = {
  token: {
    colorPrimary: '#2B5A50',
    colorPrimaryHover: '#20453D',
    colorPrimaryActive: '#183730',
    colorLink: '#1A2421',
    colorLinkHover: '#2B5A50',
    colorLinkActive: '#20453D',
    colorBgBase: '#FFFFFF',
    colorText: '#1A2421',
    colorBorder: '#E5EAE7',
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: '#2B5A50',
      colorPrimaryHover: '#20453D',
      colorPrimaryActive: '#183730',
      fontWeight: 600,
    },
    Input: { borderRadius: 8 },
    Select: { borderRadius: 8 },
    Tag: { borderRadius: 6 },
    Card: { borderRadius: 14 },
    Carousel: { dotHeight: 6, dotWidth: 28 },
  },
};

const AppRoot: React.FC = () => (
  <QueryProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <StyleProvider hashPriority="high">
      <ConfigProvider theme={antdTheme} locale={viVN}>
        <App>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppRoutes />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  </QueryProvider>
);

export default AppRoot;
