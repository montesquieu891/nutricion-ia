#!/bin/bash
# Quick Start Script for Nutricion IA - Local Development
# This script sets up and runs the application in local development mode (without Docker)

set -e

echo "🚀 Nutricion IA - Configuración Rápida"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python version
echo -e "${BLUE}📋 Verificando requisitos...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no está instalado${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo -e "${GREEN}✅ Python $PYTHON_VERSION encontrado${NC}"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js $NODE_VERSION encontrado${NC}"
echo ""

# Setup backend
echo -e "${BLUE}🔧 Configurando Backend...${NC}"
cd backend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando backend/.env desde .env.example...${NC}"
    cp .env.example .env
fi

# Install Python dependencies
echo -e "${BLUE}📦 Instalando dependencias de Python...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Run database migrations
echo -e "${BLUE}🗄️  Ejecutando migraciones de base de datos...${NC}"
alembic upgrade head

echo -e "${GREEN}✅ Backend configurado correctamente${NC}"
echo ""

# Setup frontend
echo -e "${BLUE}🔧 Configurando Frontend...${NC}"
cd ../frontend

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}📝 Creando frontend/.env.local desde .env.example...${NC}"
    cp .env.example .env.local
fi

# Install Node dependencies
echo -e "${BLUE}📦 Instalando dependencias de Node.js...${NC}"
npm install --silent

echo -e "${GREEN}✅ Frontend configurado correctamente${NC}"
echo ""

# Instructions to run
echo -e "${GREEN}✅ ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}Para iniciar la aplicación, ejecuta estos comandos en terminales separadas:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Luego accede a:${NC}"
echo "  🌐 Frontend:  http://localhost:3000"
echo "  🔧 Backend:   http://localhost:8000"
echo "  📚 API Docs:  http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}💡 Tip: Para usar funciones de IA, configura OPENAI_API_KEY en backend/.env${NC}"
echo ""
