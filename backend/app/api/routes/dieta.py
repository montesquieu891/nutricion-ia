"""
Rutas para gestión de dietas
"""

from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()


class DietaBase(BaseModel):
    """Modelo base para dieta"""
    nombre: str
    descripcion: str
    calorias_objetivo: int


class DietaCreate(DietaBase):
    """Modelo para crear dieta"""
    pass


class Dieta(DietaBase):
    """Modelo de dieta completo"""
    id: int
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[Dieta])
async def listar_dietas():
    """Listar todas las dietas"""
    # TODO: Implementar lógica de base de datos
    return []


@router.post("/", response_model=Dieta)
async def crear_dieta(dieta: DietaCreate):
    """Crear una nueva dieta"""
    # TODO: Implementar lógica de base de datos
    return Dieta(id=1, **dieta.dict())


@router.get("/{dieta_id}", response_model=Dieta)
async def obtener_dieta(dieta_id: int):
    """Obtener una dieta específica"""
    # TODO: Implementar lógica de base de datos
    raise HTTPException(status_code=404, detail="Dieta no encontrada")


@router.post("/generar")
async def generar_dieta_ia(parametros: dict):
    """Generar una dieta usando IA"""
    # TODO: Implementar lógica con OpenAI
    return {"message": "Función de generación de dieta con IA pendiente"}
