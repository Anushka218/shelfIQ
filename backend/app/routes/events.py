from fastapi import APIRouter
from app.database import events_collection
router = APIRouter()

@router.get("/")
def get_events():
    events = list(events_collection.find({}, {"_id": 0}))
    return {
        "count": len(events),
        "events": events
    }