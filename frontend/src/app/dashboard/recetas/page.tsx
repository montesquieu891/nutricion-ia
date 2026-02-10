'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRecetas } from '@/hooks/useRecetas';
import { RecetaCard } from '@/components/Dashboard/RecetaCard';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Card } from '@/components/Common/Card';
import { debounce } from '@/utils/helpers';

export default function RecetasPage() {
  const { recetas, loading, fetchRecetas, deleteReceta } = useRecetas();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecetas();
  }, [fetchRecetas]);

  // Debounced search
  const filteredRecetas = useMemo(() => {
    if (!searchTerm.trim()) return recetas;
    
    const lowerSearch = searchTerm.toLowerCase();
    return recetas.filter(
      (receta) =>
        receta.nombre.toLowerCase().includes(lowerSearch) ||
        (receta.descripcion && receta.descripcion.toLowerCase().includes(lowerSearch))
    );
  }, [recetas, searchTerm]);

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  if (loading && recetas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando recetas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mis Recetas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra tus recetas favoritas
          </p>
        </div>
        <Link href="/dashboard/recetas/new">
          <Button size="lg">
            + Nueva Receta
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Buscar recetas por nombre o descripción..."
          defaultValue={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Card>

      {/* Recetas Grid */}
      {filteredRecetas.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg
              className="mx-auto h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron recetas' : 'No hay recetas todavía'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Comienza creando tu primera receta'}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/recetas/new">
                <Button>Crear Primera Receta</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecetas.map((receta) => (
            <RecetaCard key={receta.id} receta={receta} onDelete={deleteReceta} />
          ))}
        </div>
      )}
    </div>
  );
}
