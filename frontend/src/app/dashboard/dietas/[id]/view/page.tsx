'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { dietasService } from '@/services/dietas';
import { useDietas } from '@/hooks/useDietas';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Dieta } from '@/types';
import { formatDate } from '@/utils/helpers';

export default function ViewDietaPage() {
  const router = useRouter();
  const params = useParams();
  const dietaId = params?.id ? Number(params.id) : 0;
  const { deleteDieta } = useDietas();
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

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta dieta?')) {
      try {
        await deleteDieta(dietaId);
        router.push('/dashboard/dietas');
      } catch (error) {
        console.error('Error deleting dieta:', error);
      }
    }
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
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'No se pudo cargar la dieta'}
          </p>
          <Link href="/dashboard/dietas" className="mt-4 inline-block">
            <Button variant="secondary">Volver a Dietas</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/dashboard/dietas"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
          >
            ← Volver a Dietas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {dieta.nombre}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/dietas/${dieta.id}`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Dieta Details */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Descripción
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {dieta.descripcion || 'Sin descripción'}
            </p>
          </div>

          {dieta.created_at && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de creación
              </h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {formatDate(dieta.created_at)}
              </p>
            </div>
          )}

          {dieta.updated_at && dieta.updated_at !== dieta.created_at && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Última actualización
              </h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {formatDate(dieta.updated_at)}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Placeholder for recipes */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recetas Asociadas
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No hay recetas asociadas a esta dieta aún.</p>
          <p className="text-sm mt-2">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </Card>
    </div>
  );
}
