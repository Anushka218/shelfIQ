from fastapi import APIRouter
from app.models.shelf import ShelfResponse
from app.services.shelf_service import build_shelf

router = APIRouter()


@router.get("/{user_id}", response_model=ShelfResponse)
def get_shelf(user_id: str):
    return build_shelf(user_id)