from fastapi import APIRouter,Depends
from app.models.shelf import ShelfResponse
from app.services.shelf_service import build_shelf
from app.services.explain_service import explain_recommendation
from typing import Optional
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/user/shelf",
    tags=["Shelf"],
)


@router.get("/")
def get_shelf(
    current_user=Depends(get_current_user),
):
    return build_shelf(
        current_user["region"],
        str(current_user["_id"]),
    )

@router.get("/explain/{product_id}")
def explain_product(
    product_id: str,
    current_user=Depends(get_current_user),
):
    return explain_recommendation(
        current_user["region"],
        product_id,
        str(current_user["_id"]),
    )