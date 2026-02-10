"""
Rutas para gestión de dietas
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.dieta import Dieta, User
from app.services.openai_service import OpenAIService
from app.services.dependencies import get_openai_service
from app.api.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class DietaBase(BaseModel):
    """Modelo base para dieta"""
    nombre: str
    descripcion: Optional[str] = None
    pdf_url: Optional[str] = None


class DietaCreate(DietaBase):
    """Modelo para crear dieta"""
    pass  # user_id will come from authenticated user


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


class GenerarDietaRequest(BaseModel):
    """Modelo para solicitud de generación de dieta con IA"""
    objetivo_calorias: int = Field(..., gt=0, description="Objetivo de calorías diarias")
    preferencias: Optional[List[str]] = Field(None, description="Preferencias alimenticias")
    restricciones: Optional[List[str]] = Field(None, description="Restricciones dietéticas")
    dias: int = Field(7, gt=0, le=30, description="Número de días del plan (1-30)")


class GenerarDietaResponse(BaseModel):
    """Modelo de respuesta para dieta generada con IA"""
    id: int
    user_id: int
    nombre: str
    descripcion: str
    plan_completo: Dict[str, Any] = Field(..., description="Plan de dieta completo con comidas")
    calorias_totales: Optional[int] = None
    proteina_total: Optional[float] = None
    carbohidratos_total: Optional[float] = None
    grasas_total: Optional[float] = None


@router.get("/", response_model=List[DietaResponse])
async def listar_dietas(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar las dietas del usuario autenticado"""
    dietas = db.query(Dieta).filter(Dieta.user_id == current_user.id).offset(skip).limit(limit).all()
    return dietas


@router.post("/", response_model=DietaResponse, status_code=201)
async def crear_dieta(
    dieta: DietaCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear una nueva dieta para el usuario autenticado"""
    db_dieta = Dieta(
        user_id=current_user.id,
        nombre=dieta.nombre,
        descripcion=dieta.descripcion,
        pdf_url=dieta.pdf_url
    )
    db.add(db_dieta)
    db.commit()
    db.refresh(db_dieta)
    return db_dieta


@router.get("/{dieta_id}", response_model=DietaResponse)
async def obtener_dieta(
    dieta_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener una dieta específica del usuario autenticado"""
    dieta = db.query(Dieta).filter(
        Dieta.id == dieta_id,
        Dieta.user_id == current_user.id
    ).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta no encontrada")
    return dieta


@router.put("/{dieta_id}", response_model=DietaResponse)
async def actualizar_dieta(
    dieta_id: int,
    dieta_update: DietaUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar una dieta existente del usuario autenticado"""
    dieta = db.query(Dieta).filter(
        Dieta.id == dieta_id,
        Dieta.user_id == current_user.id
    ).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta no encontrada")
    
    update_data = dieta_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(dieta, field, value)
    
    db.commit()
    db.refresh(dieta)
    return dieta


@router.delete("/{dieta_id}", status_code=204)
async def eliminar_dieta(
    dieta_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar una dieta del usuario autenticado"""
    dieta = db.query(Dieta).filter(
        Dieta.id == dieta_id,
        Dieta.user_id == current_user.id
    ).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Dieta no encontrada")
    
    db.delete(dieta)
    db.commit()


@router.post("/generar", response_model=GenerarDietaResponse, status_code=201)
async def generar_dieta_ia(
    request: GenerarDietaRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    openai_service: OpenAIService = Depends(get_openai_service)
):
    """
    Generar una dieta personalizada usando IA (OpenAI)
    
    Este endpoint genera un plan de dieta completo basado en:
    - Objetivo de calorías diarias del usuario
    - Preferencias alimenticias (opcional)
    - Restricciones dietéticas (opcional)
    - Número de días del plan
    
    La dieta generada se guarda en la base de datos y se retorna con toda la información.
    """
    try:
        # Generar la dieta con IA
        logger.info(f"Generando dieta con IA para usuario {current_user.id}")
        diet_plan = await openai_service.generar_dieta(
            objetivo_calorias=request.objetivo_calorias,
            preferencias=request.preferencias,
            restricciones=request.restricciones,
            dias=request.dias
        )
        
        # Crear registro en la base de datos
        db_dieta = Dieta(
            user_id=current_user.id,
            nombre=diet_plan.get("nombre", f"Plan de {request.dias} días"),
            descripcion=diet_plan.get("descripcion", f"Plan personalizado de {request.objetivo_calorias} kcal/día")
        )
        db.add(db_dieta)
        db.commit()
        db.refresh(db_dieta)
        
        logger.info(f"Dieta generada exitosamente con ID: {db_dieta.id}")
        
        # Preparar respuesta
        return GenerarDietaResponse(
            id=db_dieta.id,
            user_id=db_dieta.user_id,
            nombre=db_dieta.nombre,
            descripcion=db_dieta.descripcion,
            plan_completo=diet_plan,
            calorias_totales=diet_plan.get("calorias_totales"),
            proteina_total=diet_plan.get("proteina_total"),
            carbohidratos_total=diet_plan.get("carbohidratos_total"),
            grasas_total=diet_plan.get("grasas_total")
        )
    
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generando dieta con IA: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar dieta con IA: {str(e)}"
        )
