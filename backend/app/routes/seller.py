from fastapi import APIRouter

from app.services.seller_service import get_seller_dashboard

router = APIRouter(
    prefix="/seller",
    tags=["Seller Intelligence"],
)


@router.get("/dashboard")
def seller_dashboard(region: str):

    return get_seller_dashboard(region)