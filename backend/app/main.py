from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ( analytics, events, filter, health, products, search,shelf,trends,)
from app.routes.demand import router as demand_router
from app.config import APP_NAME, APP_VERSION
from app.routes.seller import router as seller_router
from app.routes.auth import router as auth_router
from app.routes.users import router as user_router
from app.routes.admin import router as admin_router

app = FastAPI(title=APP_NAME, version=APP_VERSION)


@app.get("/")
def health_check():
    return {"status": "ShelfIQ backend is running"}

app.include_router(
    products.router,
    prefix="/api/products",
    tags=["Products"]
)

app.include_router(
    events.router,
    prefix="/api/events",
    tags=["Events"]
)
app.include_router(
    trends.router,
    prefix="/api/trends",
    tags=["Trends"]
)
app.include_router(
    shelf.router,
    prefix="/api/shelf",
    tags=["Shelf"]
)
app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"]
)
app.include_router(
    search.router,
    prefix="/api/search",
    tags=["Search"]
)
app.include_router(
    filter.router,
    prefix="/api/products/filter",
    tags=["Filters"]
)
app.include_router(
    health.router,
    prefix="/health",
    tags=["Health"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(demand_router)
app.include_router(seller_router)