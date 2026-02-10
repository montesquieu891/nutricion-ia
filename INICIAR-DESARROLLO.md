# 🚀 Guía Rápida: Iniciar Frontend y Backend en Terminales Separadas

Esta guía te muestra cómo iniciar el frontend y backend de Nutrición IA en terminales separadas para desarrollo local.

## ✅ Requisitos Previos

- Python 3.11+ instalado
- Node.js 18+ instalado
- npm instalado

## 📝 Método 1: Scripts Automáticos (Recomendado)

### Paso 1: Abrir Dos Terminales

Abre dos ventanas de terminal en el directorio raíz del proyecto:
```bash
cd nutricion-ia
```

### Paso 2: Iniciar el Backend

En la **Terminal 1**, ejecuta:
```bash
./start-backend.sh
```

**¿Qué hace este script?**
- ✅ Crea automáticamente el entorno virtual de Python
- ✅ Instala todas las dependencias necesarias
- ✅ Configura el archivo `.env` si no existe
- ✅ Ejecuta las migraciones de la base de datos
- ✅ Inicia el servidor FastAPI

**Salida esperada:**
```
🚀 Iniciando Backend (FastAPI)...
📝 Creando archivo .env desde .env.example...
✅ Archivo .env creado
📦 Instalando dependencias...
✅ Dependencias instaladas
🗄️ Ejecutando migraciones de base de datos...
✅ Backend iniciado correctamente!

📍 Servidor disponible en: http://localhost:8000
📍 Documentación API: http://localhost:8000/docs

Presiona Ctrl+C para detener el servidor
```

### Paso 3: Iniciar el Frontend

En la **Terminal 2**, ejecuta:
```bash
./start-frontend.sh
```

**¿Qué hace este script?**
- ✅ Instala automáticamente las dependencias de Node.js
- ✅ Configura el archivo `.env.local` si no existe
- ✅ Inicia el servidor de desarrollo Next.js

**Salida esperada:**
```
🚀 Iniciando Frontend (Next.js)...
📝 Creando archivo .env.local desde .env.example...
✅ Archivo .env.local creado
📦 Instalando dependencias...
✅ Dependencias instaladas
✅ Frontend iniciado correctamente!

📍 Aplicación disponible en: http://localhost:3000

⚠️  IMPORTANTE: Asegúrate de que el backend esté ejecutándose en http://localhost:8000

Presiona Ctrl+C para detener el servidor
```

### Paso 4: Acceder a la Aplicación

Abre tu navegador y visita:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 🔧 Método 2: Comandos Manuales

Si prefieres más control, puedes ejecutar los comandos manualmente:

### Terminal 1 - Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Método 3: Usando Make

Si tienes Make instalado:

### Terminal 1:
```bash
make dev-backend
```

### Terminal 2:
```bash
make dev-frontend
```

## ⚠️ Solución de Problemas Comunes

### Los scripts no son ejecutables
```bash
chmod +x start-backend.sh start-frontend.sh
```

### Puerto 8000 ya está en uso
```bash
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### El frontend no se conecta al backend

Verifica que el archivo `frontend/.env.local` tenga:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Error: Python no encontrado

Instala Python 3.11 o superior desde https://www.python.org/downloads/

### Error: Node.js no encontrado

Instala Node.js 18 o superior desde https://nodejs.org/

## 📚 Siguientes Pasos

Una vez que ambos servidores estén ejecutándose:

1. 📝 Registra un usuario en http://localhost:3000/auth/register
2. 🔐 Inicia sesión en http://localhost:3000/auth/login
3. 🥗 Crea tu primera dieta
4. 🍳 Crea tu primera receta

## 💡 Consejos Útiles

- Los scripts guardan un marcador para no reinstalar dependencias cada vez
- Para forzar reinstalación de dependencias del backend: `rm backend/venv/.installed`
- Para forzar reinstalación de dependencias del frontend: `rm -rf frontend/node_modules`
- Ambos servidores tienen hot-reload activado (recarga automática al editar código)
- Presiona `Ctrl+C` en cada terminal para detener los servidores

## 🐳 ¿Prefieres Docker?

Si prefieres usar Docker en lugar de desarrollo local:
```bash
./start.sh
```

O:
```bash
docker-compose up -d
```

Esto iniciará ambos servicios automáticamente en contenedores Docker.

---

📖 Para más información, consulta [SETUP.md](./SETUP.md) o [README.md](./README.md)
