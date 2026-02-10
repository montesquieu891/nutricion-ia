'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardBody, Loading, Skeleton } from '@/components/Common';
import { dietaApi, recetasApi } from '@/services/api';
import { Dieta, Receta } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDietas: 0,
    totalRecetas: 0,
  });
  const [recentDietas, setRecentDietas] = useState<Dieta[]>([]);
  const [recentRecetas, setRecentRecetas] = useState<Receta[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dietas and recetas
        const [dietasRes, recetasRes] = await Promise.all([
          dietaApi.listar(0, 5),
          recetasApi.listar(0, 5),
        ]);
        
        setRecentDietas(dietasRes.data);
        setRecentRecetas(recetasRes.data);
        
        setStats({
          totalDietas: dietasRes.data.length,
          totalRecetas: recetasRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <Loading text="Cargando dashboard..." />;
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gestiona tus dietas y recetas personalizadas con IA
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card padding="md" className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Dietas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDietas}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="md" className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recetas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecetas}</p>
            </div>
          </div>
        </Card>
        
        <Card padding="md" className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">IA Generador</p>
              <Link href="/dashboard/generar" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                Crear ahora →
              </Link>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Acciones Rápidas
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/dietas/new"
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-center"
            >
              <svg className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-white">Nueva Dieta</p>
            </Link>
            
            <Link
              href="/dashboard/recetas/new"
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors text-center"
            >
              <svg className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-white">Nueva Receta</p>
            </Link>
            
            <Link
              href="/dashboard/alimentos"
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-500 transition-colors text-center"
            >
              <svg className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-white">Buscar Alimento</p>
            </Link>
            
            <Link
              href="/dashboard/generar"
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-center"
            >
              <svg className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-white">Generar con IA</p>
            </Link>
          </div>
        </CardBody>
      </Card>
      
      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dietas Recientes
              </h2>
              <Link href="/dashboard/dietas" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {recentDietas.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tienes dietas aún. ¡Crea tu primera dieta!
              </p>
            ) : (
              <div className="space-y-3">
                {recentDietas.map((dieta) => (
                  <Link
                    key={dieta.id}
                    href={`/dashboard/dietas/${dieta.id}`}
                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">{dieta.nombre}</h3>
                    {dieta.descripcion && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {dieta.descripcion}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recetas Recientes
              </h2>
              <Link href="/dashboard/recetas" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {recentRecetas.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tienes recetas aún. ¡Crea tu primera receta!
              </p>
            ) : (
              <div className="space-y-3">
                {recentRecetas.map((receta) => (
                  <Link
                    key={receta.id}
                    href={`/dashboard/recetas/${receta.id}`}
                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">{receta.nombre}</h3>
                    {receta.calorias && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {receta.calorias} calorías
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
