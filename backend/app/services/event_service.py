from datetime import datetime
from uuid import uuid4

from app.ai.schemas import ParsedQuery
from app.database import events_collection


def create_event(user, product_id):
    """
    Create a new event document for a user-product interaction.
    """
    event = {
        "event_id": f"E{uuid4().hex[:8].upper()}",
        "user_id": str(user["_id"]),
        "region": user["region"],
        "timestamp": datetime.utcnow().isoformat(),
        "search_query": "",
        "parsed_query": ParsedQuery().model_dump(),
        "product_id": product_id,
        "clicked": False,
        "wishlisted": False,
        "purchased": False,
    }

    events_collection.insert_one(event)

    return event

def toggle_wishlist(user, product_id):
    """
    Toggle the wishlist status for a product.
    """

    event = events_collection.find_one({
        "user_id": str(user["_id"]),
        "product_id": product_id,
    })

    if not event:
        event = create_event(user, product_id)

    new_status = not event["wishlisted"]

    events_collection.update_one(
        {
            "user_id": str(user["_id"]),
            "product_id": product_id,
        },
        {
            "$set": {
                "wishlisted": new_status
            }
        }
    )
    message = (
      "Added to wishlist"
      if new_status
      else "Removed from wishlist"
    )
    return {
        "product_id": product_id,
        "wishlisted": new_status,
        "message": message,
    }
def mark_purchase(user, product_id):
    """
    Mark a product as purchased.
    """

    event = events_collection.find_one({
        "user_id": str(user["_id"]),
        "product_id": product_id,
    })

    if not event:
        event = create_event(user, product_id)

    if event["purchased"]:
        return {
            "product_id": product_id,
            "purchased": True,
            "message": "Product already purchased"
        }

    events_collection.update_one(
        {
            "user_id": str(user["_id"]),
            "product_id": product_id,
        },
        {
            "$set": {
                "purchased": True,
                "clicked": True
            }
        }
    )

    return {
        "product_id": product_id,
        "purchased": True,
        "message": "Purchase recorded successfully"
    }

def mark_clicked(user, product_id):
    """
    Mark a product as clicked/viewed.
    """

    event = events_collection.find_one({
        "user_id": str(user["_id"]),
        "product_id": product_id,
    })

    if not event:
        event = create_event(user, product_id)

    if event["clicked"]:
        return {
            "product_id": product_id,
            "clicked": True,
            "message": "Product already clicked"
        }

    events_collection.update_one(
        {
            "user_id": str(user["_id"]),
            "product_id": product_id,
        },
        {
            "$set": {
                "clicked": True
            }
        }
    )

    return {
        "product_id": product_id,
        "clicked": True,
        "message": "Click recorded successfully"
    }