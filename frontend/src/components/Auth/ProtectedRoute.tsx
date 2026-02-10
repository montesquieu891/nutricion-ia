'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/Common';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading) {
    return <Loading fullScreen text="Verificando autenticación..." />;
  }
  
  if (!isAuthenticated) {
    return <Loading fullScreen text="Redirigiendo..." />;
  }
  
  return <>{children}</>;
};
