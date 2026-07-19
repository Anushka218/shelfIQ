from fastapi import APIRouter
from app.models.shelf import ShelfResponse
from app.services.shelf_service import build_shelf
from app.services.explain_service import explain_recommendation

router = APIRouter()


@router.get("/{user_id}", response_model=ShelfResponse)
def get_shelf(user_id: str):
    return build_shelf(user_id)

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