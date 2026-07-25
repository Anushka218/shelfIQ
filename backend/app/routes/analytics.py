from fastapi import APIRouter, Depends, HTTPException
import traceback

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
    try:
        return get_analytics()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )