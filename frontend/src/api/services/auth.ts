import { apiClient } from '../client';
import type { User } from '../../types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login/', credentials),
  
  logout: () =>
    apiClient.post('/auth/logout/'),
  
  getCurrentUser: () =>
    apiClient.get<User>('/auth/me/'),
};