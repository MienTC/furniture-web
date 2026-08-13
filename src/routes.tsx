import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '~/components/layout/MainLayout';
import { AdminLayout } from '~/components/layout/AdminLayout';
import { HomePage } from '~/features/home/pages/HomePage';
import { ProductListPage } from '~/features/products/pages/ProductListPage';
import { ProductDetailPage } from '~/features/products/pages/ProductDetailPage';
import { CartPage } from '~/features/cart/pages/CartPage';
import { CheckoutPage } from '~/features/checkout/pages/CheckoutPage';
import { OrderListPage } from '~/features/orders/pages/OrderListPage';
import { OrderDetailPage } from '~/features/orders/pages/OrderDetailPage';
import { WishlistPage } from '~/features/wishlist/pages/WishlistPage';
import { AdminDashboardPage } from '~/features/admin/pages/AdminDashboardPage';
import { AdminProductsPage } from '~/features/admin/pages/AdminProductsPage';
import { AdminOrdersPage } from '~/features/admin/pages/AdminOrdersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrderListPage /> },
      { path: 'orders/:orderId', element: <OrderDetailPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

const AppRoutes: React.FC = () => <RouterProvider router={router} />;

export default AppRoutes;
