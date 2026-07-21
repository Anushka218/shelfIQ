from pydantic import BaseModel
from typing import Optional
from app.ai.schemas import ParsedQuery


class Event(BaseModel):
    event_id: str
    user_id: str
    region: str
    timestamp: str
    search_query: str

    parsed_query:ParsedQuery

    product_id: str
    clicked: bool
    wishlisted: bool
    purchased: bool