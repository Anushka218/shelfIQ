from fastapi import APIRouter,Depends
from app.dependencies import get_current_admin
from app.services.seller_service import get_seller_dashboard

router = APIRouter(
    prefix="/seller",
    tags=["Seller Intelligence"],
)


@router.get("/dashboard")
def seller_dashboard(region: str,current_admin=Depends(get_current_admin)):

    return get_seller_dashboard(region)