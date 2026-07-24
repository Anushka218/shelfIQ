from app.database import products_collection
from app.logger import logger
from app.ai.query_parser import parse_search_query
from app.services.event_service import create_search_event

def search_products(query: str, user):
      products = list(
        products_collection.find(
          {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"brand": {"$regex": query, "$options": "i"}},
                {"category": {"$regex": query, "$options": "i"}},
                {"color": {"$regex": query, "$options": "i"}},
                {"material": {"$regex": query, "$options": "i"}},
                {"occasion": {"$regex": query, "$options": "i"}},
                {"season": {"$regex": query, "$options": "i"}},
                {"gender": {"$regex": query, "$options": "i"}}
            ]
          },
          {"_id": 0}
        )
      )
      logger.info(f"Search '{query}' returned {len(products)} products")
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