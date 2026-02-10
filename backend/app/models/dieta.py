"""
Database models for the application
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON
from sqlalchemy.sql import func
from app.db.session import Base


class Dieta(Base):
    """Dieta model"""
    __tablename__ = "dietas"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    calorias_objetivo = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Receta(Base):
    """Receta model"""
    __tablename__ = "recetas"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    ingredientes = Column(JSON)  # Native JSON type for better querying
    instrucciones = Column(Text)
    tiempo_preparacion = Column(Integer)  # en minutos
    calorias = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
