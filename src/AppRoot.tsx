import React from 'react';
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
    colorPrimary: '#DE7272', colorPrimaryHover: '#e58585', colorPrimaryActive: '#c95f5f',
    colorBgBase: '#fafaf9', colorText: '#1c1917',
    borderRadius: 10,
    fontFamily: "'Inter', sans-serif",
    colorLink: '#DE7272', colorLinkHover: '#FFCA88',
  },
  components: {
    Button: { borderRadius: 10 }, Input: { borderRadius: 10 }, Select: { borderRadius: 10 },
    Tag: { borderRadius: 6 }, Card: { borderRadius: 16 },
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
  </QueryProvider>
);

export default AppRoot;
