/**
 * Hook for managing user profile
 */

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { usersService } from '@/services/users';
import { useToast } from './useToast';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { user } = useAuth();

  /**
   * Load profile data
   */
  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getProfile();
      setProfile(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar perfil';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  /**
   * Update profile
   */
  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await usersService.updateProfile(user.id, data);
      setProfile(updatedProfile);
      toast.success('Perfil actualizado exitosamente');
      return updatedProfile;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  /**
   * Delete account
   */
  const deleteAccount = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      await usersService.deleteAccount(user.id);
      toast.success('Cuenta eliminada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar cuenta';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    deleteAccount,
    refreshProfile: loadProfile,
  };
};
