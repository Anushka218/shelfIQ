from fastapi import APIRouter

from app.services.demand_service import get_region_demand

router = APIRouter(
    prefix="/api/demand",
    tags=["Demand"]
)


@router.get("/{region}")
def demand(region: str):
    return get_region_demand(region)