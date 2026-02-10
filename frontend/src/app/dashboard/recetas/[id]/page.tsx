'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { recetasService } from '@/services/recetas';
import { useRecetas } from '@/hooks/useRecetas';
import { RecetaForm } from '@/components/Forms/RecetaForm';
import { Card } from '@/components/Common/Card';
import { Receta, RecetaCreate } from '@/types';

export default function EditRecetaPage() {
  const router = useRouter();
  const params = useParams();
  const recetaId = params?.id ? Number(params.id) : 0;
  const { updateReceta, loading: updating } = useRecetas();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReceta = async () => {
      try {
        const data = await recetasService.getReceta(recetaId);
        setReceta(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar receta');
      } finally {
        setLoading(false);
      }
    };

    if (recetaId) {
      loadReceta();
    }
  }, [recetaId]);

  const handleSubmit = async (data: RecetaCreate) => {
    try {
      await updateReceta(recetaId, data);
      router.push('/dashboard/recetas');
    } catch (error) {
      console.error('Error updating receta:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/recetas');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando receta...</p>
        </div>
      </div>
    );
  }

  if (error || !receta) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'No se pudo cargar la receta'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Editar Receta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Modifica los detalles de tu receta
        </p>
      </div>

      <Card>
        <RecetaForm
          receta={receta}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      </Card>
    </div>
  );
}
