"""
FastAPI Backend Application - Nutricion IA
Main entry point for the API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import dieta, recetas, alimentos, auth
from app.config import settings

app = FastAPI(
    title="Nutricion IA API",
    description="API para gestión de dietas y recetas con IA",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(dieta.router, prefix="/api/v1/dieta", tags=["dieta"])
app.include_router(recetas.router, prefix="/api/v1/recetas", tags=["recetas"])
app.include_router(alimentos.router, prefix="/api/v1/alimentos", tags=["alimentos"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bienvenido a Nutricion IA API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
