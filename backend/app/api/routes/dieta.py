"""
Rutas para gestión de dietas
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.dieta import Dieta

router = APIRouter()


class DietaBase(BaseModel):
    """Modelo base para dieta"""
    nombre: str
    descripcion: Optional[str] = None
    pdf_url: Optional[str] = None


class DietaCreate(DietaBase):
    """Modelo para crear dieta"""
    user_id: int


class DietaUpdate(BaseModel):
    """Modelo para actualizar dieta"""
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    pdf_url: Optional[str] = None


class DietaResponse(DietaBase):
    """Modelo de dieta completo"""
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[DietaResponse])
async def listar_dietas(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Listar todas las dietas"""
    dietas = db.query(Dieta).offset(skip).limit(limit).all()
    return dietas


@router.post("/", response_model=DietaResponse, status_code=201)
async def crear_dieta(dieta: DietaCreate, db: Session = Depends(get_db)):
    """Crear una nueva dieta"""
    db_dieta = Dieta(
        user_id=dieta.user_id,
        nombre=dieta.nombre,
        descripcion=dieta.descripcion,
        pdf_url=dieta.pdf_url
    )
    db.add(db_dieta)
    db.commit()
    db.refresh(db_dieta)
    return db_dieta


@router.get("/{dieta_id}", response_model=DietaResponse)
async def obtener_dieta(dieta_id: int, db: Session = Depends(get_db)):
    """Obtener una dieta específica"""
    dieta = db.query(Dieta).filter(Dieta.id == dieta_id).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta no encontrada")
    return dieta


@router.put("/{dieta_id}", response_model=DietaResponse)
async def actualizar_dieta(
    dieta_id: int,
    dieta_update: DietaUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar una dieta existente"""
    dieta = db.query(Dieta).filter(Dieta.id == dieta_id).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta no encontrada")
    
    update_data = dieta_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(dieta, field, value)
    
    db.commit()
    db.refresh(dieta)
    return dieta


@router.delete("/{dieta_id}", status_code=204)
async def eliminar_dieta(dieta_id: int, db: Session = Depends(get_db)):
    """Eliminar una dieta"""
    dieta = db.query(Dieta).filter(Dieta.id == dieta_id).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta no encontrada")
    
    db.delete(dieta)
    db.commit()
    return None


@router.post("/generar")
async def generar_dieta_ia(parametros: dict):
    """Generar una dieta usando IA"""
    # TODO: Implementar lógica con OpenAI
    return {"message": "Función de generación de dieta con IA pendiente"}
