import api from '@/services/api';
import type { LoginRequest } from '@/types/LoginRequest';
import type { AuthResponse } from '@/types/auth';
import type { Profile } from '@/types/Profile';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<Profile> => {
  const response = await api.get<{ data: Profile }>('/auth/me');
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh');
  return response.data;
};