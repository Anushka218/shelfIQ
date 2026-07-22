class SellerScorer:

    @staticmethod
    def score(
        seller,
        category,
        region,
    ):
        score = 0
        reasons = []

        # Category match (already filtered)
        score += 20
        reasons.append(f"Specializes in {category}")

        # Primary region
        if seller["primary_region"] == region:
            score += 25
            reasons.append("Located in target region")

        # Serviceable region
        elif region in seller["serviceable_regions"]:
            score += 15
            reasons.append("Can serve target region")

        # Rating
        rating_score = seller["rating"] * 10
        score += rating_score
        reasons.append(f"Highly rated ({seller['rating']})")

        # Inventory
        inventory = seller["estimated_inventory"]

        if inventory >= 500:
            score += 15
            reasons.append("Large inventory")

        elif inventory >= 250:
            score += 10
            reasons.append("Moderate inventory")

        else:
            score += 5

        # Verification
        if seller["verified"]:
            score += 10
            reasons.append("Verified business")

        #priority
        if score >= 100:
            priority = "High"
        elif score >= 85:
            priority = "Medium"
        else:
            priority = "Low"

        explanation = (
    f"Recommended because the seller has a {seller['rating']} rating, "
    f"{'is verified' if seller['verified'] else 'is not verified'}, "
    f"and has an estimated inventory of {seller['estimated_inventory']} products."
)

        return {
            "score": round(score, 1),
            "priority":priority,
            "explanation":explanation,
            "reasons": reasons,
        }