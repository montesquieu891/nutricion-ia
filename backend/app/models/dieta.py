"""
Database models for the application
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    objetivo_calorias = Column(Integer)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    
    dietas = relationship("Dieta", back_populates="user")
    recetas = relationship("Receta", back_populates="user")


class Dieta(Base):
    """Dieta model"""
    __tablename__ = "dietas"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    pdf_url = Column(String(500))
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="dietas")


class Receta(Base):
    """Receta model"""
    __tablename__ = "recetas"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    # JSON field for storing ingredients list or dict structure
    # Example: {"items": ["ingredient1", "ingredient2"]} or ["ingredient1", "ingredient2"]
    ingredientes = Column(JSON)
    instrucciones = Column(Text)
    calorias = Column(Integer)
    proteina = Column(Float)
    carbohidratos = Column(Float)
    grasas = Column(Float)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="recetas")
