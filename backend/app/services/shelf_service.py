from app.database import products_collection
from app.services.trend_service import get_region_trends
from app.services.affinity_service import get_user_preferences
from app.logger import logger
from typing import Optional


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


def build_shelf(region: str,user_id: Optional[str] = None):
    # Get regional trends
    trend_data = get_region_trends(region)

    if user_id:
       affinity_data = get_user_preferences(user_id)
       event_count = affinity_data["event_count"]
       alpha = max( 0.5, 1 - event_count / 20)
       category_scores = to_score_map(affinity_data["favorite_categories"])
       brand_scores = to_score_map(affinity_data["favorite_brands"])
       color_scores = to_score_map(  affinity_data["favorite_colors"])
    else:
       alpha = 1.0
       category_scores = {}
       brand_scores = {}
       color_scores = {}
    # Convert results into dictionaries
    trend_scores = {
        item["category"]: item["score"]
        for item in trend_data["top_categories"]
    }
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
        category = product["category"]
        brand = product["brand"]
        color = product["color"]

        trend = trend_scores.get(category, 0)

        cat_score = category_scores.get(category, 0)
        brand_score = brand_scores.get(brand, 0)
        color_score = color_scores.get(color, 0)

        personal_score = (
            cat_score
           + brand_score
           + color_score
        )
        score = 0
        reasons = []

        # ---------- Regional Trend ----------
        if trend:
            reasons.append(f"Trending in {region}")

        # ---------- Category Affinity ----------

        if cat_score:
            reasons.append("Matches your favourite category")

        # ---------- Brand Affinity ----------

        if brand_score:
            reasons.append("Matches your favourite brand")

        if color_score:
            reasons.append("Matches your favourite colour")

        if product["rating"] >= 4.5:
            reasons.append("Highly rated")

        if product["discount"] >= 20:
            reasons.append("Good discount")
        rating_bonus = product["rating"] * 2
        discount_bonus = product["discount"] / 5
        score = (alpha * trend + (1 - alpha) * personal_score + rating_bonus + discount_bonus)
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
    return { "user_id": user_id, "region": region,"alpha": round(alpha, 2),"recommendations": recommendations[:10]}