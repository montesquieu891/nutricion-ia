# Nutricion IA

Aplicación de gestión de dietas y recetas con inteligencia artificial.

## 🚀 Características

- **Backend con FastAPI**: API REST robusta y rápida
- **Frontend con Next.js**: Interfaz moderna y responsive
- **Inteligencia Artificial**: Generación de dietas y recetas personalizadas
- **Base de datos PostgreSQL**: Almacenamiento persistente
- **Dockerizado**: Fácil despliegue y desarrollo

## 📋 Requisitos Previos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Python 3.11+ (para desarrollo local)

## 🔧 Instalación y Configuración

### Usando Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone https://github.com/montesquieu891/nutricion-ia.git
cd nutricion-ia
```

2. Configurar variables de entorno:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Iniciar los servicios:
```bash
docker-compose up -d
```

4. Acceder a las aplicaciones:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### Desarrollo Local

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

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
- FastAPI 0.109.0
- SQLAlchemy 2.0
- PostgreSQL 15
- OpenAI API
- Pydantic

### Frontend
- Next.js 14
- React 18
- TypeScript
- Axios

## 📖 API Documentation

Una vez iniciado el backend, la documentación interactiva está disponible en:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Autores

- [montesquieu891](https://github.com/montesquieu891)
