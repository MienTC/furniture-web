import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '~/types';
import { storageService } from '~/services/storageService';
import { AuthService } from '~/services/v1/auth.service';
import { message } from 'antd';

const authService = new AuthService();

interface AuthContextType {
  user: User | null;
  login: (role: 'customer' | 'admin') => Promise<void>;
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

  const login = async (role: 'customer' | 'admin') => {
    try {
      const username = role === 'admin' ? 'admin' : 'customer';
      const password = role === 'admin' ? 'Admin@123456' : 'Customer@123456';

      const data = await authService.login(username, password);
      localStorage.setItem('luxdecor_access_token', data.access_token);
      localStorage.setItem('luxdecor_refresh_token', data.refresh_token);

      setUser(data.user);
      storageService.saveUser(data.user);
      message.success(`Đã đăng nhập thành công với tư cách ${data.user.name} (${data.user.role.toUpperCase()})`);
    } catch (err: any) {
      message.error(err.message || 'Đăng nhập thất bại');
    }
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
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
