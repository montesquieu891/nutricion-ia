'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card, Alert } from '@/components/Common';
import { UserRegister } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<UserRegister>({
    nombre: '',
    email: '',
    password: '',
    password_confirm: '',
    objetivo_calorias: undefined,
  });
  
  const [formErrors, setFormErrors] = useState<{
    nombre?: string;
    email?: string;
    password?: string;
    password_confirm?: string;
    objetivo_calorias?: string;
  }>({});
  
  const validateForm = (): boolean => {
    const errors: any = {};
    
    if (!formData.nombre || formData.nombre.trim().length < 1) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.password_confirm) {
      errors.password_confirm = 'Confirma tu contraseña';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Las contraseñas no coinciden';
    }
    
    if (formData.objetivo_calorias && formData.objetivo_calorias < 0) {
      errors.objetivo_calorias = 'El objetivo debe ser mayor a 0';
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
      await register(formData);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'objetivo_calorias' 
      ? (value === '' ? undefined : parseInt(value, 10))
      : value;
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Únete a Nutrición IA y comienza hoy
        </p>
      </div>
      
      {error && (
        <Alert type="error" className="mb-4" onClose={clearError}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={formErrors.nombre}
          placeholder="Juan Pérez"
          required
          autoComplete="name"
        />
        
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
          helperText="Mínimo 8 caracteres"
          autoComplete="new-password"
        />
        
        <Input
          label="Confirmar Contraseña"
          type="password"
          name="password_confirm"
          value={formData.password_confirm}
          onChange={handleChange}
          error={formErrors.password_confirm}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
        
        <Input
          label="Objetivo de Calorías Diarias (opcional)"
          type="number"
          name="objetivo_calorias"
          value={formData.objetivo_calorias?.toString() || ''}
          onChange={handleChange}
          error={formErrors.objetivo_calorias}
          placeholder="2000"
          helperText="Puedes configurar esto más tarde"
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Crear Cuenta
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </Card>
  );
}
