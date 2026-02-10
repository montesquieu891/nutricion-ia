'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Card } from '@/components/Common/Card';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, loading, updateProfile, deleteAccount } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    objetivo_calorias: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || '',
        objetivo_calorias: profile.objetivo_calorias?.toString() || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        nombre: formData.nombre,
        objetivo_calorias: formData.objetivo_calorias 
          ? Number(formData.objetivo_calorias) 
          : null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await deleteAccount();
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Administra tu información personal
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Información Personal
            </h2>
            {!isEditing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />

              <Input
                label="Objetivo de Calorías (opcional)"
                type="number"
                value={formData.objetivo_calorias}
                onChange={(e) => setFormData({ ...formData, objetivo_calorias: e.target.value })}
                placeholder="2000"
                helperText="Calorías diarias objetivo"
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" loading={loading}>
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    if (profile) {
                      setFormData({
                        nombre: profile.nombre || '',
                        objetivo_calorias: profile.objetivo_calorias?.toString() || '',
                      });
                    }
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Nombre
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {profile?.nombre || user?.nombre}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {profile?.email || user?.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Objetivo de Calorías
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {profile?.objetivo_calorias 
                    ? `${profile.objetivo_calorias} kcal/día` 
                    : 'No establecido'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Security Section */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Seguridad
          </h2>
          
          <div className="space-y-3">
            <Button
              variant="secondary"
              onClick={handleLogout}
              fullWidth
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-300 dark:border-red-700">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Zona de Peligro
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Esta acción no se puede deshacer
            </p>
          </div>
          
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            Eliminar Cuenta
          </Button>
        </div>
      </Card>
    </div>
  );
}
