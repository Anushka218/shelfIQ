from typing import Optional
from pydantic import BaseModel


class ParsedQuery(BaseModel):
    category: Optional[str] = None
    brand: Optional[str] = None
    price_limit: Optional[int] = None
    color: Optional[str] = None
    occasion: Optional[str] = None
    material: Optional[str] = None
    gender: Optional[str] = None