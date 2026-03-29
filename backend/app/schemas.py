from pydantic import BaseModel, HttpUrl
from datetime import datetime

class URLCreate(BaseModel):
    """What we RECEIVE when someone wants to shorten a URL"""
    original_url: str

class URLResponse(BaseModel):
    """What we SEND BACK after shortening"""
    id: int
    original_url: str
    short_code: str
    created_at: datetime

    class Config:
        from_attributes = True

class ClickResponse(BaseModel):
    """One click record"""
    id: int
    clicked_at: datetime
    ip_address: str | None

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    """Analytics data for a short URL"""
    short_code: str
    original_url: str
    total_clicks: int
    clicks: list[ClickResponse]

    class Config:
        from_attributes = True