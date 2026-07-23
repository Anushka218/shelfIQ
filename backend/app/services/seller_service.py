from app.services.onboarding_service import OnboardingService
from app.services.gap_service import (
    detect_catalog_gap,
    detect_price_gap,
    detect_brand_opportunity,
    detect_attribute_opportunity,
)



def get_seller_dashboard(region: str):

    attributes = [
        "color",
        "material",
        "occasion",
        "gender",
    ]

    attribute_opportunities = []

    for attribute in attributes:
        attribute_opportunities.extend(
            detect_attribute_opportunity(region, attribute)
        )

    attribute_opportunities.sort(
        key=lambda x: x["opportunity_score"],
        reverse=True,
    )

    catalog_gaps = detect_catalog_gap(region)

    pricing_opportunities = detect_price_gap(region)

    brand_opportunities = detect_brand_opportunity(region)

    onboarding_service = OnboardingService()

    seller_recommendations = onboarding_service.recommend_sellers(region)

    return {
        "region": region,
        "catalog_gaps": catalog_gaps,
        "pricing_opportunities": pricing_opportunities,
        "brand_opportunities": brand_opportunities,
        "attribute_opportunities": attribute_opportunities,
        "seller_recommendations": seller_recommendations,

        "summary": {
            "catalog_gap_count": len(catalog_gaps),
            "pricing_opportunity_count": len(pricing_opportunities),
            "brand_opportunity_count": len(brand_opportunities),
            "attribute_opportunity_count": len(attribute_opportunities),
            "seller_recommendation_count": len(seller_recommendations),

            "top_catalog_gap": (
                catalog_gaps[0]["category"]
                if catalog_gaps
                else None
            ),

            "top_pricing_opportunity": (
                pricing_opportunities[0]["category"]
                if pricing_opportunities
                else None
            ),

            "top_brand_opportunity": (
                brand_opportunities[0]["brand"]
                if brand_opportunities
                else None
            ),

            "top_attribute_opportunity": (
                f"{attribute_opportunities[0]['value'].title()} "
                f"{attribute_opportunities[0]['category'].title()}"
                if attribute_opportunities
                else None
            ),

            "total_insights": (
                len(catalog_gaps)
                + len(pricing_opportunities)
                + len(brand_opportunities)
                + len(attribute_opportunities)
            ),
        },
    }