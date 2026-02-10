'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/Common';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading) {
    return <Loading fullScreen text="Cargando..." />;
  }
  
  return <Loading fullScreen text="Redirigiendo..." />;
}
