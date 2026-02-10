"""
Rutas para gestión de recetas
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.dieta import Receta

router = APIRouter()


class RecetaBase(BaseModel):
    """Modelo base para receta"""
    nombre: str
    descripcion: Optional[str] = None
    # Ingredientes can be a list of strings or a dict with structure
    # Example: {"items": ["item1", "item2"]} or ["item1", "item2"]
    ingredientes: Optional[Dict[str, Any]] = None
    instrucciones: Optional[str] = None
    calorias: Optional[int] = None
    proteina: Optional[float] = None
    carbohidratos: Optional[float] = None
    grasas: Optional[float] = None


class RecetaCreate(RecetaBase):
    """Modelo para crear receta"""
    user_id: int


class RecetaUpdate(BaseModel):
    """Modelo para actualizar receta"""
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    ingredientes: Optional[Dict[str, Any]] = None
    instrucciones: Optional[str] = None
    calorias: Optional[int] = None
    proteina: Optional[float] = None
    carbohidratos: Optional[float] = None
    grasas: Optional[float] = None


class RecetaResponse(RecetaBase):
    """Modelo de receta completo"""
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[RecetaResponse])
async def listar_recetas(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Listar todas las recetas"""
    recetas = db.query(Receta).offset(skip).limit(limit).all()
    return recetas


@router.post("/", response_model=RecetaResponse, status_code=201)
async def crear_receta(receta: RecetaCreate, db: Session = Depends(get_db)):
    """Crear una nueva receta"""
    db_receta = Receta(
        user_id=receta.user_id,
        nombre=receta.nombre,
        descripcion=receta.descripcion,
        ingredientes=receta.ingredientes,
        instrucciones=receta.instrucciones,
        calorias=receta.calorias,
        proteina=receta.proteina,
        carbohidratos=receta.carbohidratos,
        grasas=receta.grasas
    )
    db.add(db_receta)
    db.commit()
    db.refresh(db_receta)
    return db_receta


@router.get("/{receta_id}", response_model=RecetaResponse)
async def obtener_receta(receta_id: int, db: Session = Depends(get_db)):
    """Obtener una receta específica"""
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return receta


@router.put("/{receta_id}", response_model=RecetaResponse)
async def actualizar_receta(
    receta_id: int,
    receta_update: RecetaUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar una receta existente"""
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    
    update_data = receta_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(receta, field, value)
    
    db.commit()
    db.refresh(receta)
    return receta


@router.delete("/{receta_id}", status_code=204)
async def eliminar_receta(receta_id: int, db: Session = Depends(get_db)):
    """Eliminar una receta"""
    receta = db.query(Receta).filter(Receta.id == receta_id).first()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    
    db.delete(receta)
    db.commit()


@router.post("/buscar")
async def buscar_recetas(terminos: dict):
    """Buscar recetas por ingredientes o nombre"""
    # TODO: Implementar búsqueda
    return {"message": "Función de búsqueda pendiente"}


@router.post("/generar")
async def generar_receta_ia(parametros: dict):
    """Generar una receta usando IA"""
    # TODO: Implementar lógica con OpenAI
    return {"message": "Función de generación de receta con IA pendiente"}
