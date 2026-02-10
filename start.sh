#!/bin/bash

# Nutricion IA - Startup Script

set -e

echo "🚀 Iniciando Nutricion IA..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creando archivo backend/.env..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creando archivo frontend/.env.local..."
    cp frontend/.env.example frontend/.env.local
fi

echo "🐳 Iniciando contenedores Docker..."
docker-compose up -d

echo ""
echo "✅ Nutricion IA está ejecutándose!"
echo ""
echo "📍 Servicios disponibles:"
echo "   - Frontend:      http://localhost:3000"
echo "   - Backend API:   http://localhost:8000"
echo "   - API Docs:      http://localhost:8000/docs"
echo "   - PostgreSQL:    localhost:5432"
echo ""
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener:      docker-compose down"
echo ""
