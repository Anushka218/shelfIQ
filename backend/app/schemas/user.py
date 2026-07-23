from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

# ---------- Registration ----------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    region: str


# ---------- Login ----------

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------- User Response ----------

class UserResponse(BaseModel):
    id: Optional[str] = None

    name: str
    email: EmailStr
    role: UserRole

    region: Optional[str] = None

    created_at: datetime


# ---------- Login Response ----------

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

    user: UserResponse