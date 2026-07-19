from collections import Counter
from app.logger import logger
from app.database import events_collection, products_collection
from fastapi import HTTPException

def get_user_preferences(user_id: str):
    user_event = events_collection.find_one({"user_id": user_id})

    if not user_event:
        logger.warning(f"Affinity request failed: User '{user_id}' not found")
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    category_counter = Counter()
    brand_counter = Counter()
    color_counter = Counter()

    # Build product lookup
    product_lookup = {}

    products = products_collection.find(
        {},
        {
            "_id": 0,
            "product_id": 1,
            "category": 1,
            "brand": 1,
            "color": 1,
        },
    )

    for product in products:
        product_lookup[product["product_id"]] = product

    # Fetch user events
    events = list(events_collection.find({"user_id": user_id}, {"_id": 0},))

    if not events:
        logger.info(f"User '{user_id}' has no interactions")
        return {
            "user_id": user_id,
            "favorite_categories": [],
            "favorite_brands": [],
            "favorite_colors": [],
        }

    # Process events
    for event in events:
        score = 1

        if event["clicked"]:
            score += 2

        if event["wishlisted"]:
            score += 3

        if event["purchased"]:
            score += 5

        product = product_lookup.get(event["product_id"])

        if not product:
            continue

        category_counter[product["category"]] += score
        brand_counter[product["brand"]] += score
        color_counter[product["color"]] += score

    def top(counter):
        return [
            {
                "name": name,
                "score": score,
            }
            for name, score in counter.most_common(5)
        ]
    logger.info(f"Generated affinity profile for user '{user_id}'")
    return {"user_id": user_id,"favorite_categories": top(category_counter),"favorite_brands": top(brand_counter),"favorite_colors": top(color_counter),}