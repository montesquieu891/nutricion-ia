/**
 * Service for Receta CRUD operations
 */

import { recetasApi } from './api';
import { Receta, RecetaCreate, RecetaUpdate } from '@/types';
import { AxiosError } from 'axios';

export const recetasService = {
  /**
   * Get list of recetas with pagination
   */
  getRecetas: async (skip = 0, limit = 10): Promise<Receta[]> => {
    try {
      const response = await recetasApi.listar(skip, limit);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al obtener recetas');
    }
  },

  /**
   * Get single receta by ID
   */
  getReceta: async (id: number): Promise<Receta> => {
    try {
      const response = await recetasApi.obtener(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al obtener receta');
    }
  },

  /**
   * Create new receta
   */
  createReceta: async (data: RecetaCreate): Promise<Receta> => {
    try {
      const response = await recetasApi.crear(data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al crear receta');
    }
  },

  /**
   * Update existing receta
   */
  updateReceta: async (id: number, data: RecetaUpdate): Promise<Receta> => {
    try {
      const response = await recetasApi.actualizar(id, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al actualizar receta');
    }
  },

  /**
   * Delete receta
   */
  deleteReceta: async (id: number): Promise<void> => {
    try {
      await recetasApi.eliminar(id);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al eliminar receta');
    }
  },
};
