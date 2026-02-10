"""
Service dependencies for dependency injection
Provides singleton instances of services to be used across the application
"""

from typing import Optional
from app.services.openai_service import OpenAIService

# Singleton instance of OpenAI service
_openai_service: Optional[OpenAIService] = None


def get_openai_service() -> OpenAIService:
    """
    Dependency for getting OpenAI service instance
    Returns a singleton instance to avoid creating multiple clients
    """
    global _openai_service
    if _openai_service is None:
        _openai_service = OpenAIService()
    return _openai_service
