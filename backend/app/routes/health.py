from fastapi import APIRouter

from app.config import APP_NAME, APP_VERSION
from app.database import client

router = APIRouter()


@router.get("/")
def health():
    try:
        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected",
            "application": APP_NAME,
            "version": APP_VERSION
        }

    except Exception:
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }