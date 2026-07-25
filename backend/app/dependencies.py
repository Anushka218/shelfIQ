from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.config import SECRET_KEY, ALGORITHM
from app.database import users_collection

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    if credentials is None:
        raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Not authenticated",
        )
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user

def get_current_admin(
       current_user=Depends(get_current_user),
    ):
    if current_user["role"]!="admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    if credentials is None:
        return None

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            return None

    except JWTError:
        return None

    user = users_collection.find_one({"email": email})

    return user