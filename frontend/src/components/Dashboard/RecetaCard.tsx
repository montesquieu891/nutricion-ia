'use client';

import React from 'react';
import Link from 'next/link';
import { Receta } from '@/types';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { formatDate, formatMacro } from '@/utils/helpers';

interface RecetaCardProps {
  receta: Receta;
  onDelete: (id: number) => void;
}

export const RecetaCard: React.FC<RecetaCardProps> = ({ receta, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
      onDelete(receta.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div>
          <Link
            href={`/dashboard/recetas/${receta.id}/view`}
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {receta.nombre}
          </Link>
          {receta.descripcion && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {receta.descripcion}
            </p>
          )}
        </div>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <p className="text-gray-500 dark:text-gray-400">Calorías</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatMacro(receta.calorias, ' kcal')}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <p className="text-gray-500 dark:text-gray-400">Proteína</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatMacro(receta.proteina)}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <p className="text-gray-500 dark:text-gray-400">Carbos</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatMacro(receta.carbohidratos)}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <p className="text-gray-500 dark:text-gray-400">Grasas</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatMacro(receta.grasas)}
            </p>
          </div>
        </div>

        {receta.created_at && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Creada: {formatDate(receta.created_at)}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard/recetas/${receta.id}`} className="flex-1">
            <Button size="sm" variant="secondary" fullWidth>
              Editar
            </Button>
          </Link>
          <Link href={`/dashboard/recetas/${receta.id}/view`} className="flex-1">
            <Button size="sm" variant="ghost" fullWidth>
              Ver
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            className="flex-shrink-0"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
};
