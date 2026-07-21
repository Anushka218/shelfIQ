from fastapi import FastAPI
from app.routes import events, products,trends,users,shelf,analytics,search,filter,health
from app.routes.demand import router as demand_router
from app.config import APP_NAME, APP_VERSION
from fastapi.middleware.cors import CORSMiddleware

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
    users.router,
    prefix="/api/users",
    tags=["Users"]
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
app.include_router(demand_router)