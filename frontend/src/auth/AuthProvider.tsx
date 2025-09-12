import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from './services/AuthService';
import type { Profile } from '@/types/Profile';
import type { LoginRequest } from '@/types/LoginRequest';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        console.log('[AuthProvider] User loaded from /auth/me:', userData);

        // Navigate to home if user is authenticated
        if (userData) {
          navigate('/');
        }
      } catch (err) {
        console.log('[AuthProvider] No user found or error checking auth status:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = async (data: LoginRequest) => {
    console.log('[AuthProvider] Login function started.');
    try {
      const response = await authService.login(data); // Call login API

      // Store token securely in localStorage
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        console.log('[AuthProvider] Token stored in localStorage.');
      } else {
        console.warn('[AuthProvider] No accessToken received in login response.');
      }

      const userData = await authService.getCurrentUser(); // Fetch user data
      console.log('[AuthProvider] Setting user state to:', userData);
      setUser(userData); // Update user state
      console.log('[AuthProvider] User state set. Login function finished.');
    } catch (err) {
      console.error('[AuthProvider] Login failed:', err);
      throw err; // Propagate error to caller
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