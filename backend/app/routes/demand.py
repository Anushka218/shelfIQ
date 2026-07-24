from fastapi import APIRouter, Depends
from app.dependencies import get_current_admin
from app.services.demand_service import get_region_demand

router = APIRouter(
    prefix="/api/demand",
    tags=["Demand"]
)


@router.get("/{region}")
def demand(region: str,current_admin=Depends(get_current_admin)):
    return get_region_demand(region)