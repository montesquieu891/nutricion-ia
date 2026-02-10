"""
OpenAI Service - Integration with OpenAI API for generating diets and recipes
"""

import json
import logging
from typing import Dict, List, Optional, Any
from openai import AsyncOpenAI
from app.config import settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for interacting with OpenAI API"""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generar_dieta(
        self,
        objetivo_calorias: int,
        preferencias: Optional[List[str]] = None,
        restricciones: Optional[List[str]] = None,
        dias: int = 7
    ) -> Dict[str, Any]:
        """
        Generate a personalized diet plan using OpenAI
        
        Args:
            objetivo_calorias: Target daily calories
            preferencias: List of food preferences (e.g., ["vegetales", "pescado"])
            restricciones: List of dietary restrictions (e.g., ["sin gluten", "sin lactosa"])
            dias: Number of days for the diet plan (default: 7)
        
        Returns:
            Dictionary with diet plan including meals, ingredients, and nutritional info
        """
        # Build the prompt
        prompt = self._build_diet_prompt(objetivo_calorias, preferencias, restricciones, dias)
        
        try:
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un nutricionista experto que crea planes de dieta personalizados. Responde siempre en formato JSON válido."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the response
            content = response.choices[0].message.content
            logger.info(f"OpenAI response received for diet generation")
            
            # Parse JSON from response
            diet_data = json.loads(content)
            return diet_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response as JSON: {e}")
            raise ValueError("La respuesta de OpenAI no es un JSON válido")
        except Exception as e:
            logger.error(f"Error generating diet with OpenAI: {e}")
            raise
    
    async def generar_receta(
        self,
        objetivo_calorias: Optional[int] = None,
        ingredientes_deseados: Optional[List[str]] = None,
        tipo_comida: Optional[str] = None,
        restricciones: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate a recipe using OpenAI
        
        Args:
            objetivo_calorias: Target calories for the recipe (optional)
            ingredientes_deseados: List of desired ingredients
            tipo_comida: Type of meal (e.g., "desayuno", "almuerzo", "cena", "snack")
            restricciones: List of dietary restrictions
        
        Returns:
            Dictionary with recipe including name, ingredients, instructions, and nutritional info
        """
        # Build the prompt
        prompt = self._build_recipe_prompt(
            objetivo_calorias, 
            ingredientes_deseados, 
            tipo_comida, 
            restricciones
        )
        
        try:
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un chef experto que crea recetas saludables y deliciosas. Responde siempre en formato JSON válido."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            # Parse the response
            content = response.choices[0].message.content
            logger.info(f"OpenAI response received for recipe generation")
            
            # Parse JSON from response
            recipe_data = json.loads(content)
            return recipe_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response as JSON: {e}")
            raise ValueError("La respuesta de OpenAI no es un JSON válido")
        except Exception as e:
            logger.error(f"Error generating recipe with OpenAI: {e}")
            raise
    
    def _build_diet_prompt(
        self,
        objetivo_calorias: int,
        preferencias: Optional[List[str]],
        restricciones: Optional[List[str]],
        dias: int
    ) -> str:
        """Build a prompt for diet generation"""
        prompt = f"""Crea un plan de dieta para {dias} días con un objetivo de {objetivo_calorias} calorías por día.

"""
        
        if preferencias:
            prompt += f"Preferencias alimenticias: {', '.join(preferencias)}\n"
        
        if restricciones:
            prompt += f"Restricciones dietéticas: {', '.join(restricciones)}\n"
        
        prompt += """
Responde ÚNICAMENTE con un JSON válido (sin markdown ni texto adicional) con la siguiente estructura:
{
  "nombre": "Nombre descriptivo del plan",
  "descripcion": "Breve descripción del plan de dieta",
  "dias": [
    {
      "dia": 1,
      "desayuno": {"nombre": "...", "calorias": 0, "ingredientes": ["..."]},
      "almuerzo": {"nombre": "...", "calorias": 0, "ingredientes": ["..."]},
      "cena": {"nombre": "...", "calorias": 0, "ingredientes": ["..."]},
      "snacks": [{"nombre": "...", "calorias": 0}]
    }
  ],
  "calorias_totales": 0,
  "proteina_total": 0.0,
  "carbohidratos_total": 0.0,
  "grasas_total": 0.0
}

Asegúrate de que las calorías diarias sumen aproximadamente el objetivo. Incluye valores nutricionales realistas."""
        
        return prompt
    
    def _build_recipe_prompt(
        self,
        objetivo_calorias: Optional[int],
        ingredientes_deseados: Optional[List[str]],
        tipo_comida: Optional[str],
        restricciones: Optional[List[str]]
    ) -> str:
        """Build a prompt for recipe generation"""
        prompt = "Crea una receta saludable"
        
        if tipo_comida:
            prompt += f" para {tipo_comida}"
        
        prompt += ".\n\n"
        
        if ingredientes_deseados:
            prompt += f"Ingredientes que deben incluirse: {', '.join(ingredientes_deseados)}\n"
        
        if objetivo_calorias:
            prompt += f"Objetivo aproximado de calorías: {objetivo_calorias} kcal\n"
        
        if restricciones:
            prompt += f"Restricciones dietéticas: {', '.join(restricciones)}\n"
        
        prompt += """
Responde ÚNICAMENTE con un JSON válido (sin markdown ni texto adicional) con la siguiente estructura:
{
  "nombre": "Nombre de la receta",
  "descripcion": "Breve descripción de la receta",
  "ingredientes": [
    {"nombre": "ingrediente 1", "cantidad": "100g"},
    {"nombre": "ingrediente 2", "cantidad": "2 unidades"}
  ],
  "instrucciones": "Paso a paso detallado de la preparación",
  "tiempo_preparacion": "30 minutos",
  "porciones": 2,
  "calorias": 450,
  "proteina": 25.0,
  "carbohidratos": 40.0,
  "grasas": 15.0
}

Incluye valores nutricionales realistas y proporcionales."""
        
        return prompt
