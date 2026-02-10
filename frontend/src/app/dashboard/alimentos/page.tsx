'use client';

import React, { useState } from 'react';
import { useAlimentos } from '@/hooks/useAlimentos';
import { Input } from '@/components/Common/Input';
import { Card } from '@/components/Common/Card';
import { formatMacro } from '@/utils/helpers';

export default function AlimentosPage() {
  const { resultados, loading, debouncedSearch } = useAlimentos();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Búsqueda de Alimentos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Busca alimentos y consulta su información nutricional
        </p>
      </div>

      {/* Search Input */}
      <Card>
        <Input
          placeholder="Buscar alimentos... (ej: arroz, pollo, manzana)"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Buscando alimentos...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && searchQuery.trim().length === 0 && (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Busca un alimento
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Escribe el nombre de un alimento para ver su información nutricional
            </p>
          </div>
        </Card>
      )}

      {/* No Results */}
      {!loading && searchQuery.trim().length > 0 && resultados.length === 0 && (
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Intenta con otro término de búsqueda
            </p>
          </div>
        </Card>
      )}

      {/* Results Grid */}
      {!loading && resultados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultados.map((alimento) => (
            <Card key={alimento.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {alimento.nombre}
                  </h3>
                  {alimento.descripcion && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alimento.descripcion}
                    </p>
                  )}
                  {alimento.tipo && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {alimento.tipo}
                    </span>
                  )}
                </div>

                {/* Nutritional Info */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Calorías</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMacro(alimento.calorias, ' kcal')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Proteína</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMacro(alimento.proteina)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Carbohidratos</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMacro(alimento.carbohidratos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Grasas</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMacro(alimento.grasas)}
                    </p>
                  </div>
                </div>

                {alimento.url && (
                  <a
                    href={alimento.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Ver más información →
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
