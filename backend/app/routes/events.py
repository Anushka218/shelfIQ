from fastapi import APIRouter,Depends
from app.database import events_collection
from app.dependencies import get_current_admin
router = APIRouter()

@router.get("/")
def get_events(
    current_admin=Depends(get_current_admin),
):
    events = list(events_collection.find({}, {"_id": 0}))
    return {
        "count": len(events),
        "events": events
    }