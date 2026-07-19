from fastapi import APIRouter
from app.models.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics

router = APIRouter(
    prefix="/api",
    tags=["Analytics"]
)

@router.get("/", response_model=AnalyticsResponse)
def analytics():
    return get_analytics()