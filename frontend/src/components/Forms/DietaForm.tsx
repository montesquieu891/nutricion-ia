'use client';

import React, { useState, useEffect } from 'react';
import { Dieta, DietaCreate, DietaUpdate } from '@/types';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';
import { validateRequired } from '@/utils/helpers';

interface DietaFormProps {
  dieta?: Dieta | null;
  onSubmit: (data: DietaCreate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const DietaForm: React.FC<DietaFormProps> = ({
  dieta,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    objetivo_calorias: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    objetivo_calorias: '',
  });

  useEffect(() => {
    if (dieta) {
      setFormData({
        nombre: dieta.nombre || '',
        descripcion: dieta.descripcion || '',
        objetivo_calorias: '',
      });
    }
  }, [dieta]);

  const validate = (): boolean => {
    const newErrors = {
      nombre: '',
      descripcion: '',
      objetivo_calorias: '',
    };

    if (!validateRequired(formData.nombre)) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.objetivo_calorias && isNaN(Number(formData.objetivo_calorias))) {
      newErrors.objetivo_calorias = 'Debe ser un número válido';
    }

    if (formData.objetivo_calorias && Number(formData.objetivo_calorias) < 0) {
      newErrors.objetivo_calorias = 'Debe ser un número positivo';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data: DietaCreate = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || undefined,
    };

    await onSubmit(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
        required
        placeholder="Ej: Dieta Mediterránea"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className={`
            block w-full px-3 py-2 
            rounded-lg border 
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-offset-0
            border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600
            disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
            transition-smooth
          `}
          placeholder="Describe tu dieta..."
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.descripcion}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" loading={loading} fullWidth>
          {dieta ? 'Actualizar Dieta' : 'Crear Dieta'}
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
