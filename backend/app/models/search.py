from pydantic import BaseModel
from app.models.product import Product

class SearchResponse(BaseModel):
    query: str
    count: int
    results: list[Product]