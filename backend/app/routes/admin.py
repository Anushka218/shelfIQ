from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def dashboard(admin=Depends(get_current_admin)):
    return {
        "message": "Welcome Admin",
        "admin": {
            "id": str(admin["_id"]),
            "name": admin["name"],
            "email": admin["email"],
            "role": admin["role"],
        },
    }