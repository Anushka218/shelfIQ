from pydantic import BaseModel


class TrendItem(BaseModel):
    category: str
    score: int


class TrendResponse(BaseModel):
    region: str
    top_categories: list[TrendItem]