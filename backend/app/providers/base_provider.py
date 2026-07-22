from abc import ABC, abstractmethod


class SellerProvider(ABC):

    @abstractmethod
    def discover_sellers(
        self,
        category: str,
        region: str,
    ):
        """
        Return potential sellers for a category
        in a given region.
        """
        pass