/**
 * Hook for managing Dietas state
 */

import { useState, useEffect, useCallback } from 'react';
import { Dieta, DietaCreate, DietaUpdate } from '@/types';
import { dietasService } from '@/services/dietas';
import { useToast } from './useToast';

export const useDietas = () => {
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  /**
   * Fetch dietas list
   */
  const fetchDietas = useCallback(async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dietasService.getDietas(skip, limit);
      setDietas(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Create new dieta
   */
  const createDieta = useCallback(async (data: DietaCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newDieta = await dietasService.createDieta(data);
      setDietas((prev) => [newDieta, ...prev]);
      toast.success('Dieta creada exitosamente');
      return newDieta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear dieta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Update existing dieta
   */
  const updateDieta = useCallback(async (id: number, data: DietaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDieta = await dietasService.updateDieta(id, data);
      setDietas((prev) =>
        prev.map((dieta) => (dieta.id === id ? updatedDieta : dieta))
      );
      toast.success('Dieta actualizada exitosamente');
      return updatedDieta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar dieta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Delete dieta
   */
  const deleteDieta = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await dietasService.deleteDieta(id);
      setDietas((prev) => prev.filter((dieta) => dieta.id !== id));
      toast.success('Dieta eliminada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar dieta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    dietas,
    loading,
    error,
    fetchDietas,
    createDieta,
    updateDieta,
    deleteDieta,
  };
};
