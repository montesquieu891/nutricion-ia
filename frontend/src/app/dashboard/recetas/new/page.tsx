'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRecetas } from '@/hooks/useRecetas';
import { RecetaForm } from '@/components/Forms/RecetaForm';
import { Card } from '@/components/Common/Card';
import { RecetaCreate } from '@/types';

export default function NewRecetaPage() {
  const router = useRouter();
  const { createReceta, loading } = useRecetas();

  const handleSubmit = async (data: RecetaCreate) => {
    try {
      await createReceta(data);
      router.push('/dashboard/recetas');
    } catch (error) {
      console.error('Error creating receta:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/recetas');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nueva Receta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Crea una nueva receta con sus ingredientes
        </p>
      </div>

      <Card>
        <RecetaForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </Card>
    </div>
  );
}
