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
import { AdminOrderDetailPage } from '~/features/admin/pages/AdminOrderDetailPage';
import { AdminUsersPage } from '~/features/admin/pages/AdminUsersPage';
import { AdminCategoriesPage } from '~/features/admin/pages/AdminCategoriesPage';
import { AdminBannersPage } from '~/features/admin/pages/AdminBannersPage';
import { AdminVouchersPage } from '~/features/admin/pages/AdminVouchersPage';
import { AdminReviewsPage } from '~/features/admin/pages/AdminReviewsPage';
import { AdminPaymentSettingsPage } from '~/features/admin/pages/AdminPaymentSettingsPage';
import { AdminContactSettingsPage } from '~/features/admin/pages/AdminContactSettingsPage';
import { AdminLoginPage } from '~/features/admin/pages/AdminLoginPage';
import { AdminFlashSalePage } from '~/features/admin/pages/AdminFlashSalePage';
import { useAuth } from '~/contexts/AuthContext';
import { Spin } from 'antd';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Spin size="large" tip="Đang kiểm tra quyền quản trị..." />
      </div>
    );
  }

  if (!adminUser && !localStorage.getItem('luxdecor_admin_token')) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

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
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'orders/:id', element: <AdminOrderDetailPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'banners', element: <AdminBannersPage /> },
      { path: 'vouchers', element: <AdminVouchersPage /> },
      { path: 'reviews', element: <AdminReviewsPage /> },
      { path: 'flash-sale', element: <AdminFlashSalePage /> },
      { path: 'flash_sale', element: <Navigate to="/admin/flash-sale" replace /> },
      { path: 'payment-settings', element: <AdminPaymentSettingsPage /> },
      { path: 'contact-settings', element: <AdminContactSettingsPage /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

const AppRoutes: React.FC = () => <RouterProvider router={router} />;

export default AppRoutes;
