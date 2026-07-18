from pydantic import BaseModel
class EventBreakdown(BaseModel):
    clicks: int
    wishlists: int
    purchases: int
class RegionStats(BaseModel):
    region: str
    events: int
class AnalyticsResponse(BaseModel):
    total_products: int
    total_users: int
    total_events: int
    total_regions: int

    event_breakdown: EventBreakdown

    top_regions: list[RegionStats]