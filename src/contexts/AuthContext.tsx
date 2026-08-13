import React, { createContext, useContext, useState } from 'react';
import { User } from '~/types';
import { storageService } from '~/services/storageService';
import { MOCK_USERS } from '~/mock/data';
import { message } from 'antd';

interface AuthContextType {
  user: User | null;
  login: (role: 'customer' | 'admin') => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getUser());

  const login = (role: 'customer' | 'admin') => {
    const selected = role === 'admin' ? MOCK_USERS[0] : MOCK_USERS[1];
    setUser(selected);
    storageService.saveUser(selected);
    message.success(`Đã đăng nhập với tư cách ${selected.name} (${selected.role.toUpperCase()})`);
  };

  const logout = () => {
    setUser(null);
    storageService.saveUser(null);
    message.info('Đã đăng xuất tài khoản');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
