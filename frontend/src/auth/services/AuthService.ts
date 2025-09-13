import api, { setAccessToken } from '@/services/api';
import type {
  AuthResponseWithData,
  RefreshResponse,
  AuthMeResponse,
} from '@/types/auth'; 
import type { LoginRequest } from '@/types/LoginRequest';
import type { RegisterRequest } from '@/types/RegisterRequest';
import type { Profile } from '@/types/Profile'; 
import { AxiosError } from 'axios';


export const login = async (data: LoginRequest): Promise<AuthResponseWithData> => {
  const response = await api.post<AuthResponseWithData>('/auth/login', data);
  if (response.data.success && response.data.data?.accessToken) {
    setAccessToken(response.data.data.accessToken);
  }
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponseWithData> => {
  const response = await api.post<AuthResponseWithData>('/auth/register', data);
  if (response.data.success && response.data.data?.accessToken) {
    setAccessToken(response.data.data.accessToken);
  }
  return response.data;
};

export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const response = await api.get<AuthMeResponse>('/auth/me');
    console.log('[AuthService] Full /auth/me response data:', response.data);

    // Adjusted to match the actual response structure
    if (response.data.success && response.data.user) {
      return response.data.user;
    }

    console.warn('[AuthService] Unexpected /auth/me response structure:', response.data);
    return null;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      console.warn('[AuthService] Unauthorized access to /auth/me');
      return null;
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    setAccessToken(null);
  }
};

export const refreshAccessToken = async (data: { refreshToken: string }): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>('/auth/refresh', data);
  if (response.data.success && response.data.data?.accessToken) {
    setAccessToken(response.data.data.accessToken);
  }
  return response.data;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};