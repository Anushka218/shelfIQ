from datetime import datetime
from app.database import users_collection
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.schemas.user import ( UserCreate, UserResponse,UserLogin,LoginResponse,)
from app.services.jwt_service import JWTService

class UserService:

    @staticmethod
    def register(user: UserCreate):

        # Check if email already exists
        existing_user = users_collection.find_one({"email": user.email})

        if existing_user:
            raise ValueError("Email already registered")

        # Create User object
        new_user = User(
            name=user.name,
            email=user.email,
            password=AuthService.hash_password(user.password),
            role="user",
            gender = user.gender,
            region=user.region,
        )

        # Insert into MongoDB
        result = users_collection.insert_one(new_user.model_dump())

        return UserResponse(
          id=str(result.inserted_id),
          name=new_user.name,
          gender=new_user.gender,
          email=new_user.email,
          role=new_user.role,
          region=new_user.region,
          created_at=new_user.created_at,
        )
    @staticmethod
    def login(user: UserLogin):

      existing_user = users_collection.find_one(
        {"email": user.email}
      )

      if not existing_user:
        raise ValueError("Invalid email or password")

      if not AuthService.verify_password(
        user.password,
        existing_user["password"],
      ):
        raise ValueError("Invalid email or password")

      token = JWTService.create_access_token(
        {
            "sub": existing_user["email"],
            "role": existing_user["role"],
        }
      )

      return LoginResponse(
        access_token=token,
        user=UserResponse(
            id=str(existing_user["_id"]),
            name=existing_user["name"],
            email=existing_user["email"],
            role=existing_user["role"],
            gender=existing_user["gender"],
            region=existing_user["region"],
            created_at=existing_user["created_at"],
        ),
      )