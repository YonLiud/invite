import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from './services/AuthService';
import type { Profile } from '@/types/Profile';
import type { AuthData } from '@/types/auth';

interface AuthContextType {
  user: Profile | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        console.log('[AuthProvider] User loaded from /auth/me:', userData);
      } catch (err) {
        console.log('[AuthProvider] No user found or error checking auth status:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await authService.login(data); // Let TS infer or use SuccessResponse<AuthData>
      console.log('[AuthProvider] Login successful, response data:', response);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      console.log('[AuthProvider] Logout successful on backend.');
    } catch (err) {
      console.warn('[AuthProvider] Logout API call failed:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};