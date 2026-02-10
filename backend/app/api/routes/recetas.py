"""
Rutas para gestión de recetas
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.dieta import Receta, User
from app.services.openai_service import OpenAIService
from app.services.dependencies import get_openai_service
import logging

logger = logging.getLogger(__name__)

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


class GenerarRecetaRequest(BaseModel):
    """Modelo para solicitud de generación de receta con IA"""
    user_id: int = Field(..., description="ID del usuario")
    objetivo_calorias: Optional[int] = Field(None, gt=0, description="Objetivo de calorías (opcional)")
    ingredientes_deseados: Optional[List[str]] = Field(None, description="Ingredientes deseados")
    tipo_comida: Optional[str] = Field(None, description="Tipo de comida: desayuno, almuerzo, cena, snack")
    restricciones: Optional[List[str]] = Field(None, description="Restricciones dietéticas")


class GenerarRecetaResponse(BaseModel):
    """Modelo de respuesta para receta generada con IA"""
    id: int
    user_id: int
    nombre: str
    descripcion: str
    ingredientes: Dict[str, Any]
    instrucciones: str
    tiempo_preparacion: Optional[str] = None
    porciones: Optional[int] = None
    calorias: Optional[int] = None
    proteina: Optional[float] = None
    carbohidratos: Optional[float] = None
    grasas: Optional[float] = None


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


@router.post("/generar", response_model=GenerarRecetaResponse, status_code=201)
async def generar_receta_ia(
    request: GenerarRecetaRequest,
    db: Session = Depends(get_db),
    openai_service: OpenAIService = Depends(get_openai_service)
):
    """
    Generar una receta personalizada usando IA (OpenAI)
    
    Este endpoint genera una receta completa basada en:
    - Objetivo de calorías (opcional)
    - Ingredientes deseados (opcional)
    - Tipo de comida (opcional): desayuno, almuerzo, cena, snack
    - Restricciones dietéticas (opcional)
    
    La receta generada se guarda en la base de datos y se retorna con toda la información.
    """
    try:
        # Verificar que el usuario existe
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Generar la receta con IA
        logger.info(f"Generando receta con IA para usuario {request.user_id}")
        recipe_data = await openai_service.generar_receta(
            objetivo_calorias=request.objetivo_calorias,
            ingredientes_deseados=request.ingredientes_deseados,
            tipo_comida=request.tipo_comida,
            restricciones=request.restricciones
        )
        
        # Preparar ingredientes en formato dict/JSON
        ingredientes_json = {
            "items": recipe_data.get("ingredientes", [])
        }
        
        # Crear registro en la base de datos
        db_receta = Receta(
            user_id=request.user_id,
            nombre=recipe_data.get("nombre", "Receta Generada"),
            descripcion=recipe_data.get("descripcion", ""),
            ingredientes=ingredientes_json,
            instrucciones=recipe_data.get("instrucciones", ""),
            calorias=recipe_data.get("calorias"),
            proteina=recipe_data.get("proteina"),
            carbohidratos=recipe_data.get("carbohidratos"),
            grasas=recipe_data.get("grasas")
        )
        db.add(db_receta)
        db.commit()
        db.refresh(db_receta)
        
        logger.info(f"Receta generada exitosamente con ID: {db_receta.id}")
        
        # Preparar respuesta
        return GenerarRecetaResponse(
            id=db_receta.id,
            user_id=db_receta.user_id,
            nombre=db_receta.nombre,
            descripcion=db_receta.descripcion,
            ingredientes=ingredientes_json,
            instrucciones=db_receta.instrucciones,
            tiempo_preparacion=recipe_data.get("tiempo_preparacion"),
            porciones=recipe_data.get("porciones"),
            calorias=db_receta.calorias,
            proteina=db_receta.proteina,
            carbohidratos=db_receta.carbohidratos,
            grasas=db_receta.grasas
        )
    
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generando receta con IA: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar receta con IA: {str(e)}"
        )
