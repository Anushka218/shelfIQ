from app.database import products_collection
from app.utils.region import normalize_region
from app.logger import logger

def exact_match(value):
    """
    Creates a case-insensitive exact-match regex.
    Example:
    kurta -> matches Kurta, KURTA, kurta
    """
    return {
        "$regex": f"^{value}$",
        "$options": "i"
    }
def filter_products(category=None,brand=None,color=None,material=None,occasion=None,season=None,gender=None, region=None, min_price=None,max_price=None,min_rating=None,):
    query = {}
    if category:
      query["category"] = exact_match(category)
    if brand:
      query["brand"] = exact_match(brand)
    if color:
      query["color"] = exact_match(color)
    if material:
      query["material"] =  exact_match(material)
    if occasion:
       query["occasion"] = exact_match(occasion)
    if season:
       query["season"] = exact_match(season)
    if gender:
       query["gender"] = exact_match(gender)
    if region:
        region = normalize_region(region)
        query["available_regions"] = exact_match(region)
    price_filter = {}
    if min_price is not None:
      price_filter["$gte"] = min_price
    if max_price is not None:
      price_filter["$lte"] = max_price
    if price_filter:
      query["price"] = price_filter
    if min_rating is not None:
      query["rating"] = {
        "$gte": min_rating
      }
    logger.info(f"MongoDB Query: {query}")
    products = list(products_collection.find(query,{"_id": 0}))
    return {"filters": query,"count": len(products), "results": products}