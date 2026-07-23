from pydantic import BaseModel, EmailStr,Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    name:str
    email:EmailStr
    password:str
    role:str = "user"
    gender:str
    region:str

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


