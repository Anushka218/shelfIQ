from pydantic import BaseModel


class Product(BaseModel):
    product_id: str
    seller_id: str
    title: str
    brand: str
    category: str
    price: int
    color: str
    material: str
    occasion: str
    gender: str
    season: str
    inventory: int
    rating: float
    discount: int
    available_regions: list[str]