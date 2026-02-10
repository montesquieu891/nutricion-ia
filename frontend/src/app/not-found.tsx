import Link from 'next/link';
import { Button } from '@/components/Common';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Página no encontrada
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Lo sentimos, no pudimos encontrar la página que buscas.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" size="lg">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
