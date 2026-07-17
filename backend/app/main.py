from fastapi import FastAPI
from app.routes import events, products,trends,users,shelf

app = FastAPI(title="ShelfIQ API")

app = FastAPI()

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