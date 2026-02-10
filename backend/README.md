# Nutricion IA - Backend

Backend API desarrollado con FastAPI para la gestión de dietas y recetas con IA.

## Instalación

```bash
pip install -r requirements.txt
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Editar `.env` con tus credenciales reales

## Ejecución

### Desarrollo
```bash
uvicorn app.main:app --reload
```

### Producción
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Con Docker
```bash
docker build -t nutricion-ia-backend .
docker run -p 8000:8000 nutricion-ia-backend
```

## Estructura

```
app/
├── api/
│   └── routes/      # Endpoints de la API
├── services/        # Lógica de negocio
├── models/          # Modelos de base de datos
├── db/              # Configuración de BD
├── utils/           # Utilidades
├── main.py          # Punto de entrada
└── config.py        # Configuración
```

## API Endpoints

### Dietas
- `GET /api/v1/dieta/` - Listar dietas
- `POST /api/v1/dieta/` - Crear dieta
- `GET /api/v1/dieta/{id}` - Obtener dieta
- `POST /api/v1/dieta/generar` - Generar dieta con IA

### Recetas
- `GET /api/v1/recetas/` - Listar recetas
- `POST /api/v1/recetas/` - Crear receta
- `GET /api/v1/recetas/{id}` - Obtener receta
- `POST /api/v1/recetas/buscar` - Buscar recetas
- `POST /api/v1/recetas/generar` - Generar receta con IA

## Documentación

Una vez iniciado el servidor, acceder a:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
