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
    hashed_password = Column(String(255), nullable=False)
    objetivo_calorias = Column(Integer)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    
    dietas = relationship("Dieta", back_populates="user")
    recetas = relationship("Receta", back_populates="user")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")


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


class RefreshToken(Base):
    """Refresh Token model for JWT authentication"""
    __tablename__ = "refresh_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(500), nullable=False, unique=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="refresh_tokens")
