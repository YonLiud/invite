// src/auth/services/authService.ts
import api from '@/services/api';
import type {
  AuthResponseWithData,
  RefreshResponse,
} from '@/types/auth'; 
import type { LoginRequest } from '@/types/LoginRequest';
import type { RegisterRequest } from '@/types/RegisterRequest';
import type { Profile } from '@/types/Profile'; 
import type { SuccessResponse } from '@/types/Responses';

export const login = async (data: LoginRequest): Promise<AuthResponseWithData> => {
  const response = await api.post<AuthResponseWithData>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponseWithData> => {
  const response = await api.post<AuthResponseWithData>('/auth/register', data);
  return response.data;
};
export const getCurrentUser = async (): Promise<Profile> => {
  const response = await api.get<SuccessResponse<Profile>>('/auth/me');
  return response.data.data; // Extract profile from `data` field
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>('/auth/refresh');
  return response.data;
};
