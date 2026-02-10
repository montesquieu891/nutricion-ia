/**
 * Service for Alimentos (food search)
 */

import { alimentosApi } from './api';
import { Alimento } from '@/types';
import { AxiosError } from 'axios';

export const alimentosService = {
  /**
   * Search for alimentos by name
   */
  searchAlimentos: async (nombre: string): Promise<Alimento[]> => {
    try {
      const response = await alimentosApi.buscar(nombre);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      throw new Error(axiosError.response?.data?.detail || 'Error al buscar alimentos');
    }
  },
};
