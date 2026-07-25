from fastapi import APIRouter, Depends
from typing import Optional

from app.dependencies import get_current_user
from app.services.shelf_service import build_shelf
from app.services.explain_service import explain_recommendation

router = APIRouter(
    prefix="/user/shelf",
    tags=["Shelf"],
)


@router.get("/")
def get_shelf(
    region: Optional[str] = None,
    current_user=Depends(get_current_user),
):
    print("Shelf endpoint called. Region =", region)
    selected_region = region or current_user["region"]

    return build_shelf(
        selected_region,
        str(current_user["_id"]),
    )


@router.get("/explain/{product_id}")
def explain_product(
    product_id: str,
    region: Optional[str] = None,
    current_user=Depends(get_current_user),
):
    selected_region = region or current_user["region"]

    return explain_recommendation(
        selected_region,
        product_id,
        str(current_user["_id"]),
    )