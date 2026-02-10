'use client';

import React from 'react';
import Link from 'next/link';
import { Dieta } from '@/types';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { formatDate } from '@/utils/helpers';

interface DietaCardProps {
  dieta: Dieta;
  onDelete: (id: number) => void;
}

export const DietaCard: React.FC<DietaCardProps> = ({ dieta, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de eliminar esta dieta?')) {
      onDelete(dieta.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div>
          <Link
            href={`/dashboard/dietas/${dieta.id}/view`}
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {dieta.nombre}
          </Link>
          {dieta.descripcion && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {dieta.descripcion}
            </p>
          )}
        </div>

        {dieta.created_at && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Creada: {formatDate(dieta.created_at)}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard/dietas/${dieta.id}`} className="flex-1">
            <Button size="sm" variant="secondary" fullWidth>
              Editar
            </Button>
          </Link>
          <Link href={`/dashboard/dietas/${dieta.id}/view`} className="flex-1">
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
