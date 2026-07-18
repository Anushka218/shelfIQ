from pydantic import BaseModel


class Event(BaseModel):
    event_id: str
    user_id: str
    region: str
    timestamp: str
    search_query: str
    product_id: str
    clicked: bool
    wishlisted: bool
    purchased: bool