from app.providers.base_provider import SellerProvider
from app.database import prospective_sellers_collection


class MongoSellerProvider(SellerProvider):
    """
    Discovers potential sellers from the MongoDB collection.
    """

    def discover_sellers(
        self,
        category: str,
        region: str,
    ):

        sellers = prospective_sellers_collection.find(
            {
                "categories": category,
                "marketplace_joined": False,
            }
        )

        return list(sellers)