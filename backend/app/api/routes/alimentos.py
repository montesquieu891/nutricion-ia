"""
Rutas para gestión de alimentos y búsqueda con FatSecret API
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from pydantic import BaseModel
from app.services.fat_secret_service import FatSecretService

router = APIRouter()


class AlimentoResponse(BaseModel):
    """Modelo de respuesta para alimento"""
    id: str
    nombre: str
    descripcion: str
    tipo: str
    url: str
    calorias: float | None = None
    proteina: float | None = None
    carbohidratos: float | None = None
    grasas: float | None = None


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
        print(f"Error buscando alimentos: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar alimentos en FatSecret API: {str(e)}"
        )
