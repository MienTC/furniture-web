import instanceBE from './instance';
import type { ResponseAPI, User } from '~/types';

export class AuthService {
  async login(username: string, password: string):Promise<{ user: User; access_token: string; refresh_token: string }> {
    const res = await instanceBE.post<any, ResponseAPI<{ user: User; access_token: string; refresh_token: string }>>('/auth/login', {
      username,
      password,
    });
    return res.data;
  }

  async getMe(): Promise<User> {
    const res = await instanceBE.get<any, ResponseAPI<User>>('/auth/me');
    return res.data;
  }

  async logout(): Promise<void> {
    try {
      await instanceBE.post('/auth/logout');
    } catch {
      // Ignore
    }
  }
}
