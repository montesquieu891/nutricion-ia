'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card, Alert } from '@/components/Common';
import { UserLogin } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<UserLogin>({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Accede a tu cuenta de Nutrición IA
        </p>
      </div>
      
      {error && (
        <Alert type="error" className="mb-4" onClose={clearError}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          placeholder="tu@email.com"
          required
          autoComplete="email"
        />
        
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Iniciar Sesión
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </Card>
  );
}
