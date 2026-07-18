from collections import Counter
from app.database import products_collection, events_collection

def get_analytics():
    total_products = products_collection.count_documents({})

    total_events = events_collection.count_documents({})

    total_users = len(
        events_collection.distinct("user_id")
    )

    total_regions = len(
        events_collection.distinct("region")
    )

    clicks = 0
    wishlists = 0
    purchases = 0

    region_counter = Counter()
    events = events_collection.find(
        {},
        {
            "_id": 0,
            "clicked": 1,
            "wishlisted": 1,
            "purchased": 1,
            "region": 1
        }
    )
    for event in events:

        if event.get("clicked", False):
            clicks += 1

        if event.get("wishlisted", False):
            wishlists += 1

        if event.get("purchased", False):
            purchases += 1

        region_counter[event["region"]] += 1

    top_regions = [
        {
            "region": region,
            "events": count
        }
        for region, count in region_counter.most_common()
    ]

    return {
        "total_products": total_products,
        "total_users": total_users,
        "total_events": total_events,
        "total_regions": total_regions,
        "event_breakdown": {
            "clicks": clicks,
            "wishlists": wishlists,
            "purchases": purchases
        },
        "top_regions": top_regions
    }