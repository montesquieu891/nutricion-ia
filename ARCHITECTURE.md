# Arquitectura del Proyecto - Nutricion IA

## Visión General

Nutricion IA es una aplicación full-stack diseñada para gestionar dietas y recetas utilizando inteligencia artificial. La arquitectura sigue un patrón de separación clara entre frontend y backend, con una API REST como punto de comunicación.

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        Cliente Web                           │
│                    (Next.js + React)                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                     (FastAPI)                                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │  Services    │  │    Models    │     │
│  │  (Endpoints) │→ │  (Business   │→ │  (Database)  │     │
│  │              │  │   Logic)     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │   OpenAI API │  │   External   │
│   Database   │  │              │  │   Services   │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Componentes Principales

### 1. Frontend (Next.js)

**Ubicación**: `/frontend`

**Tecnologías**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Axios para comunicación HTTP

**Estructura**:
```
frontend/
├── src/
│   ├── app/           # Rutas y páginas (App Router)
│   │   ├── layout.tsx # Layout principal
│   │   └── page.tsx   # Página principal
│   ├── components/    # Componentes React reutilizables
│   ├── services/      # Cliente API y lógica de comunicación
│   │   └── api.ts     # Cliente Axios configurado
│   └── utils/         # Funciones auxiliares
│       └── helpers.ts # Helpers generales
├── package.json
├── next.config.js     # Configuración de Next.js
└── tsconfig.json      # Configuración de TypeScript
```

**Responsabilidades**:
- Renderizado de interfaz de usuario
- Gestión del estado de la aplicación
- Comunicación con el backend via API REST
- Validación de formularios del lado del cliente

### 2. Backend (FastAPI)

**Ubicación**: `/backend`

**Tecnologías**:
- FastAPI 0.109.0
- SQLAlchemy 2.0 (ORM)
- PostgreSQL (Base de datos)
- Pydantic (Validación de datos)
- OpenAI API (Inteligencia Artificial)

**Estructura**:
```
backend/
├── app/
│   ├── api/
│   │   └── routes/       # Endpoints de la API
│   │       ├── dieta.py  # Rutas de dietas
│   │       └── recetas.py # Rutas de recetas
│   ├── services/         # Lógica de negocio
│   │   ├── dieta_service.py
│   │   └── receta_service.py
│   ├── models/           # Modelos de base de datos
│   │   └── dieta.py      # Modelos de Dieta y Receta
│   ├── db/               # Configuración de base de datos
│   │   └── session.py    # Sesiones y conexión
│   ├── utils/            # Utilidades
│   ├── main.py           # Punto de entrada de la aplicación
│   └── config.py         # Configuración y variables de entorno
├── Dockerfile
└── requirements.txt
```

**Responsabilidades**:
- Exposición de API REST
- Validación de datos de entrada
- Lógica de negocio
- Persistencia de datos
- Integración con servicios externos (OpenAI)

### 3. Base de Datos (PostgreSQL)

**Tecnología**: PostgreSQL 15

**Modelos Principales**:

1. **Dieta**
   - `id`: Identificador único
   - `nombre`: Nombre de la dieta
   - `descripcion`: Descripción detallada
   - `calorias_objetivo`: Objetivo calórico
   - `created_at`, `updated_at`: Timestamps

2. **Receta**
   - `id`: Identificador único
   - `nombre`: Nombre de la receta
   - `descripcion`: Descripción
   - `ingredientes`: Lista de ingredientes (JSON)
   - `instrucciones`: Pasos de preparación
   - `tiempo_preparacion`: Tiempo en minutos
   - `calorias`: Contenido calórico
   - `created_at`, `updated_at`: Timestamps

### 4. Infraestructura (Docker)

**Docker Compose** orquesta tres servicios:

1. **db**: Contenedor PostgreSQL
2. **backend**: Contenedor FastAPI
3. **frontend**: Contenedor Next.js

**Configuración**: `/docker-compose.yml`

## Flujo de Datos

### Ejemplo: Crear una Dieta

1. **Usuario** completa el formulario en el frontend
2. **Frontend** valida los datos y envía POST a `/api/v1/dieta/`
3. **Backend Router** (`dieta.py`) recibe la petición
4. **Backend Service** (`dieta_service.py`) procesa la lógica de negocio
5. **Model/DB** persiste los datos en PostgreSQL
6. **Response** devuelve la dieta creada al frontend
7. **Frontend** actualiza la UI con los datos recibidos

### Ejemplo: Generar Dieta con IA

1. **Usuario** solicita generar dieta con parámetros
2. **Frontend** envía POST a `/api/v1/dieta/generar`
3. **Backend Router** recibe la petición
4. **Backend Service** prepara el prompt y llama a OpenAI API
5. **OpenAI API** genera la dieta basada en parámetros
6. **Backend** procesa y guarda la respuesta
7. **Response** devuelve la dieta generada
8. **Frontend** muestra la dieta al usuario

## Patrones de Diseño

### Backend

1. **Layered Architecture**: Separación clara entre rutas, servicios y modelos
2. **Dependency Injection**: FastAPI maneja las dependencias (ej: sesiones DB)
3. **Repository Pattern**: Abstracción de acceso a datos
4. **DTO Pattern**: Pydantic models para transferencia de datos

### Frontend

1. **Component-Based**: Componentes React reutilizables
2. **Service Layer**: Separación de lógica de API
3. **Utility Functions**: Helpers para operaciones comunes

## Seguridad

### Implementaciones Actuales
- CORS configurado para orígenes específicos
- Validación de datos con Pydantic
- Variables de entorno para secretos

### Pendientes (Futuras Implementaciones)
- Autenticación JWT
- Rate limiting
- HTTPS en producción
- Sanitización de inputs
- Encriptación de datos sensibles

## Escalabilidad

### Consideraciones para Futuro Crecimiento

1. **Backend**:
   - Caché con Redis
   - Background tasks con Celery
   - Load balancing
   - Microservicios si es necesario

2. **Frontend**:
   - CDN para assets estáticos
   - Server-side rendering optimizado
   - Code splitting

3. **Base de Datos**:
   - Índices optimizados
   - Réplicas de lectura
   - Particionamiento de tablas grandes

## Testing

### Backend
- Tests unitarios con pytest
- Tests de integración para endpoints
- Tests de modelos de base de datos

### Frontend
- Tests de componentes con Jest
- Tests E2E con Playwright
- Tests de integración de API

## Deployment

### Desarrollo
- Docker Compose para ambiente local
- Hot reload en backend y frontend

### Producción (Recomendado)
- **Backend**: Railway, Render, o AWS ECS
- **Frontend**: Vercel, Netlify, o AWS Amplify
- **Base de Datos**: AWS RDS, Railway Postgres
- **CI/CD**: GitHub Actions

## Monitoreo y Logging

### Futuras Implementaciones
- Logging estructurado
- Métricas de performance
- Error tracking (Sentry)
- Application Performance Monitoring (APM)

## Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
ENVIRONMENT=development|production
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Conclusión

Esta arquitectura proporciona una base sólida y escalable para Nutricion IA. La separación de responsabilidades, el uso de tecnologías modernas, y la consideración de mejores prácticas permiten un desarrollo ágil y mantenible.