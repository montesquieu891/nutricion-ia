'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recetasApi } from '@/services/api';
import { Card } from '@/components/Common/Card';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';
import { useToast } from '@/hooks/useToast';

export default function GenerarRecetaPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    objetivo_calorias: '',
    tipo_comida: 'almuerzo',
    ingredientes: '',
  });
  const [restricciones, setRestricciones] = useState<string[]>([]);

  const tipoComidaOpciones = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'cena', label: 'Cena' },
    { value: 'snack', label: 'Snack' },
    { value: 'postre', label: 'Postre' },
  ];

  const restriccionesOpciones = [
    'sin gluten', 'sin lactosa', 'vegano', 'vegetariano', 'sin azúcar', 'bajo en sodio'
  ];

  const toggleRestriction = (restriction: string) => {
    if (restricciones.includes(restriction)) {
      setRestricciones(restricciones.filter(item => item !== restriction));
    } else {
      setRestricciones([...restricciones, restriction]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const ingredientesArray = formData.ingredientes
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const response = await recetasApi.generar({
        objetivo_calorias: formData.objetivo_calorias ? Number(formData.objetivo_calorias) : undefined,
        tipo_comida: formData.tipo_comida,
        ingredientes_deseados: ingredientesArray.length > 0 ? ingredientesArray : undefined,
        restricciones: restricciones.length > 0 ? restricciones : undefined,
      });

      toast.success('¡Receta generada exitosamente!');
      router.push(`/dashboard/recetas/${response.data.id}/view`);
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error('Error al generar la receta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Generar Receta con IA
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Crea una receta personalizada usando inteligencia artificial
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Parameters */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Parámetros Básicos
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Objetivo de Calorías (opcional)"
              type="number"
              value={formData.objetivo_calorias}
              onChange={(e) => setFormData({ ...formData, objetivo_calorias: e.target.value })}
              placeholder="500"
              helperText="Calorías objetivo para la receta"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Comida
              </label>
              <select
                value={formData.tipo_comida}
                onChange={(e) => setFormData({ ...formData, tipo_comida: e.target.value })}
                className={`
                  block w-full px-3 py-2 
                  rounded-lg border 
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  transition-smooth
                `}
              >
                {tipoComidaOpciones.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ingredientes Deseados (opcional)
              </label>
              <textarea
                value={formData.ingredientes}
                onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
                rows={3}
                placeholder="Ej: pollo, arroz, brócoli (separados por comas)"
                className={`
                  block w-full px-3 py-2 
                  rounded-lg border 
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600
                  transition-smooth
                `}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separa los ingredientes con comas
              </p>
            </div>
          </div>
        </Card>

        {/* Restricciones */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Restricciones Dietarias
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {restriccionesOpciones.map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => toggleRestriction(opcion)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors
                  ${restricciones.includes(opcion)
                    ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
                `}
              >
                {opcion}
              </button>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" loading={loading} fullWidth size="lg">
            🤖 Generar Receta con IA
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard/recetas')}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
