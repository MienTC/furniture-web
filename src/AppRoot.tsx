import React from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { CartProvider } from '~/contexts/CartContext';
import { WishlistProvider } from '~/contexts/WishlistContext';
import { AuthProvider } from '~/contexts/AuthContext';
import { QueryProvider } from '~/contexts/QueryProvider';
import AppRoutes from '~/routes';

const antdTheme = {
  token: {
    colorPrimary: '#78350f', colorPrimaryHover: '#92400e', colorPrimaryActive: '#451a03',
    colorBgBase: '#fafaf9', colorText: '#1c1917',
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    colorLink: '#92400e', colorLinkHover: '#78350f',
  },
  components: {
    Button: { borderRadius: 10 }, Input: { borderRadius: 10 }, Select: { borderRadius: 10 },
    Tag: { borderRadius: 6 }, Card: { borderRadius: 16 },
    Carousel: { dotHeight: 6, dotWidth: 28 },
  },
};

const AppRoot: React.FC = () => (
  <QueryProvider>
    <ConfigProvider theme={antdTheme} locale={viVN}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  </QueryProvider>
);

export default AppRoot;
