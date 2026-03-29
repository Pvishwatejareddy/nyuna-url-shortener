from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import get_analytics
from app.schemas import AnalyticsResponse

router = APIRouter(prefix="/analytics")

@router.get("/{short_code}")
def get_url_analytics(short_code: str, db: Session = Depends(get_db)):
    """Get click analytics for a short URL"""
    url = get_analytics(db, short_code)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    
    return {
        "short_code": url.short_code,
        "original_url": url.original_url,
        "total_clicks": len(url.clicks),
        "clicks": url.clicks
    }