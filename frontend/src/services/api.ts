/**
 * API client for backend communication
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dieta API
export const dietaApi = {
  listar: () => apiClient.get('/api/v1/dieta/'),
  obtener: (id: number) => apiClient.get(`/api/v1/dieta/${id}`),
  crear: (data: any) => apiClient.post('/api/v1/dieta/', data),
  generar: (parametros: any) => apiClient.post('/api/v1/dieta/generar', parametros),
};

// Recetas API
export const recetasApi = {
  listar: (skip = 0, limit = 10) => apiClient.get(`/api/v1/recetas/?skip=${skip}&limit=${limit}`),
  obtener: (id: number) => apiClient.get(`/api/v1/recetas/${id}`),
  crear: (data: any) => apiClient.post('/api/v1/recetas/', data),
  buscar: (terminos: any) => apiClient.post('/api/v1/recetas/buscar', terminos),
  generar: (parametros: any) => apiClient.post('/api/v1/recetas/generar', parametros),
};
