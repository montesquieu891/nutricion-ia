.PHONY: help install start stop restart logs clean build test

help: ## Mostrar este mensaje de ayuda
	@echo "Nutricion IA - Comandos disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instalar dependencias
	@echo "📦 Instalando dependencias..."
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

start: ## Iniciar todos los servicios con Docker
	@echo "🚀 Iniciando servicios..."
	docker-compose up -d
	@echo "✅ Servicios iniciados!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

stop: ## Detener todos los servicios
	@echo "🛑 Deteniendo servicios..."
	docker-compose down

restart: stop start ## Reiniciar todos los servicios

logs: ## Ver logs de todos los servicios
	docker-compose logs -f

logs-backend: ## Ver logs del backend
	docker-compose logs -f backend

logs-frontend: ## Ver logs del frontend
	docker-compose logs -f frontend

logs-db: ## Ver logs de la base de datos
	docker-compose logs -f db

build: ## Construir las imágenes Docker
	docker-compose build

clean: ## Limpiar contenedores y volúmenes
	docker-compose down -v
	rm -rf backend/__pycache__
	rm -rf backend/app/__pycache__
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

dev-backend: ## Ejecutar backend en modo desarrollo (local)
	cd backend && uvicorn app.main:app --reload

dev-frontend: ## Ejecutar frontend en modo desarrollo (local)
	cd frontend && npm run dev

test-backend: ## Ejecutar tests del backend
	cd backend && pytest

shell-backend: ## Abrir shell en el contenedor backend
	docker-compose exec backend /bin/bash

shell-db: ## Abrir shell PostgreSQL
	docker-compose exec db psql -U user -d nutricion_ia

status: ## Ver estado de los servicios
	docker-compose ps
