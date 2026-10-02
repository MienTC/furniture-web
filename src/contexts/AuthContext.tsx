import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '~/types';
import { storageService } from '~/services/storageService';
import { AuthService } from '~/services/v1/auth.service';
import { message } from 'antd';

const authService = new AuthService();

interface AuthContextType {
  user: User | null;
  login: (role: 'customer' | 'admin') => Promise<void>;
  loginWithCredentials: (loginName: string, password: string) => Promise<boolean>;
  register: (data: { s_user: string; email: string; s_PWD: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getUser());

  useEffect(() => {
    const token = localStorage.getItem('luxdecor_access_token');
    if (token && !user) {
      authService.getMe()
        .then((fetchedUser) => {
          setUser(fetchedUser);
          storageService.saveUser(fetchedUser);
        })
        .catch(() => {
          localStorage.removeItem('luxdecor_access_token');
          localStorage.removeItem('luxdecor_refresh_token');
          storageService.saveUser(null);
        });
    }
  }, []);

  const loginWithCredentials = async (loginName: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(loginName, password);
      localStorage.setItem('luxdecor_access_token', data.access_token);
      localStorage.setItem('luxdecor_refresh_token', data.refresh_token);

      setUser(data.user);
      storageService.saveUser(data.user);
      message.success(`Đăng nhập thành công! Chào mừng ${data.user.name}`);
      return true;
    } catch (err: any) {
      message.error(err.message || 'Đăng nhập thất bại');
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
      message.success(`Đăng ký tài khoản thành công! Chào mừng ${res.user.name}`);
      return true;
    } catch (err: any) {
      message.error(err.message || 'Đăng ký thất bại');
      return false;
    }
  };

  const login = async (role: 'customer' | 'admin') => {
    const username = role === 'admin' ? 'admin' : 'customer';
    const password = role === 'admin' ? 'Admin@123456' : 'Customer@123456';
    await loginWithCredentials(username, password);
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('luxdecor_access_token');
    localStorage.removeItem('luxdecor_refresh_token');
    setUser(null);
    storageService.saveUser(null);
    message.info('Đã đăng xuất tài khoản');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithCredentials,
        register,
        logout,
        isAdmin: user?.role === 'admin',
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
