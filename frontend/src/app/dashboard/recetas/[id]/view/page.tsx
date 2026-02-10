'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { recetasService } from '@/services/recetas';
import { useRecetas } from '@/hooks/useRecetas';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Receta } from '@/types';
import { formatDate, formatMacro } from '@/utils/helpers';

export default function ViewRecetaPage() {
  const router = useRouter();
  const params = useParams();
  const recetaId = params?.id ? Number(params.id) : 0;
  const { deleteReceta } = useRecetas();
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

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
      try {
        await deleteReceta(recetaId);
        router.push('/dashboard/recetas');
      } catch (error) {
        console.error('Error deleting receta:', error);
      }
    }
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
          <Link href="/dashboard/recetas" className="mt-4 inline-block">
            <Button variant="secondary">Volver a Recetas</Button>
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
            href="/dashboard/recetas"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
          >
            ← Volver a Recetas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {receta.nombre}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/recetas/${receta.id}`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Receta Details */}
      <Card>
        <div className="space-y-4">
          {receta.descripcion && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Descripción
              </h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {receta.descripcion}
              </p>
            </div>
          )}

          {/* Macros */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Información Nutricional
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Calorías</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatMacro(receta.calorias, ' kcal')}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Proteína</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatMacro(receta.proteina)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Carbohidratos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatMacro(receta.carbohidratos)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Grasas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatMacro(receta.grasas)}
                </p>
              </div>
            </div>
          </div>

          {receta.created_at && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de creación
              </h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {formatDate(receta.created_at)}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Ingredients */}
      {receta.ingredientes && receta.ingredientes.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ingredientes
          </h2>
          <div className="space-y-2">
            {receta.ingredientes.map((ing, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {ing.nombre}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {ing.cantidad} {ing.unidad}
                  {ing.calorias && ` - ${ing.calorias.toFixed(0)} kcal`}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Instructions */}
      {receta.instrucciones && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Instrucciones
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line text-gray-900 dark:text-white">
              {receta.instrucciones}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
