from collections import Counter
from app.database import events_collection, products_collection
from fastapi import HTTPException
from app.utils.region import normalize_region
from app.logger import logger

def get_region_trends(region: str):
    # Fetch events for the region
    events = list(events_collection.find({"region": region}, {"_id": 0}))

    if not events:
        raise HTTPException(
          status_code=404,
          detail="Region not found"
        )

    # Build a lookup: product_id -> category
    product_lookup = {}

    products = products_collection.find({}, {"_id": 0, "product_id": 1, "category": 1})

    for product in products:
        product_lookup[product["product_id"]] = product["category"]
    # Count categories
    category_counter = Counter()
    for event in events:
        category = product_lookup.get(event["product_id"])

        if category:
            SEARCH_WEIGHT = 1
            CLICK_WEIGHT = 2
            WISHLIST_WEIGHT = 3
            PURCHASE_WEIGHT = 5
            score = SEARCH_WEIGHT  # Search
            if event["clicked"]:
                score +=  CLICK_WEIGHT
            if event["wishlisted"]:
                score +=  WISHLIST_WEIGHT

            if event["purchased"]:
                 score += PURCHASE_WEIGHT
            category_counter[category] += score

    # Top 5 categories
    top_categories = []
    for category, count in category_counter.most_common(5):
        top_categories.append({
            "category": category,
            "score": count
        })
    return {
        "region": normalize_region(region),
        "top_categories": top_categories
    }