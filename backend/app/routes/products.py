from fastapi import APIRouter
from app.database import products_collection
from app.models.product import Product
from app.models.search import SearchResponse
from app.models.shelf import ShelfResponse
from app.models.analytics import AnalyticsResponse
router = APIRouter()

@router.get("/", response_model=list[Product])
def get_products():
    products = list(products_collection.find({}, {"_id": 0}))
    return {
        "count": len(products),
        "products": products
    }

@router.get("/", response_model=SearchResponse)
def search(q: str):
    return search_products(q)


@router.get("/{user_id}", response_model=ShelfResponse)
def get_shelf(user_id: str):
    return build_shelf(user_id)

@router.get("/", response_model=AnalyticsResponse)
def analytics():
    return get_analytics()