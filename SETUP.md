# 🚀 Guía de Configuración - Nutrición IA

Esta guía te ayudará a configurar y ejecutar la aplicación Nutrición IA en tu máquina local.

## ✅ Estado del Proyecto

El proyecto está **OPERATIVO** y listo para usar con las siguientes características:

### ✅ Funcionalidades Implementadas
- ✅ **Autenticación completa**: Registro, login, JWT tokens, refresh tokens
- ✅ **CRUD de Dietas**: Crear, leer, actualizar, eliminar dietas
- ✅ **CRUD de Recetas**: Crear, leer, actualizar, eliminar recetas  
- ✅ **Base de datos**: SQLite (desarrollo) con migraciones Alembic
- ✅ **API REST**: FastAPI con documentación automática (Swagger/ReDoc)
- ✅ **Frontend**: Next.js 15 con React 18 y TypeScript

### ⚠️ Funcionalidades que Requieren API Keys
- 🔑 **Generación de dietas con IA**: Requiere OpenAI API Key
- 🔑 **Generación de recetas con IA**: Requiere OpenAI API Key
- 🔑 **Búsqueda de alimentos**: Requiere FatSecret API credentials

**Nota**: La aplicación funciona completamente sin las API keys, pero no podrás usar las funciones de IA.

## 📋 Requisitos Previos

### Opción 1: Con Docker (Recomendado)
- Docker 20.10+
- Docker Compose 2.0+

### Opción 2: Desarrollo Local
- Python 3.11+
- Node.js 18+
- npm 9+

## 🔧 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone https://github.com/montesquieu891/nutricion-ia.git
cd nutricion-ia
```

### 2. Configurar Variables de Entorno

Los archivos `.env` ya están creados desde `.env.example`. Si necesitas modificarlos:

**Backend** (`backend/.env`):
```bash
# Base de datos (SQLite por defecto - no requiere configuración)
DATABASE_URL=sqlite:///./nutricion.db

# OpenAI API (opcional - solo para funciones de IA)
OPENAI_API_KEY=tu_clave_aqui

# FatSecret API (opcional - solo para búsqueda de alimentos)
FATSECRET_CLIENT_ID=tu_client_id_aqui
FATSECRET_CLIENT_SECRET=tu_client_secret_aqui

# JWT (ya configurado con valores por defecto seguros)
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

ENVIRONMENT=development
```

**Frontend** (`frontend/.env.local`):
```bash
# URL del backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Iniciar con Docker (Recomendado)

```bash
# Dar permisos al script de inicio
chmod +x start.sh

# Iniciar todos los servicios
./start.sh
```

O usando Docker Compose directamente:

```bash
docker-compose up -d
```

### 4. Iniciar en Modo Desarrollo Local

Tienes dos opciones para ejecutar la aplicación localmente: usar los scripts de inicio o ejecutar manualmente.

#### Opción A: Con Scripts de Inicio (Recomendado)

Abre **dos terminales separadas** en el directorio raíz del proyecto:

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

Este script automáticamente:
- ✅ Crea el entorno virtual de Python si no existe
- ✅ Instala todas las dependencias del backend
- ✅ Crea el archivo `.env` desde `.env.example` si no existe
- ✅ Ejecuta las migraciones de la base de datos
- ✅ Inicia el servidor FastAPI en http://localhost:8000

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```

Este script automáticamente:
- ✅ Instala todas las dependencias del frontend
- ✅ Crea el archivo `.env.local` desde `.env.example` si no existe
- ✅ Inicia el servidor Next.js en http://localhost:3000

#### Opción B: Manual (Control Total)

##### Backend

En una terminal, ejecuta:

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones de base de datos
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

##### Frontend

En otra terminal, ejecuta:

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

#### Opción C: Con Make (Alternativa)

Si prefieres usar Make, abre dos terminales:

**Terminal 1:**
```bash
make dev-backend
```

**Terminal 2:**
```bash
make dev-frontend
```

## 🌐 Acceder a la Aplicación

Una vez iniciados los servicios, puedes acceder a:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API (Swagger)**: http://localhost:8000/docs
- **Documentación API (ReDoc)**: http://localhost:8000/redoc

## 🧪 Probar la API

### 1. Verificar que el backend está funcionando

```bash
curl http://localhost:8000/health
# Respuesta esperada: {"status":"healthy"}
```

### 2. Registrar un usuario

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "password_confirm": "password123",
    "objetivo_calorias": 2000
  }'
```

Esto devolverá un `access_token` y `refresh_token`.

### 3. Crear una dieta

```bash
TOKEN="tu_access_token_aqui"

curl -X POST http://localhost:8000/api/v1/dieta/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Plan Saludable 7 días",
    "descripcion": "Plan equilibrado de 2000 kcal/día"
  }'
```

### 4. Listar dietas

```bash
curl http://localhost:8000/api/v1/dieta/ \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Crear una receta

```bash
curl -X POST http://localhost:8000/api/v1/recetas/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ensalada César",
    "descripcion": "Ensalada clásica con pollo",
    "ingredientes": {"items": ["lechuga", "pollo", "queso"]},
    "instrucciones": "1. Lavar lechuga\n2. Cocinar pollo\n3. Mezclar",
    "calorias": 350,
    "proteina": 25.5,
    "carbohidratos": 15.0,
    "grasas": 18.0
  }'
```

## 🔑 Obtener API Keys (Opcional)

### OpenAI API Key

1. Ve a https://platform.openai.com/api-keys
2. Crea una cuenta o inicia sesión
3. Crea una nueva API key
4. Copia la key y agrégala a `backend/.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

### FatSecret API

1. Ve a https://platform.fatsecret.com/api/
2. Crea una cuenta y regístrate como desarrollador
3. Crea una nueva aplicación
4. Obtén `Client ID` y `Client Secret`
5. Agrégalos a `backend/.env`:
   ```
   FATSECRET_CLIENT_ID=...
   FATSECRET_CLIENT_SECRET=...
   ```

## 📂 Estructura de la Base de Datos

La aplicación usa **SQLite** por defecto, que se crea automáticamente en `backend/nutricion.db`.

### Modelos principales:

- **User**: Usuarios del sistema
- **Dieta**: Planes de dieta
- **Receta**: Recetas individuales
- **RefreshToken**: Tokens de autenticación

### Migraciones

Las migraciones ya están aplicadas. Si haces cambios en los modelos:

```bash
cd backend

# Crear nueva migración
alembic revision --autogenerate -m "Descripción del cambio"

# Aplicar migración
alembic upgrade head
```

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo del frontend  
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina la base de datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose build

# Reiniciar servicios
docker-compose restart
```

## 🛠️ Comandos Make

El proyecto incluye un `Makefile` con comandos útiles:

```bash
# Ver todos los comandos disponibles
make help

# Instalar dependencias localmente
make install

# Iniciar con Docker
make start

# Detener servicios
make stop

# Ver logs
make logs

# Limpiar contenedores y caché
make clean

# Ejecutar backend en modo desarrollo local
make dev-backend

# Ejecutar frontend en modo desarrollo local
make dev-frontend
```

## 🔍 Solución de Problemas

### Error: "Port 8000 already in use"

Otro proceso está usando el puerto 8000. Detén el proceso:

```bash
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Error: "Module not found" en el backend

Reinstala las dependencias:

```bash
cd backend
pip install -r requirements.txt
```

### Error: "Database is locked" 

SQLite no soporta múltiples escrituras concurrentes. Usa PostgreSQL para producción:

```bash
# En docker-compose.yml, el servicio 'db' ya está configurado
# Solo cambia DATABASE_URL en backend/.env:
DATABASE_URL=postgresql://user:password@db:5432/nutricion_ia
```

### El frontend no se conecta al backend

Verifica que `NEXT_PUBLIC_API_URL` en `frontend/.env.local` apunte al backend correcto:
- Desarrollo local: `http://localhost:8000`
- Con Docker: `http://backend:8000` (dentro del contenedor)

### Los scripts de inicio no funcionan

Si los scripts `start-backend.sh` o `start-frontend.sh` no funcionan:

1. Verifica que sean ejecutables:
```bash
chmod +x start-backend.sh start-frontend.sh
```

2. En Windows, usa Git Bash o WSL para ejecutar los scripts, o ejecuta los comandos manualmente.

## 📊 Verificar que Todo Funciona

### 1. Backend

```bash
# Health check
curl http://localhost:8000/health

# API docs disponible
curl -I http://localhost:8000/docs
```

### 2. Frontend

Abre http://localhost:3000 en tu navegador. Deberías ver la página de inicio.

### 3. Base de datos

```bash
# Ver tablas creadas
sqlite3 backend/nutricion.db ".tables"
# Debe mostrar: alembic_version dietas recetas refresh_tokens users
```

## 🎯 Próximos Pasos

1. **Registra un usuario** en http://localhost:3000/auth/register
2. **Inicia sesión** en http://localhost:3000/auth/login
3. **Crea tu primera dieta** en http://localhost:3000/dieta/crear
4. **Crea tu primera receta** en http://localhost:3000/recetas/crear
5. **(Opcional)** Configura las API keys para usar funciones de IA

## 📚 Documentación Adicional

- [README.md](./README.md) - Información general del proyecto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura detallada
- [Backend API Docs](http://localhost:8000/docs) - Documentación interactiva de la API

## 🤝 Contribuir

Si encuentras problemas o tienes sugerencias:

1. Abre un issue en GitHub
2. Describe el problema o sugerencia
3. Incluye logs si es un error

## 📝 Licencia

MIT License - Ver [LICENSE](./LICENSE) para más detalles
