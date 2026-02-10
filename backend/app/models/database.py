"""
Database configuration and model exports
"""

from app.db.session import Base, engine, get_db
from app.models.dieta import User, Dieta, Receta

# Export all models for easy imports
__all__ = ["Base", "engine", "get_db", "User", "Dieta", "Receta"]


def init_db():
    """Initialize database - create all tables"""
    Base.metadata.create_all(bind=engine)
