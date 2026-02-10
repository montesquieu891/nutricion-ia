/**
 * Service for Dieta CRUD operations
 */

import { dietaApi } from './api';
import { Dieta, DietaCreate, DietaUpdate } from '@/types';
import { AxiosError } from 'axios';

export const dietasService = {
  /**
   * Get list of dietas with pagination
   */
  getDietas: async (skip = 0, limit = 10): Promise<Dieta[]> => {
    try {
      const response = await dietaApi.listar(skip, limit);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al obtener dietas');
    }
  },

  /**
   * Get single dieta by ID
   */
  getDieta: async (id: number): Promise<Dieta> => {
    try {
      const response = await dietaApi.obtener(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al obtener dieta');
    }
  },

  /**
   * Create new dieta
   */
  createDieta: async (data: DietaCreate): Promise<Dieta> => {
    try {
      const response = await dietaApi.crear(data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al crear dieta');
    }
  },

  /**
   * Update existing dieta
   */
  updateDieta: async (id: number, data: DietaUpdate): Promise<Dieta> => {
    try {
      const response = await dietaApi.actualizar(id, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al actualizar dieta');
    }
  },

  /**
   * Delete dieta
   */
  deleteDieta: async (id: number): Promise<void> => {
    try {
      await dietaApi.eliminar(id);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al eliminar dieta');
    }
  },
};
