# Nutricion IA

Aplicación de gestión de dietas y recetas con inteligencia artificial.

## ✅ Estado del Proyecto

**El proyecto está OPERATIVO y listo para usar.** ✨

- ✅ Backend FastAPI funcionando con SQLite
- ✅ Frontend Next.js funcionando
- ✅ Autenticación JWT implementada
- ✅ CRUD completo de Dietas y Recetas
- ✅ Base de datos inicializada con migraciones
- ⚠️ Funciones de IA requieren API keys (opcional)

## 🚀 Inicio Rápido

**¿Primera vez?** Lee la [**Guía de Configuración Completa (SETUP.md)**](./SETUP.md) 📖

### Opción 1: Con Docker (Recomendado)

```bash
# Iniciar todos los servicios
./start.sh

# O manualmente
docker-compose up -d
```

Accede a: http://localhost:3000 🎉

### Opción 2: Desarrollo Local

```bash
# Configuración automática
./quickstart.sh

# Luego inicia backend y frontend en terminales separadas
```

## 🚀 Características

- **Backend con FastAPI**: API REST robusta y rápida
- **Frontend con Next.js**: Interfaz moderna y responsive
- **Inteligencia Artificial**: Generación de dietas y recetas personalizadas (requiere OpenAI API Key)
- **Base de datos SQLite/PostgreSQL**: SQLite para desarrollo local (sin configuración adicional), PostgreSQL para producción
- **Dockerizado**: Fácil despliegue y desarrollo
- **Autenticación JWT**: Sistema completo de autenticación con tokens de acceso y refresh

## 📋 Requisitos Previos

- Docker y Docker Compose (para ejecución con Docker)
- Node.js 18+ (para desarrollo local)
- Python 3.11+ (para desarrollo local)

## 🔧 Configuración Detallada

**📖 Para instrucciones detalladas, ver [SETUP.md](./SETUP.md)**

### Configurar Variables de Entorno

Los archivos `.env` se crean automáticamente desde `.env.example` al ejecutar `./start.sh` o `./quickstart.sh`.

**Backend** (`backend/.env`):
- `DATABASE_URL`: Base de datos (SQLite por defecto)
- `OPENAI_API_KEY`: API key de OpenAI (opcional, para IA)
- `FATSECRET_CLIENT_ID` y `FATSECRET_CLIENT_SECRET`: Credenciales FatSecret API (opcional)
- `JWT_SECRET_KEY`: Clave secreta para JWT (ya configurada por defecto)

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL`: URL del backend (`http://localhost:8000` por defecto)

### Usando Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone https://github.com/montesquieu891/nutricion-ia.git
cd nutricion-ia
```

2. Iniciar con Docker:
```bash
chmod +x start.sh
./start.sh
```

3. Acceder a las aplicaciones:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### Desarrollo Local

Usa el script de inicio rápido:

```bash
./quickstart.sh
```

O manualmente:

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head  # Inicializar base de datos
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Probar la Aplicación

### Verificar Backend

```bash
# Health check
curl http://localhost:8000/health

# Ver documentación
open http://localhost:8000/docs  # Mac
# O visita en tu navegador: http://localhost:8000/docs
```

### Registrar Usuario y Probar API

```bash
# Registrar usuario
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirm": "password123",
    "objetivo_calorias": 2000
  }'

# Usar el token recibido para crear una dieta
TOKEN="tu_token_aqui"
curl -X POST http://localhost:8000/api/v1/dieta/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Primera Dieta",
    "descripcion": "Plan de 7 días"
  }'
```

**Ver [SETUP.md](./SETUP.md) para más ejemplos de uso de la API.**

## 📁 Estructura del Proyecto

```
nutricion-ia/
├── backend/              # Backend FastAPI
│   ├── app/
│   │   ├── api/         # Endpoints de la API
│   │   ├── services/    # Lógica de negocio
│   │   ├── models/      # Modelos de base de datos
│   │   ├── db/          # Configuración de BD
│   │   └── utils/       # Utilidades
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # Frontend Next.js
│   ├── src/
│   │   ├── app/        # Páginas Next.js (App Router)
│   │   ├── components/ # Componentes React
│   │   ├── services/   # Cliente API
│   │   └── utils/      # Utilidades
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml   # Orquestación de contenedores
├── ARCHITECTURE.md      # Documentación de arquitectura
└── README.md
```

## 🛠️ Tecnologías

### Backend
- FastAPI 0.115.6
- SQLAlchemy 2.0
- SQLite (desarrollo) / PostgreSQL (producción)
- OpenAI API
- Pydantic v2
- Python-multipart 0.0.22

### Frontend
- Next.js 15.2.9
- React 18
- TypeScript
- Axios

## 📖 API Documentation

Una vez iniciado el backend, la documentación interactiva está disponible en:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Probar la búsqueda de alimentos con FatSecret API

Una vez configuradas las credenciales de FatSecret en el archivo `.env`, puedes probar el endpoint de búsqueda de alimentos:

```bash
# Buscar alimentos (ejemplo: pollo)
curl "http://localhost:8000/api/v1/alimentos/buscar?nombre=pollo"

# Buscar otros alimentos
curl "http://localhost:8000/api/v1/alimentos/buscar?nombre=arroz"
curl "http://localhost:8000/api/v1/alimentos/buscar?nombre=manzana"
```

También puedes probar el endpoint desde la interfaz Swagger UI en http://localhost:8000/docs, navegando a la sección "alimentos" y usando el endpoint GET `/api/v1/alimentos/buscar`.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Autores

- [montesquieu891](https://github.com/montesquieu891)
