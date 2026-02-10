'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Receta, RecetaCreate, Ingrediente } from '@/types';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';
import { IngredientRow } from './IngredientRow';
import { validateRequired } from '@/utils/helpers';

interface RecetaFormProps {
  receta?: Receta | null;
  onSubmit: (data: RecetaCreate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const emptyIngredient: Ingrediente = {
  nombre: '',
  cantidad: 0,
  unidad: 'g',
  calorias: 0,
  proteina: 0,
  carbohidratos: 0,
  grasas: 0,
};

export const RecetaForm: React.FC<RecetaFormProps> = ({
  receta,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instrucciones: '',
  });

  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([emptyIngredient]);
  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    instrucciones: '',
  });

  useEffect(() => {
    if (receta) {
      setFormData({
        nombre: receta.nombre || '',
        descripcion: receta.descripcion || '',
        instrucciones: receta.instrucciones || '',
      });
      if (receta.ingredientes && receta.ingredientes.length > 0) {
        setIngredientes(receta.ingredientes);
      }
    }
  }, [receta]);

  // Calculate totals
  const totales = useMemo(() => {
    return ingredientes.reduce(
      (acc, ing) => ({
        calorias: acc.calorias + (ing.calorias || 0),
        proteina: acc.proteina + (ing.proteina || 0),
        carbohidratos: acc.carbohidratos + (ing.carbohidratos || 0),
        grasas: acc.grasas + (ing.grasas || 0),
      }),
      { calorias: 0, proteina: 0, carbohidratos: 0, grasas: 0 }
    );
  }, [ingredientes]);

  const validate = (): boolean => {
    const newErrors = {
      nombre: '',
      descripcion: '',
      instrucciones: '',
    };

    if (!validateRequired(formData.nombre)) {
      newErrors.nombre = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Filter out empty ingredients
    const validIngredientes = ingredientes.filter((ing) => 
      validateRequired(ing.nombre) && ing.cantidad > 0
    );

    const data: RecetaCreate = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || undefined,
      instrucciones: formData.instrucciones || undefined,
      ingredientes: validIngredientes.length > 0 ? validIngredientes : undefined,
      calorias: totales.calorias,
      proteina: totales.proteina,
      carbohidratos: totales.carbohidratos,
      grasas: totales.grasas,
    };

    await onSubmit(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingrediente,
    value: string | number
  ) => {
    setIngredientes((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    );
  };

  const handleAddIngredient = () => {
    setIngredientes((prev) => [...prev, { ...emptyIngredient }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredientes.length > 1) {
      setIngredientes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información Básica
        </h3>
        
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
          placeholder="Ej: Ensalada César"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
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
            placeholder="Breve descripción de la receta..."
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ingredientes
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddIngredient}
          >
            + Agregar Ingrediente
          </Button>
        </div>

        <div className="space-y-3">
          {ingredientes.map((ingrediente, index) => (
            <IngredientRow
              key={index}
              ingrediente={ingrediente}
              index={index}
              onChange={handleIngredientChange}
              onRemove={handleRemoveIngredient}
            />
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Totales Calculados
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Calorías:</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {totales.calorias.toFixed(1)} kcal
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Proteína:</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {totales.proteina.toFixed(1)} g
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Carbohidratos:</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {totales.carbohidratos.toFixed(1)} g
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Grasas:</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {totales.grasas.toFixed(1)} g
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Instrucciones
        </label>
        <textarea
          name="instrucciones"
          value={formData.instrucciones}
          onChange={handleChange}
          rows={6}
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
          placeholder="1. Paso uno...&#10;2. Paso dos...&#10;3. Paso tres..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" loading={loading} fullWidth>
          {receta ? 'Actualizar Receta' : 'Crear Receta'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          fullWidth
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
