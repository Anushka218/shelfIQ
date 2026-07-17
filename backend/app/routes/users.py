from fastapi import APIRouter
from app.services.affinity_service import get_user_preferences
router = APIRouter()
@router.get("/{user_id}/affinity")
def affinity(user_id: str):
    return get_user_preferences(user_id)