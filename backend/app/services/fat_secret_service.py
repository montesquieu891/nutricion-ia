"""
FatSecret API Service - Integration with FatSecret Platform API
Handles OAuth2 authentication and food search functionality
"""

import base64
import httpx
import logging
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from app.config import settings

logger = logging.getLogger(__name__)


class FatSecretService:
    """Service for interacting with FatSecret Platform API"""
    
    # FatSecret API endpoints
    TOKEN_URL = "https://oauth.fatsecret.com/connect/token"
    API_BASE_URL = "https://platform.fatsecret.com/rest/server.api"
    
    def __init__(self):
        self.client_id = settings.FATSECRET_CLIENT_ID
        self.client_secret = settings.FATSECRET_CLIENT_SECRET
        self.access_token: Optional[str] = None
        self.token_expiry: Optional[datetime] = None
        self._http_client: Optional[httpx.AsyncClient] = None
    
    async def _get_http_client(self) -> httpx.AsyncClient:
        """Get or create the HTTP client instance"""
        if self._http_client is None or self._http_client.is_closed:
            self._http_client = httpx.AsyncClient(timeout=30.0)
        return self._http_client
    
    async def close(self):
        """Close the HTTP client connection"""
        if self._http_client is not None:
            await self._http_client.aclose()
            self._http_client = None
    
    async def _get_access_token(self) -> str:
        """
        Authenticate with FatSecret API using OAuth2 client credentials flow
        Returns an access token for API requests
        """
        # Create Basic Authentication header
        credentials = f"{self.client_id}:{self.client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        data = {
            "grant_type": "client_credentials",
            "scope": "basic"
        }
        
        client = await self._get_http_client()
        response = await client.post(
            self.TOKEN_URL,
            headers=headers,
            data=data
        )
        response.raise_for_status()
        token_data = response.json()
        
        # Store token and expiry time (subtract 60 seconds for safety margin)
        expires_in = token_data.get("expires_in", 3600)
        self.token_expiry = datetime.now() + timedelta(seconds=expires_in - 60)
        
        return token_data["access_token"]
    
    def _is_token_expired(self) -> bool:
        """Check if the current token is expired or about to expire"""
        if not self.access_token or not self.token_expiry:
            return True
        return datetime.now() >= self.token_expiry
    
    async def _ensure_authenticated(self):
        """Ensure we have a valid access token"""
        if self._is_token_expired():
            self.access_token = await self._get_access_token()
    
    async def _make_api_request(
        self, 
        params: Dict[str, Any], 
        max_retries: int = 3,
        retry_delay: float = 1.0
    ) -> Dict:
        """
        Make an API request with retry logic
        
        Args:
            params: Query parameters for the API request
            max_retries: Maximum number of retry attempts
            retry_delay: Delay between retries in seconds
        
        Returns:
            Response data as dictionary
            
        Raises:
            httpx.HTTPError: If all retry attempts fail
        """
        await self._ensure_authenticated()
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        client = await self._get_http_client()
        last_exception = None
        
        for attempt in range(max_retries):
            try:
                response = await client.get(
                    self.API_BASE_URL,
                    headers=headers,
                    params=params
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPStatusError as e:
                last_exception = e
                # Don't retry on 4xx errors (client errors)
                if 400 <= e.response.status_code < 500:
                    logger.error(f"Client error in FatSecret API: {e}")
                    raise
                    
                # Retry on 5xx errors (server errors)
                logger.warning(
                    f"Server error in FatSecret API (attempt {attempt + 1}/{max_retries}): {e}"
                )
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))  # Exponential backoff
                    
            except (httpx.RequestError, httpx.TimeoutException) as e:
                last_exception = e
                logger.warning(
                    f"Request error in FatSecret API (attempt {attempt + 1}/{max_retries}): {e}"
                )
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
        
        # If we get here, all retries failed
        logger.error(f"All retry attempts failed: {last_exception}")
        raise last_exception
    
    async def search_foods(self, search_query: str, max_results: int = 20) -> List[Dict[str, Any]]:
        """
        Search for foods in the FatSecret database
        
        Args:
            search_query: The food name to search for (e.g., "pollo", "chicken")
            max_results: Maximum number of results to return (default: 20)
        
        Returns:
            List of food items with basic information (name, ID, and main macros)
        """
        params = {
            "method": "foods.search",
            "search_expression": search_query,
            "format": "json",
            "max_results": max_results
        }
        
        data = await self._make_api_request(params)
        
        # Parse and format the response
        return self._format_search_results(data)
    
    async def get_food_details(self, food_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific food item
        
        Args:
            food_id: The FatSecret food ID (obtained from search_foods)
        
        Returns:
            Detailed food information including all available nutritional data
            
        Example:
            {
                "id": "12345",
                "nombre": "Chicken Breast",
                "descripcion": "Per 100g - Calories: 165 | Fat: 3.6g | Carbs: 0g | Protein: 31g",
                "servings": [...],
                "calorias": 165.0,
                "proteina": 31.0,
                "carbohidratos": 0.0,
                "grasas": 3.6
            }
        """
        params = {
            "method": "food.get",
            "food_id": food_id,
            "format": "json"
        }
        
        data = await self._make_api_request(params)
        
        # Parse and format the detailed response
        return self._format_food_details(data)
    
    def _format_food_details(self, api_response: Dict) -> Dict[str, Any]:
        """
        Format detailed food information from FatSecret API response
        
        Args:
            api_response: Raw response from FatSecret food.get API
        
        Returns:
            Formatted food details with nutritional information
        """
        if "food" not in api_response:
            logger.warning("No food data in API response")
            return {}
        
        food = api_response["food"]
        
        formatted_food = {
            "id": food.get("food_id"),
            "nombre": food.get("food_name"),
            "descripcion": food.get("food_description", ""),
            "tipo": food.get("food_type", ""),
            "url": food.get("food_url", ""),
        }
        
        # Parse servings if available
        servings_data = food.get("servings")
        if servings_data:
            servings = servings_data.get("serving", [])
            if isinstance(servings, dict):
                servings = [servings]
            
            formatted_food["servings"] = []
            for serving in servings:
                serving_info = {
                    "serving_id": serving.get("serving_id"),
                    "serving_description": serving.get("serving_description"),
                    "metric_serving_amount": serving.get("metric_serving_amount"),
                    "metric_serving_unit": serving.get("metric_serving_unit"),
                    "calories": float(serving.get("calories", 0)),
                    "protein": float(serving.get("protein", 0)),
                    "carbohydrate": float(serving.get("carbohydrate", 0)),
                    "fat": float(serving.get("fat", 0)),
                }
                formatted_food["servings"].append(serving_info)
            
            # Use the first serving as default nutritional values
            if servings:
                first_serving = servings[0]
                formatted_food["calorias"] = float(first_serving.get("calories", 0))
                formatted_food["proteina"] = float(first_serving.get("protein", 0))
                formatted_food["carbohidratos"] = float(first_serving.get("carbohydrate", 0))
                formatted_food["grasas"] = float(first_serving.get("fat", 0))
        else:
            # Try to parse from description if servings not available
            description = food.get("food_description", "")
            if description:
                macros = self._parse_macros_from_description(description)
                formatted_food.update(macros)
        
        return formatted_food
    
    def _format_search_results(self, api_response: Dict) -> List[Dict[str, Any]]:
        """
        Format FatSecret API response to a simplified structure
        
        Args:
            api_response: Raw response from FatSecret API
        
        Returns:
            List of formatted food items with basic info
        """
        formatted_results = []
        
        # Handle the case where no foods are found
        if "foods" not in api_response or not api_response["foods"]:
            return []
        
        foods = api_response["foods"].get("food", [])
        
        # Ensure foods is a list (API returns single item as dict sometimes)
        if isinstance(foods, dict):
            foods = [foods]
        
        for food in foods:
            # Extract basic nutritional information
            # FatSecret returns data per serving
            formatted_food = {
                "id": food.get("food_id"),
                "nombre": food.get("food_name"),
                "descripcion": food.get("food_description", ""),
                "tipo": food.get("food_type", ""),
                "url": food.get("food_url", "")
            }
            
            # Parse nutritional info from description if available
            # FatSecret includes macros in the description field
            description = food.get("food_description", "")
            if description:
                macros = self._parse_macros_from_description(description)
                formatted_food.update(macros)
            
            formatted_results.append(formatted_food)
        
        return formatted_results
    
    def _parse_macros_from_description(self, description: str) -> Dict[str, Optional[float]]:
        """
        Parse macronutrients from FatSecret's food_description field
        
        The description typically contains: "Calories: X | Fat: Yg | Carbs: Zg | Protein: Wg"
        
        Args:
            description: The food_description string from FatSecret
        
        Returns:
            Dictionary with parsed macro values
        """
        import re
        
        macros = {
            "calorias": None,
            "proteina": None,
            "carbohidratos": None,
            "grasas": None
        }
        
        try:
            # Split by pipe separator and process each nutrient
            parts = description.split("|")
            
            for part in parts:
                part = part.strip().lower()
                
                # Extract calories
                if "calories" in part or "kcal" in part:
                    # Extract number (integer or float) from string like "Calories: 165" or "Calories: 165.5"
                    match = re.search(r'(\d+\.?\d*)', part)
                    if match:
                        macros["calorias"] = float(match.group(1))
                
                # Extract protein
                elif "protein" in part or "proteina" in part:
                    match = re.search(r'(\d+\.?\d*)', part)
                    if match:
                        macros["proteina"] = float(match.group(1))
                
                # Extract carbs
                elif "carb" in part or "carbohidrato" in part:
                    match = re.search(r'(\d+\.?\d*)', part)
                    if match:
                        macros["carbohidratos"] = float(match.group(1))
                
                # Extract fat
                elif "fat" in part or "grasa" in part:
                    match = re.search(r'(\d+\.?\d*)', part)
                    if match:
                        macros["grasas"] = float(match.group(1))
        
        except Exception as e:
            # If parsing fails, log and return empty macros
            logger.warning(f"Failed to parse macros from description: {e}")
        
        return macros
