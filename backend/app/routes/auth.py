from fastapi import APIRouter, HTTPException, status,Depends
from app.schemas.user import (UserCreate,UserResponse,  UserLogin,LoginResponse,)
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService
from app.dependencies import (
    get_current_user,
    get_current_admin,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserCreate):
    try:
        return UserService.register(user)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(user: UserLogin):
    try:
        return UserService.login(user)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )



@router.get("/admin")
def admin_dashboard(
    admin=Depends(get_current_admin),
):
    return {
        "message": "Welcome Admin",
        "admin": {
            "id": str(admin["_id"]),
            "name": admin["name"],
            "email": admin["email"],
            "role": admin["role"],
        },
    }
