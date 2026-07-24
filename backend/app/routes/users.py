
from app.services.affinity_service import get_user_preferences
from fastapi import APIRouter, Depends
from app.services.event_service import (toggle_wishlist,mark_purchase,mark_clicked)
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

@router.post("/wishlist/{product_id}")
def wishlist(
    product_id: str,
    current_user=Depends(get_current_user),
):
    return toggle_wishlist(
        current_user,
        product_id,
    )
@router.post("/purchase/{product_id}")
def purchase(
    product_id: str,
    current_user=Depends(get_current_user),
):
    return mark_purchase(
        current_user,
        product_id,
    )
@router.post("/click/{product_id}")
def click(
    product_id: str,
    current_user=Depends(get_current_user),
):
    return mark_clicked(
        current_user,
        product_id,
    )