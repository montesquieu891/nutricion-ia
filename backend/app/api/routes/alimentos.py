"""
Rutas para gestión de alimentos y búsqueda con FatSecret API
"""

import logging
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from app.services.fat_secret_service import FatSecretService

router = APIRouter()
logger = logging.getLogger(__name__)


class AlimentoResponse(BaseModel):
    """Modelo de respuesta para alimento"""
    id: str
    nombre: str
    descripcion: str
    tipo: str
    url: str
    calorias: float | None = Field(None, description="Calorías por porción")
    proteina: float | None = Field(None, description="Proteína en gramos por porción")
    carbohidratos: float | None = Field(None, description="Carbohidratos en gramos por porción")
    grasas: float | None = Field(None, description="Grasas en gramos por porción")


@router.get("/buscar", response_model=List[AlimentoResponse])
async def buscar_alimentos(
    nombre: str = Query(..., description="Nombre del alimento a buscar", min_length=1)
):
    """
    Buscar alimentos utilizando la API de FatSecret
    
    Args:
        nombre: Nombre del alimento a buscar (ej: "pollo", "arroz", "manzana")
    
    Returns:
        Lista de alimentos con información básica (nombre, ID, macros principales)
    
    Raises:
        HTTPException: Si hay error en la comunicación con FatSecret API
    """
    fat_secret_service = None
    try:
        # Crear instancia del servicio FatSecret
        fat_secret_service = FatSecretService()
        
        # Buscar alimentos
        alimentos = await fat_secret_service.search_foods(nombre)
        
        # Si no se encuentran resultados
        if not alimentos:
            return []
        
        return alimentos
    
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error buscando alimentos: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar alimentos en FatSecret API: {str(e)}"
        )
    finally:
        # Clean up the HTTP client
        if fat_secret_service:
            await fat_secret_service.close()
