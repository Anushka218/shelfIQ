from app.database import products_collection

def search_products(query: str):
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
      return {"query": query,"count": len(products),"results": products}