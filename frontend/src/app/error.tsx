'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Common';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">Error</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Algo salió mal
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        {error.message && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            {error.message}
          </p>
        )}
        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="primary" onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
