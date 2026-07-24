from fastapi import APIRouter,Depends
from app.models.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics
from app.dependencies import get_current_admin

router = APIRouter(
    tags=["Analytics"]
)

@router.get("/", response_model=AnalyticsResponse)
def analytics(
    current_admin=Depends(get_current_admin),
):
    return get_analytics()