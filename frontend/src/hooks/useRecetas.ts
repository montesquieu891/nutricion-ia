/**
 * Hook for managing Recetas state
 */

import { useState, useCallback } from 'react';
import { Receta, RecetaCreate, RecetaUpdate } from '@/types';
import { recetasService } from '@/services/recetas';
import { useToast } from './useToast';

export const useRecetas = () => {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  /**
   * Fetch recetas list
   */
  const fetchRecetas = useCallback(async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recetasService.getRecetas(skip, limit);
      setRecetas(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Create new receta
   */
  const createReceta = useCallback(async (data: RecetaCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newReceta = await recetasService.createReceta(data);
      setRecetas((prev) => [newReceta, ...prev]);
      toast.success('Receta creada exitosamente');
      return newReceta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear receta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Update existing receta
   */
  const updateReceta = useCallback(async (id: number, data: RecetaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedReceta = await recetasService.updateReceta(id, data);
      setRecetas((prev) =>
        prev.map((receta) => (receta.id === id ? updatedReceta : receta))
      );
      toast.success('Receta actualizada exitosamente');
      return updatedReceta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar receta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Delete receta
   */
  const deleteReceta = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await recetasService.deleteReceta(id);
      setRecetas((prev) => prev.filter((receta) => receta.id !== id));
      toast.success('Receta eliminada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar receta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    recetas,
    loading,
    error,
    fetchRecetas,
    createReceta,
    updateReceta,
    deleteReceta,
  };
};
