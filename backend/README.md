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

## Base de Datos y Migraciones

### Inicializar/Migrar la base de datos

```bash
# Aplicar todas las migraciones
alembic upgrade head

# Ver el estado actual de las migraciones
alembic current

# Ver el historial de migraciones
alembic history
```

### Crear una nueva migración

```bash
# Generar automáticamente una migración basada en cambios de modelos
alembic revision --autogenerate -m "Descripción de los cambios"

# Crear una migración manual vacía
alembic revision -m "Descripción de los cambios"
```

### Deshacer migraciones

```bash
# Revertir a la migración anterior
alembic downgrade -1

# Revertir todas las migraciones
alembic downgrade base
```

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
│   ├── dieta.py     # Modelos User, Dieta, Receta
│   └── database.py  # Configuración y exports
├── db/              # Configuración de BD
│   └── session.py   # Sesiones y conexión
├── utils/           # Utilidades
├── main.py          # Punto de entrada
└── config.py        # Configuración
alembic/
├── versions/        # Archivos de migración
└── env.py           # Configuración de Alembic
```

## Modelos de Datos

### User
- `id`: Integer (PK)
- `nombre`: String (255)
- `email`: String (255, unique)
- `objetivo_calorias`: Integer (opcional)
- `creado_en`: DateTime

### Dieta
- `id`: Integer (PK)
- `user_id`: Integer (FK -> users.id)
- `nombre`: String (255)
- `descripcion`: Text (opcional)
- `pdf_url`: String (500, opcional)
- `creado_en`: DateTime

### Receta
- `id`: Integer (PK)
- `user_id`: Integer (FK -> users.id)
- `nombre`: String (255)
- `descripcion`: Text (opcional)
- `ingredientes`: JSON (opcional)
- `instrucciones`: Text (opcional)
- `calorias`: Integer (opcional)
- `proteina`: Float (opcional)
- `carbohidratos`: Float (opcional)
- `grasas`: Float (opcional)
- `creado_en`: DateTime

## API Endpoints

### Dietas
- `GET /api/v1/dieta/` - Listar dietas (con paginación: skip, limit)
- `POST /api/v1/dieta/` - Crear dieta
- `GET /api/v1/dieta/{id}` - Obtener dieta específica
- `PUT /api/v1/dieta/{id}` - Actualizar dieta
- `DELETE /api/v1/dieta/{id}` - Eliminar dieta
- `POST /api/v1/dieta/generar` - Generar dieta con IA (pendiente)

### Recetas
- `GET /api/v1/recetas/` - Listar recetas (con paginación: skip, limit)
- `POST /api/v1/recetas/` - Crear receta
- `GET /api/v1/recetas/{id}` - Obtener receta específica
- `PUT /api/v1/recetas/{id}` - Actualizar receta
- `DELETE /api/v1/recetas/{id}` - Eliminar receta
- `POST /api/v1/recetas/buscar` - Buscar recetas (pendiente)
- `POST /api/v1/recetas/generar` - Generar receta con IA (pendiente)

## Ejemplos de Uso

### Crear una Dieta

```bash
curl -X POST http://localhost:8000/api/v1/dieta/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "nombre": "Dieta Mediterránea",
    "descripcion": "Dieta saludable basada en ingredientes mediterráneos",
    "pdf_url": "https://example.com/dieta.pdf"
  }'
```

### Crear una Receta

```bash
curl -X POST http://localhost:8000/api/v1/recetas/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "nombre": "Ensalada César",
    "descripcion": "Ensalada clásica",
    "ingredientes": {"items": ["lechuga", "pollo", "queso"]},
    "instrucciones": "1. Lavar lechuga. 2. Cocinar pollo. 3. Mezclar.",
    "calorias": 350,
    "proteina": 25.5,
    "carbohidratos": 20.0,
    "grasas": 15.5
  }'
```

### Actualizar una Receta

```bash
curl -X PUT http://localhost:8000/api/v1/recetas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "calorias": 375,
    "proteina": 28.0
  }'
```

## Documentación

Una vez iniciado el servidor, acceder a:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
