/**
 * Hook for searching alimentos
 */

import { useState, useCallback } from 'react';
import { Alimento } from '@/types';
import { alimentosService } from '@/services/alimentos';
import { useToast } from './useToast';
import { debounce } from '@/utils/helpers';

export const useAlimentos = () => {
  const [resultados, setResultados] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  /**
   * Search alimentos
   */
  const searchAlimentos = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResultados([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await alimentosService.searchAlimentos(query);
      setResultados(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al buscar alimentos';
      setError(errorMsg);
      toast.error(errorMsg);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchAlimentos(query);
    }, 500),
    [searchAlimentos]
  );

  return {
    resultados,
    loading,
    error,
    searchAlimentos,
    debouncedSearch,
  };
};
