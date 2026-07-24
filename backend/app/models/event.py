from pydantic import BaseModel
from typing import Optional
from app.ai.schemas import ParsedQuery


class Event(BaseModel):
    event_id: str
    user_id: str
    region: str
    timestamp: str
    search_query: Optional[str]=None

    parsed_query:Optional[ParsedQuery]=None

    product_id: Optional[str]
    clicked: bool=False
    wishlisted: bool=False
    purchased: bool=False