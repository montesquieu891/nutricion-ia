'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi, tokenStorage } from '@/services/api';
import { User, TokenResponse, UserLogin, UserRegister } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();
      
      if (accessToken) {
        try {
          // Try to get user info with current token
          const response = await authApi.me();
          setUser(response.data);
        } catch (err) {
          // Token is invalid or expired, clear it
          tokenStorage.clearTokens();
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: UserLogin) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(credentials);
      const tokenData: TokenResponse = response.data;
      
      // Save tokens
      tokenStorage.setTokens(tokenData.access_token, tokenData.refresh_token);
      
      // Get user info
      const userResponse = await authApi.me();
      setUser(userResponse.data);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegister) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(userData);
      const tokenData: TokenResponse = response.data;
      
      // Save tokens
      tokenStorage.setTokens(tokenData.access_token, tokenData.refresh_token);
      
      // Get user info
      const userResponse = await authApi.me();
      setUser(userResponse.data);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al registrar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      // Ignore logout errors
      console.error('Error during logout:', err);
    } finally {
      // Always clear local state and tokens
      tokenStorage.clearTokens();
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
