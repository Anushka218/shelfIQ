from app.database import products_collection, events_collection
from app.services.trend_service import get_region_trends
from app.services.affinity_service import get_user_preferences
from app.logger import logger
from fastapi import HTTPException

def to_score_map(items):
    """
    Converts:
    [
        {"name": "...", "score": 10},
        ...
    ]

    into

    {
        "...": 10
    }
    """
    return {
        item["name"]: item["score"]
        for item in items
    }


def build_shelf(user_id: str):
    # Find user's region
    user_event = events_collection.find_one(
        {"user_id": user_id},
        {
            "_id": 0,
            "region": 1
        }
    )
    logger.warning(f"Shelf request failed: User '{user_id}' not found")
    if not user_event:
        raise HTTPException(
          status_code=404,
          detail="User not found"
        )

    region = user_event["region"]
    # Get regional trends
    trend_data = get_region_trends(region)

    # Get user affinity
   
    affinity_data = get_user_preferences(user_id)
    # Convert results into dictionaries
    trend_scores = {
        item["category"]: item["score"]
        for item in trend_data["top_categories"]
    }

    category_scores = to_score_map(
        affinity_data["favorite_categories"]
    )

    brand_scores = to_score_map(
        affinity_data["favorite_brands"]
    )

    color_scores = to_score_map(
        affinity_data["favorite_colors"]
    )
    # Fetch products available in the user's region
    products = list(
        products_collection.find(
            {
                "available_regions": region
            },
            {
                "_id": 0
            }
        )
    )

    recommendations = []

    # Score each product
    for product in products:

        score = 0
        reasons = []

        # ---------- Regional Trend ----------
        category = product["category"]

        trend = trend_scores.get(category, 0)

        score += trend

        if trend:
            reasons.append(f"Trending in {region}")

        # ---------- Category Affinity ----------
        cat_score = category_scores.get(category, 0)

        score += cat_score

        if cat_score:
            reasons.append("Matches your favourite category")

        # ---------- Brand Affinity ----------
        brand = product["brand"]

        brand_score = brand_scores.get(brand, 0)

        score += brand_score

        if brand_score:
            reasons.append("Matches your favourite brand")

        color = product["color"]

        color_score = color_scores.get(color, 0)

        score += color_score

        if color_score:
            reasons.append("Matches your favourite colour")

        # ---------- Rating Bonus ----------
        rating_bonus = product["rating"] * 2

        score += rating_bonus

        if product["rating"] >= 4.5:
            reasons.append("Highly rated")

        # ---------- Discount Bonus ----------
        discount_bonus = product["discount"] / 5

        score += discount_bonus

        if product["discount"] >= 20:
            reasons.append("Good discount")

        recommendations.append(
            {
                "product_id": product["product_id"],
                "title": product["title"],
                "brand": product["brand"],
                "category": product["category"],
                "price": product["price"],
                "score": round(score, 2),
                "reasons": reasons
            }
        )
    recommendations.sort(key=lambda x: x["score"],reverse=True)
    logger.info(f"Generated {len(recommendations[:10])} recommendations for user '{user_id}' in region '{region}'")
    return { "user_id": user_id, "region": region,"recommendations": recommendations[:10]}