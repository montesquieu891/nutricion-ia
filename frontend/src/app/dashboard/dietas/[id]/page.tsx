'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { dietasService } from '@/services/dietas';
import { useDietas } from '@/hooks/useDietas';
import { DietaForm } from '@/components/Forms/DietaForm';
import { Card } from '@/components/Common/Card';
import { Dieta, DietaCreate, DietaUpdate } from '@/types';

export default function EditDietaPage() {
  const router = useRouter();
  const params = useParams();
  const dietaId = params?.id ? Number(params.id) : 0;
  const { updateDieta, loading: updating } = useDietas();
  const [dieta, setDieta] = useState<Dieta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDieta = async () => {
      try {
        const data = await dietasService.getDieta(dietaId);
        setDieta(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar dieta');
      } finally {
        setLoading(false);
      }
    };

    if (dietaId) {
      loadDieta();
    }
  }, [dietaId]);

  const handleSubmit = async (data: DietaCreate) => {
    try {
      await updateDieta(dietaId, data as DietaUpdate);
      router.push('/dashboard/dietas');
    } catch (error) {
      console.error('Error updating dieta:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/dietas');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando dieta...</p>
        </div>
      </div>
    );
  }

  if (error || !dieta) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'No se pudo cargar la dieta'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Editar Dieta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Modifica tu plan de alimentación
        </p>
      </div>

      <Card>
        <DietaForm
          dieta={dieta}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
        />
      </Card>
    </div>
  );
}
