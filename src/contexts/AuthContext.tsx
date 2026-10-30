import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '~/types';
import { storageService } from '~/services/storageService';
import { AuthService } from '~/services/v1/auth.service';
import { toast } from 'react-toastify';

const authService = new AuthService();

interface AuthContextType {
  user: User | null;
  adminUser: User | null;
  login: (role: 'customer' | 'admin') => Promise<void>;
  loginWithCredentials: (loginName: string, password: string) => Promise<boolean>;
  loginAsAdmin: (loginName: string, password: string) => Promise<boolean>;
  register: (data: { s_user: string; email: string; s_PWD: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  logoutAdmin: () => void;
  isAdmin: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getUser());
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    try {
      const data = localStorage.getItem('luxdecor_admin_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    const customerToken = localStorage.getItem('luxdecor_access_token');
    const adminToken = localStorage.getItem('luxdecor_admin_token');

    const initPromises: Promise<any>[] = [];

    if (customerToken) {
      initPromises.push(
        authService.getMe()
          .then((fetchedUser) => {
            setUser(fetchedUser);
            storageService.saveUser(fetchedUser);
          })
          .catch(() => {
            localStorage.removeItem('luxdecor_access_token');
            localStorage.removeItem('luxdecor_refresh_token');
            storageService.saveUser(null);
            setUser(null);
          })
      );
    } else {
      setUser(null);
      storageService.saveUser(null);
    }

    if (adminToken) {
      initPromises.push(
        authService.getMe()
          .then((fetchedUser) => {
            if (fetchedUser.role === 'admin') {
              setAdminUser(fetchedUser);
              localStorage.setItem('luxdecor_admin_user', JSON.stringify(fetchedUser));
            } else {
              localStorage.removeItem('luxdecor_admin_token');
              localStorage.removeItem('luxdecor_admin_refresh_token');
              localStorage.removeItem('luxdecor_admin_user');
              setAdminUser(null);
            }
          })
          .catch(() => {
            localStorage.removeItem('luxdecor_admin_token');
            localStorage.removeItem('luxdecor_admin_refresh_token');
            localStorage.removeItem('luxdecor_admin_user');
            setAdminUser(null);
          })
      );
    } else {
      setAdminUser(null);
    }

    Promise.allSettled(initPromises).finally(() => {
      setIsInitializing(false);
    });
  }, []);

  // Storefront login
  const loginWithCredentials = async (loginName: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(loginName, password);
      localStorage.setItem('luxdecor_access_token', data.access_token);
      localStorage.setItem('luxdecor_refresh_token', data.refresh_token);

      setUser(data.user);
      storageService.saveUser(data.user);
      toast.success(`Đăng nhập thành công! Chào mừng ${data.user.name}`);
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message);
      return false;
    }
  };

  // Dedicated Admin login
  const loginAsAdmin = async (loginName: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(loginName, password);
      if (data.user.role !== 'admin') {
        toast.error('Tài khoản này không có quyền truy cập trang quản trị!');
        return false;
      }

      localStorage.setItem('luxdecor_admin_token', data.access_token);
      localStorage.setItem('luxdecor_admin_refresh_token', data.refresh_token);
      localStorage.setItem('luxdecor_admin_user', JSON.stringify(data.user));

      setAdminUser(data.user);
      toast.success(`Đăng nhập quản trị thành công! Chào mừng ${data.user.name}`);
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message);
      return false;
    }
  };

  const register = async (data: { s_user: string; email: string; s_PWD: string; phone?: string }): Promise<boolean> => {
    try {
      const res = await authService.register(data);
      localStorage.setItem('luxdecor_access_token', res.access_token);
      localStorage.setItem('luxdecor_refresh_token', res.refresh_token);

      setUser(res.user);
      storageService.saveUser(res.user);
      toast.success(`Đăng ký tài khoản thành công! Chào mừng ${res.user.name}`);
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message);
      return false;
    }
  };

  const login = async (_role: 'customer' | 'admin') => {
    toast.warning('Vui lòng nhập tên đăng nhập và mật khẩu chính xác');
  };

  const logout = async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem('luxdecor_access_token');
    localStorage.removeItem('luxdecor_refresh_token');
    setUser(null);
    storageService.saveUser(null);
    toast.info('Đã đăng xuất tài khoản');
  };

  const logoutAdmin = async () => {
    localStorage.removeItem('luxdecor_admin_token');
    localStorage.removeItem('luxdecor_admin_refresh_token');
    localStorage.removeItem('luxdecor_admin_user');
    setAdminUser(null);
    toast.info('Đã đăng xuất tài trị viên');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        login,
        loginWithCredentials,
        loginAsAdmin,
        register,
        logout,
        logoutAdmin,
        isAdmin: !!adminUser || user?.role === 'admin',
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
