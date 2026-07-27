import re
from app.database import products_collection
from app.logger import logger
from app.ai.query_parser import parse_search_query
from app.services.event_service import create_search_event

def search_products(query: str, user):
      normalized_query = re.sub(r's$', '', query.strip(), flags=re.IGNORECASE)

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
                {"season": {"$regex": normalized_query, "$options": "i"}},
                {"gender": {"$regex": normalized_query, "$options": "i"}}
            ]
          },
          {"_id": 0}
        )
      )
      logger.info(f"Search '{query}' returned {len(products)} products (normalized: '{normalized_query}')")
      parsed_query=None
      try:
            parsed_query = parse_search_query(query)
      except Exception as e:
            logger.error(f"Failed to parse search query: {e}")

      create_search_event(
            user=user,
            search_query=query,
            parsed_query=parsed_query,
      )

      return {"query": query,"count": len(products),"results": products}