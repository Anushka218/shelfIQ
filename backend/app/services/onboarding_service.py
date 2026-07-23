from app.providers.mongo_provider import MongoSellerProvider
from app.services.gap_service import detect_catalog_gap
from app.scoring.seller_scorer import SellerScorer

class OnboardingService:

    def __init__(self, provider=None):
        self.provider = provider or MongoSellerProvider()

    def recommend_sellers(self, region: str):

        catalog_gaps = detect_catalog_gap(region)

        recommendations = []

        for gap in catalog_gaps:

            category = gap["category"]

            sellers = self.provider.discover_sellers(
                category=category.title(),
                region=region,
            )

            ranked_sellers = []
            for seller in sellers:
                result = SellerScorer.score(
                    seller=seller,
                    category=category,
                    region=region,
                )

                ranked_sellers.append(
                    {
                        "seller_id": seller["seller_id"],
                        "business_name": seller["business_name"],
                        "primary_region": seller["primary_region"],
                        "rating": seller["rating"],
                        "verified": seller["verified"],
                        "estimated_inventory": seller["estimated_inventory"],
                        "match_score": result["score"],
                        "priority":result["priority"],
                        "explanation": result["explanation"],
                        "reasons": result["reasons"],
                    }
                )

            ranked_sellers.sort(
               key=lambda x: x["match_score"],
               reverse=True,
        )
            top_sellers = ranked_sellers[:5]

            recommendations.append(
                {
                    "category":category,
                    "catalog_gap":gap,
                    "recommended_sellers":top_sellers
                }
            )

        return recommendations