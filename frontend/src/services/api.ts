import axios from 'axios';
import * as authService from '@/auth/services/AuthService';
import type { RefreshResponse } from '@/types/auth';

// Function to determine the appropriate API base URL
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // If no env URL is set, use default
  if (!envUrl) {
    return 'http://192.168.1.119:3000';
  }
  
  // If we're on HTTPS and the API URL is HTTP, we have a mixed content issue
  if (window.location.protocol === 'https:' && envUrl.startsWith('http://')) {
    console.warn('Mixed content detected: Frontend is HTTPS but API is HTTP');
    console.warn('Consider setting up HTTPS for your API or using a reverse proxy');
    
    // For development, you might want to try HTTPS version
    // but in production, this should be properly configured
    const httpsUrl = envUrl.replace('http://', 'https://');
    console.log(`Attempting HTTPS API URL: ${httpsUrl}`);
    return httpsUrl;
  }
  
  return envUrl;
};

// Create a fallback mechanism for mixed content issues
const createApiInstance = () => {
  const baseURL = getApiBaseUrl();
  
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });
  
  // Add an interceptor to handle mixed content errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If we get a network error and we're using HTTPS API with HTTP fallback
      if (error.code === 'ERR_NETWORK' && baseURL.startsWith('https://')) {
        const httpUrl = baseURL.replace('https://', 'http://');
        console.warn(`HTTPS API failed, this might be due to mixed content policy`);
        console.warn(`Original URL: ${baseURL}`);
        console.warn(`Consider using: ${httpUrl} in development or setting up proper HTTPS`);
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
};

const api = createApiInstance();

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token); // Persist token securely
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken'); // Remove token from storage
  }
};

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log('[API Interceptor] Attempting token refresh...');
      console.log('[API Interceptor] Original request:', originalRequest);

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('[API Interceptor] No refresh token found in localStorage.');
        }
        const response = await authService.refreshAccessToken({ refreshToken });
        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setAccessToken(null);
        console.error('[API Interceptor] Token refresh failed:', err);

        // Redirect to login page on token refresh failure
        // window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    console.error('[API] No refresh token found in localStorage.');
    throw new Error('[API] No refresh token found in localStorage.');
  }

  console.log('[API] Sending refresh token in request body:', refreshToken);

  const response = await api.post<RefreshResponse>('/auth/refresh', { refreshToken });

  if (response.data.success && response.data.data?.accessToken) {
    console.log('[API] Access token refreshed successfully.');
    setAccessToken(response.data.data.accessToken);
  } else {
    console.warn('[API] Refresh response did not contain a new access token.');
  }

  return response.data;
};

export default api;