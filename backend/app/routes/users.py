
from app.services.affinity_service import get_user_preferences
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["User"],
)
@router.get("/affinity")
def affinity(
    current_user=Depends(get_current_user),
):
    return get_user_preferences(
        str(current_user["_id"])
    )


@router.get("/profile")
def profile(
    current_user=Depends(get_current_user),
):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "gender": current_user["gender"],
        "region": current_user["region"],
    }