/**
 * Service for User operations
 */

import { apiClient } from './api';
import { User } from '@/types';
import { AxiosError } from 'axios';

export const usersService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/api/v1/auth/me');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al obtener perfil');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (id: number, data: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.put(`/api/v1/users/${id}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al actualizar perfil');
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/v1/users/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al eliminar cuenta');
    }
  },
};
