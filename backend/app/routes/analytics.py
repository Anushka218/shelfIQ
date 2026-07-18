from fastapi import APIRouter
from app.services.analytics_service import get_analytics

router = APIRouter(
    prefix="/api",
    tags=["Analytics"]
)

@router.get("/analytics")
def analytics():
    return get_analytics()