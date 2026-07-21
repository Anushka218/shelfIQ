from collections import Counter

from app.database import events_collection, products_collection


def get_region_demand(region: str):
    # Build product_id -> category lookup
    product_lookup = {
        product["product_id"]: product["category"]
        for product in products_collection.find(
            {},
            {
                "_id": 0,
                "product_id": 1,
                "category": 1
            }
        )
    }

    events = list(
        events_collection.find(
            {"region": region},
            {
                "_id": 0,
                "product_id": 1
            }
        )
    )

    counter = Counter()

    for event in events:
        category = product_lookup.get(event["product_id"])

        if category:
            counter[category] += 1

    return {
        "region": region,
        "demand": [
            {
                "category": category,
                "count": count
            }
            for category, count in counter.most_common()
        ]
    }