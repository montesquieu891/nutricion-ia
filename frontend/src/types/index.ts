// User and Authentication Types
export interface User {
  id: number;
  nombre: string;
  email: string;
  objetivo_calorias?: number | null;
}

export interface UserRegister {
  nombre: string;
  email: string;
  password: string;
  password_confirm: string;
  objetivo_calorias?: number;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Dieta Types
export interface Dieta {
  id: number;
  user_id: number;
  nombre: string;
  descripcion?: string | null;
  pdf_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DietaCreate {
  nombre: string;
  descripcion?: string;
  pdf_url?: string;
}

export interface DietaUpdate {
  nombre?: string;
  descripcion?: string;
  pdf_url?: string;
}

export interface GenerarDietaRequest {
  objetivo_calorias: number;
  preferencias?: string[];
  restricciones?: string[];
  dias?: number;
}

export interface GenerarDietaResponse {
  id: number;
  user_id: number;
  nombre: string;
  descripcion: string;
  plan_completo: Record<string, any>;
  calorias_totales?: number;
  proteina_total?: number;
  carbohidratos_total?: number;
  grasas_total?: number;
}

// Receta Types
export interface Receta {
  id: number;
  user_id: number;
  nombre: string;
  descripcion?: string | null;
  ingredientes?: Record<string, any> | null;
  instrucciones?: string | null;
  calorias?: number | null;
  proteina?: number | null;
  carbohidratos?: number | null;
  grasas?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface RecetaCreate {
  nombre: string;
  descripcion?: string;
  ingredientes?: Record<string, any>;
  instrucciones?: string;
  calorias?: number;
  proteina?: number;
  carbohidratos?: number;
  grasas?: number;
}

export interface RecetaUpdate {
  nombre?: string;
  descripcion?: string;
  ingredientes?: Record<string, any>;
  instrucciones?: string;
  calorias?: number;
  proteina?: number;
  carbohidratos?: number;
  grasas?: number;
}

export interface GenerarRecetaRequest {
  objetivo_calorias?: number;
  ingredientes_deseados?: string[];
  tipo_comida?: string;
  restricciones?: string[];
}

export interface GenerarRecetaResponse {
  id: number;
  user_id: number;
  nombre: string;
  descripcion: string;
  ingredientes: Record<string, any>;
  instrucciones: string;
  tiempo_preparacion?: string;
  porciones?: number;
  calorias?: number;
  proteina?: number;
  carbohidratos?: number;
  grasas?: number;
}

// Alimento Types
export interface Alimento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  url: string;
  calorias?: number | null;
  proteina?: number | null;
  carbohidratos?: number | null;
  grasas?: number | null;
}

// API Response Types
export interface APIError {
  detail: string;
  status?: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
