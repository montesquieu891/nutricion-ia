"""
Configuration settings for the application
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings (constants - not configurable via .env)
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Nutricion IA"
    
    # CORS Settings (constants - not configurable via .env)
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database Settings (configurable via .env)
    DATABASE_URL: str = "postgresql://user:password@db:5432/nutricion_ia"
    
    # OpenAI Settings (configurable via .env)
    OPENAI_API_KEY: str = ""
    
    # FatSecret API Settings (configurable via .env)
    FATSECRET_CLIENT_ID: str = ""
    FATSECRET_CLIENT_SECRET: str = ""
    
    # Environment (configurable via .env)
    ENVIRONMENT: str = "development"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Ignore extra fields from .env to prevent validation errors
    )


settings = Settings()
