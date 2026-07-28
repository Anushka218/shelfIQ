from fastapi import APIRouter,Depends
from app.dependencies import get_current_user_optional
from app.models.search import SearchResponse
from app.services.search_service import search_products

router = APIRouter()


@router.get("/", response_model=SearchResponse)
def search(
    q: str,
    current_user=Depends(get_current_user_optional),
):
    return search_products(
    query=q,
    current_user=current_user,
)