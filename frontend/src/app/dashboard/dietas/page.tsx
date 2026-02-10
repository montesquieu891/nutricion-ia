'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDietas } from '@/hooks/useDietas';
import { DietaCard } from '@/components/Dashboard/DietaCard';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Card } from '@/components/Common/Card';
import { debounce } from '@/utils/helpers';

export default function DietasPage() {
  const { dietas, loading, fetchDietas, deleteDieta } = useDietas();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDietas();
  }, [fetchDietas]);

  // Debounced search
  const filteredDietas = useMemo(() => {
    if (!searchTerm.trim()) return dietas;
    
    const lowerSearch = searchTerm.toLowerCase();
    return dietas.filter(
      (dieta) =>
        dieta.nombre.toLowerCase().includes(lowerSearch) ||
        (dieta.descripcion && dieta.descripcion.toLowerCase().includes(lowerSearch))
    );
  }, [dietas, searchTerm]);

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  if (loading && dietas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando dietas...</p>
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
            Mis Dietas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra tus planes de alimentación
          </p>
        </div>
        <Link href="/dashboard/dietas/new">
          <Button size="lg">
            + Nueva Dieta
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Buscar dietas por nombre o descripción..."
          defaultValue={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Card>

      {/* Dietas Grid */}
      {filteredDietas.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron dietas' : 'No hay dietas todavía'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Comienza creando tu primera dieta'}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/dietas/new">
                <Button>Crear Primera Dieta</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDietas.map((dieta) => (
            <DietaCard key={dieta.id} dieta={dieta} onDelete={deleteDieta} />
          ))}
        </div>
      )}
    </div>
  );
}
