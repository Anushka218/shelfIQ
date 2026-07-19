from fastapi import APIRouter
from app.models.search import SearchResponse
from app.services.search_service import search_products

router = APIRouter()


@router.get("/", response_model=SearchResponse)
def search(q: str):
    return search_products(q)