'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dietaApi } from '@/services/api';
import { Card } from '@/components/Common/Card';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';
import { useToast } from '@/hooks/useToast';

export default function GenerarDietaPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    objetivo_calorias: '',
    dias: '7',
  });
  const [preferencias, setPreferencias] = useState<string[]>([]);
  const [restricciones, setRestricciones] = useState<string[]>([]);

  const preferenciasOpciones = [
    'vegetales', 'pescado', 'carne', 'frutas', 'lácteos', 'granos', 'legumbres'
  ];

  const restriccionesOpciones = [
    'sin gluten', 'sin lactosa', 'vegano', 'vegetariano', 'sin azúcar', 'bajo en sodio'
  ];

  const toggleOption = (option: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(option)) {
      setter(list.filter(item => item !== option));
    } else {
      setter([...list, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.objetivo_calorias) {
      toast.error('Debes especificar el objetivo de calorías');
      return;
    }

    setLoading(true);
    try {
      const response = await dietaApi.generar({
        objetivo_calorias: Number(formData.objetivo_calorias),
        preferencias: preferencias.length > 0 ? preferencias : undefined,
        restricciones: restricciones.length > 0 ? restricciones : undefined,
        dias: Number(formData.dias),
      });

      toast.success('¡Dieta generada exitosamente!');
      router.push(`/dashboard/dietas/${response.data.id}/view`);
    } catch (error) {
      console.error('Error generating diet:', error);
      toast.error('Error al generar la dieta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Generar Dieta con IA
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Crea una dieta personalizada usando inteligencia artificial
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
              label="Objetivo de Calorías"
              type="number"
              value={formData.objetivo_calorias}
              onChange={(e) => setFormData({ ...formData, objetivo_calorias: e.target.value })}
              required
              placeholder="2000"
              helperText="Calorías diarias objetivo"
            />

            <Input
              label="Número de Días"
              type="number"
              value={formData.dias}
              onChange={(e) => setFormData({ ...formData, dias: e.target.value })}
              required
              min="1"
              max="30"
              helperText="Entre 1 y 30 días"
            />
          </div>
        </Card>

        {/* Preferencias */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Preferencias Alimentarias
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {preferenciasOpciones.map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => toggleOption(opcion, preferencias, setPreferencias)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors
                  ${preferencias.includes(opcion)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
                `}
              >
                {opcion}
              </button>
            ))}
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
                onClick={() => toggleOption(opcion, restricciones, setRestricciones)}
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
            🤖 Generar Dieta con IA
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard/dietas')}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
