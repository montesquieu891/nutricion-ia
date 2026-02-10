#!/bin/bash

# Nutricion IA - Backend Startup Script
# Inicia el servidor backend FastAPI en modo desarrollo

set -e

echo "🚀 Iniciando Backend (FastAPI)..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor instala Python 3.11+ primero."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado"
    else
        echo "⚠️  No se encontró .env.example"
    fi
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
    echo "✅ Entorno virtual creado"
fi

# Activate virtual environment
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Install dependencies
if [ ! -f "venv/.installed" ]; then
    echo "📦 Instalando dependencias..."
    pip install --upgrade pip
    pip install -r requirements.txt
    touch venv/.installed
    echo "✅ Dependencias instaladas"
else
    echo "✅ Dependencias ya instaladas (usa 'rm venv/.installed' para reinstalar)"
fi

# Run migrations
echo "🗄️ Ejecutando migraciones de base de datos..."
alembic upgrade head

echo ""
echo "✅ Backend iniciado correctamente!"
echo ""
echo "📍 Servidor disponible en: http://localhost:8000"
echo "📍 Documentación API: http://localhost:8000/docs"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Start the server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
