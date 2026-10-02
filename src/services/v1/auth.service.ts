import instanceBE from './instance';
import type { ResponseAPI, User } from '~/types';

export class AuthService {
  async login(loginName: string, password: string): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const res = await instanceBE.post<any, ResponseAPI<{ user: any; access_token: string; refresh_token: string }>>('/auth/login', {
      loginName,
      password,
    });
    const u = res.data.user;
    const mappedUser: User = {
      id: u._id || u.s_ID || u.id,
      name: u.s_user || u.name || u.email,
      email: u.email,
      avatar: u.avatar_url || u.avatar || '',
      role: u.role || 'customer',
      phone: u.phone || '',
      s_ID: u.s_ID,
      s_user: u.s_user,
      avatar_url: u.avatar_url,
    };
    return {
      ...res.data,
      user: mappedUser,
    };
  }

  async register(data: { s_user: string; email: string; s_PWD: string; phone?: string }): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const res = await instanceBE.post<any, ResponseAPI<{ user: any; access_token: string; refresh_token: string }>>('/auth/register', data);
    const u = res.data.user;
    const mappedUser: User = {
      id: u._id || u.s_ID || u.id,
      name: u.s_user || u.name || u.email,
      email: u.email,
      avatar: u.avatar_url || u.avatar || '',
      role: u.role || 'customer',
      phone: u.phone || '',
      s_ID: u.s_ID,
      s_user: u.s_user,
      avatar_url: u.avatar_url,
    };
    return {
      ...res.data,
      user: mappedUser,
    };
  }

  async getMe(): Promise<User> {
    const res = await instanceBE.get<any, ResponseAPI<any>>('/auth/me');
    const u = res.data;
    return {
      id: u._id || u.s_ID || u.id,
      name: u.s_user || u.name || u.email,
      email: u.email,
      avatar: u.avatar_url || u.avatar || '',
      role: u.role || 'customer',
      phone: u.phone || '',
      s_ID: u.s_ID,
      s_user: u.s_user,
      avatar_url: u.avatar_url,
    };
  }

  async logout(): Promise<void> {
    try {
      await instanceBE.post('/auth/logout');
    } catch {
      // Ignore
    }
  }
}
