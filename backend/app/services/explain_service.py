from app.database import products_collection,events_collection
from app.services.trend_service import get_region_trends
from app.services.affinity_service import get_user_preferences
def to_score_map(items):
    return {
        item["name"]: item["score"]
        for item in items
    }
def explain_recommendation(user_id: str, product_id: str):
    user = events_collection.find_one({"user_id": user_id},{"_id": 0, "region": 1})
    if not user:
      return {"error": "User not found"}
    region = user["region"]
    product = products_collection.find_one(
        {"product_id": product_id},
        {"_id": 0}
    )
    if not product:
        return {"error": "Product not found"}
    trend_data = get_region_trends(region)
    affinity_data = get_user_preferences(user_id)
    event_count = affinity_data["event_count"]
    alpha = max(0.5,1 - event_count / 20)

    trend_scores = {
      item["category"]: item["score"]
      for item in trend_data["top_categories"]
    }
    category_scores = to_score_map(affinity_data["favorite_categories"])
    brand_scores = to_score_map(affinity_data["favorite_brands"])
    color_scores = to_score_map(affinity_data["favorite_colors"])
    category = product["category"]
    brand = product["brand"]
    color = product["color"]
    trend = trend_scores.get(category, 0)
    category_affinity = category_scores.get(category, 0)
    brand_affinity = brand_scores.get(brand, 0)
    color_affinity = color_scores.get(color, 0)
    personal_score = (category_affinity + brand_affinity + color_affinity)
    rating_bonus = product["rating"] * 2
    discount_bonus = product["discount"] / 5
    final_score = ( alpha * trend + (1 - alpha) * personal_score  + rating_bonus + discount_bonus)
    return {
        "user_id": user_id,
        "product_id": product_id,
        "region": region,
        "alpha": round(alpha, 2),
        "breakdown": {
            "regional_trend": trend,
           "category_affinity": category_affinity,
           "brand_affinity": brand_affinity,
           "color_affinity": color_affinity,
          "rating_bonus": round(rating_bonus, 2),
           "discount_bonus": round(discount_bonus, 2),
          "final_score": round(final_score, 2)
         }
    }