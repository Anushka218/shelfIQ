from typing import Optional

from fastapi import APIRouter

from app.services.filter_service import filter_products

router = APIRouter()


@router.get("/")
def filter_products_route(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    color: Optional[str] = None,
    material: Optional[str] = None,
    occasion: Optional[str] = None,
    season: Optional[str] = None,
    gender: Optional[str] = None,
    region: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_rating: Optional[float] = None,
):
    return filter_products(
        category,
        brand,
        color,
        material,
        occasion,
        season,
        gender,
        region,
        min_price,
        max_price,
        min_rating,
    )