#!/bin/bash

# Nutricion IA - Frontend Startup Script
# Inicia el servidor frontend Next.js en modo desarrollo

set -e

echo "🚀 Iniciando Frontend (Next.js)..."
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creando archivo .env.local desde .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Archivo .env.local creado"
    else
        echo "⚠️  No se encontró .env.example"
    fi
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
else
    echo "✅ Dependencias ya instaladas (usa 'rm -rf node_modules' para reinstalar)"
fi

echo ""
echo "✅ Frontend iniciado correctamente!"
echo ""
echo "📍 Aplicación disponible en: http://localhost:3000"
echo ""
echo "⚠️  IMPORTANTE: Asegúrate de que el backend esté ejecutándose en http://localhost:8000"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Start the development server
npm run dev
