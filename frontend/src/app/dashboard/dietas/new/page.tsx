'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDietas } from '@/hooks/useDietas';
import { DietaForm } from '@/components/Forms/DietaForm';
import { Card } from '@/components/Common/Card';
import { DietaCreate } from '@/types';

export default function NewDietaPage() {
  const router = useRouter();
  const { createDieta, loading } = useDietas();

  const handleSubmit = async (data: DietaCreate) => {
    try {
      await createDieta(data);
      router.push('/dashboard/dietas');
    } catch (error) {
      // Error is handled by the hook
      console.error('Error creating dieta:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/dietas');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nueva Dieta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Crea un nuevo plan de alimentación
        </p>
      </div>

      <Card>
        <DietaForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </Card>
    </div>
  );
}
