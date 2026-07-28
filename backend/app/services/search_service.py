import re
from app.database import products_collection
from app.logger import logger
from app.ai.query_parser import parse_search_query
from app.services.event_service import create_search_event
from typing import Optional

from app.ai.schemas import ParsedQuery


def build_search_filters(
    parsed: ParsedQuery,
    ignored_fields: set[str] | None = None,
) -> dict:

    if ignored_fields is None:
        ignored_fields = set()

    filters = {}

    if parsed.category and "category" not in ignored_fields:
        filters["category"] = {
            "$regex": f"^{parsed.category}$",
            "$options": "i",
        }

    if parsed.brand and "brand" not in ignored_fields:
        filters["brand"] = {
            "$regex": f"^{parsed.brand}$",
            "$options": "i",
        }

    if parsed.color and "color" not in ignored_fields:
        filters["color"] = {
            "$regex": f"^{parsed.color}$",
            "$options": "i",
        }

    if parsed.material and "material" not in ignored_fields:
        filters["material"] = {
            "$regex": f"^{parsed.material}$",
            "$options": "i",
        }

    if parsed.occasion and "occasion" not in ignored_fields:
        filters["occasion"] = {
            "$regex": f"^{parsed.occasion}$",
            "$options": "i",
        }

    if parsed.gender and "gender" not in ignored_fields:
        filters["gender"] = {
            "$regex": f"^{parsed.gender}$",
            "$options": "i",
        }

    if (
        parsed.price_limit is not None
        and "price_limit" not in ignored_fields
    ):
        filters["price"] = {
            "$lte": parsed.price_limit
        }

    return filters

def search_with_relaxation(parsed: ParsedQuery):

    ignored_fields = set()

    relaxation_order = []

    if parsed.occasion:
        relaxation_order.append("occasion")

    if parsed.material:
        relaxation_order.append("material")

    if parsed.color:
        relaxation_order.append("color")

    if parsed.gender:
        relaxation_order.append("gender")

    if parsed.price_limit is not None:
        relaxation_order.append("price_limit")

    if parsed.brand:
        relaxation_order.append("brand")

    while True:

        filters = build_search_filters(
            parsed,
            ignored_fields,
        )

        logger.info(f"Trying Filters: {filters}")

        products = list(
            products_collection.find(
                filters,
                {"_id": 0},
            )
        )

        logger.info(f"Found {len(products)} products")

        if products:
            logger.info(
                f"Search succeeded after ignoring: {ignored_fields}"
            )
            return products

        if len(ignored_fields) == len(relaxation_order):
            break

        ignored_fields.add(
            relaxation_order[len(ignored_fields)]
        )

    return []


def search_products(
    query: str,
    region: str = None,
    current_user: Optional[dict] = None
):
    logger.info(f"Search query: {query}")

    parsed_query = None
    products = []

    try:
        parsed_query = parse_search_query(query)
        logger.info(f"Parsed Query: {parsed_query}")

        if parsed_query:
            products = search_with_relaxation(parsed_query)

    except Exception as e:
        logger.error(f"Failed to parse search query: {e}")

    if not products:
        logger.info("Using regex fallback search...")

        normalized_query = re.sub(
            r"[^a-zA-Z0-9\s]",
            "",
            query.lower().strip()
        )

        products = list(
            products_collection.find(
                {
                    "$or": [
                        {"title": {"$regex": normalized_query, "$options": "i"}},
                        {"brand": {"$regex": normalized_query, "$options": "i"}},
                        {"category": {"$regex": normalized_query, "$options": "i"}},
                        {"color": {"$regex": normalized_query, "$options": "i"}},
                        {"material": {"$regex": normalized_query, "$options": "i"}},
                        {"occasion": {"$regex": normalized_query, "$options": "i"}},
                    ]
                },
                {"_id": 0},
            )
        )

    logger.info(f"Found {len(products)} products")

    create_search_event(
         user=current_user,
         search_query=query,
         parsed_query=parsed_query,
)

    return {
    "query": query,
    "count": len(products),
    "results": products,
}