import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from './services/authService'; // Adjust the path if needed
import type { Profile } from '@/types/profile'; // Adjust the path if needed

// Define the shape of our context
interface AuthContextType {
  user: Profile | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean; // To indicate initial auth check
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// The provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check auth status

  // Check if user is already logged in (e.g., valid refresh token)
  useEffect(() => {
    const initAuth = async () => {
      // Even if not logged in, we need to finish the initial check
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
    const response = await authService.login(data);
    console.log('[AuthProvider] Login successful, response:', response);
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      console.log('[AuthProvider] Logout successful on backend.');
    } catch (err) {
      console.warn('[AuthProvider] Logout API call failed (might still clear local state):', err);
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