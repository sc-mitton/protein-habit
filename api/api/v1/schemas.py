from typing import List, Optional
from pydantic import BaseModel


class RecipeResponse(BaseModel):
    id: int
    description: Optional[str] = None
    ingredients: Optional[str] = None
    instructions: Optional[str] = None
    thumbnail: Optional[str] = None
    cuisines: List[str] = []
    meal_types: List[str] = []
    proteins: List[str] = []
    diet_types: List[str] = []


class RecipeListResponse(BaseModel):
    recipes: List[RecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
