from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    region: str
    gender: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id:str
    name: str
    email: EmailStr
    role: str
    gender: str
    region: str

    created_at: datetime

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

    user: UserResponse