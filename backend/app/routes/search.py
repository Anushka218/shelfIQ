from fastapi import APIRouter

from app.services.search_service import search_products

router = APIRouter()


@router.get("/")
def search(q: str):
    return search_products(q)