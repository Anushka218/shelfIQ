from fastapi import APIRouter
from app.services.trend_service import get_region_trends

router = APIRouter()
@router.get("/{region}")
def trends(region: str):
    return get_region_trends(region)