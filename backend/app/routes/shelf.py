from fastapi import APIRouter
from app.models.shelf import ShelfResponse
from app.services.shelf_service import build_shelf
from app.services.explain_service import explain_recommendation
from typing import Optional

router = APIRouter()


@router.get("/{region}")
def get_shelf(region: str,user_id:Optional[str] = None):
    return build_shelf(region,user_id)

@router.get(
    "/{user_id}/explain/{product_id}"
)
def explain_product(
    user_id: str,
    product_id: str
):
    return explain_recommendation(
        user_id,
        product_id
    )