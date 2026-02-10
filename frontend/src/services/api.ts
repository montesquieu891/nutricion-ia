/**
 * API client for backend communication with JWT authentication
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TokenResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

// Request interceptor: Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, clear everything and redirect to login
        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post<TokenResponse>(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: new_refresh_token } = response.data;
        
        // Save new tokens
        tokenStorage.setTokens(access_token, new_refresh_token);
        
        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: any) => apiClient.post('/api/v1/auth/register', data),
  login: (data: any) => apiClient.post('/api/v1/auth/login', data),
  logout: (refreshToken: string) => apiClient.post('/api/v1/auth/logout', { refresh_token: refreshToken }),
  refresh: (refreshToken: string) => apiClient.post('/api/v1/auth/refresh', { refresh_token: refreshToken }),
  me: () => apiClient.get('/api/v1/auth/me'),
};

// Dieta API
export const dietaApi = {
  listar: (skip = 0, limit = 10) => apiClient.get(`/api/v1/dieta/?skip=${skip}&limit=${limit}`),
  obtener: (id: number) => apiClient.get(`/api/v1/dieta/${id}`),
  crear: (data: any) => apiClient.post('/api/v1/dieta/', data),
  actualizar: (id: number, data: any) => apiClient.put(`/api/v1/dieta/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/api/v1/dieta/${id}`),
  generar: (parametros: any) => apiClient.post('/api/v1/dieta/generar', parametros),
};

// Recetas API
export const recetasApi = {
  listar: (skip = 0, limit = 10) => apiClient.get(`/api/v1/recetas/?skip=${skip}&limit=${limit}`),
  obtener: (id: number) => apiClient.get(`/api/v1/recetas/${id}`),
  crear: (data: any) => apiClient.post('/api/v1/recetas/', data),
  actualizar: (id: number, data: any) => apiClient.put(`/api/v1/recetas/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/api/v1/recetas/${id}`),
  generar: (parametros: any) => apiClient.post('/api/v1/recetas/generar', parametros),
};

// Alimentos API
export const alimentosApi = {
  buscar: (nombre: string) => apiClient.get(`/api/v1/alimentos/buscar?nombre=${encodeURIComponent(nombre)}`),
};

