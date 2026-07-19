from pydantic import BaseModel


class Recommendation(BaseModel):
    product_id: str
    title: str
    brand: str
    category: str
    price: int
    score: float
    reasons: list[str]


class ShelfResponse(BaseModel):
    user_id: str
    region: str
    alpha: float
    recommendations: list[Recommendation]