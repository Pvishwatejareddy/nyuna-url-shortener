from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import URLCreate, URLResponse
from app.crud import create_short_url, get_url_by_code, record_click
from app.cache import get_cached_url, set_cached_url
from app.rate_limiter import check_rate_limit

router = APIRouter()


@router.post("/shorten", response_model=URLResponse)
def shorten_url(
    url_data: URLCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Shorten a URL — with rate limiting!
    Max 10 requests per IP per 60 seconds
    """
    # Check rate limit FIRST before doing anything
    check_rate_limit(request)

    # Create the short URL
    db_url = create_short_url(db, url_data.original_url)

    # Cache it in Redis for fast future redirects
    set_cached_url(db_url.short_code, db_url.original_url)

    return db_url


@router.get("/{short_code}")
def redirect_url(
    short_code: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Redirect short URL to original URL
    Records click analytics on every visit
    """
    # Look up in database
    db_url = get_url_by_code(db, short_code)
    if not db_url:
        raise HTTPException(status_code=404, detail="URL not found")

    # Record the click for analytics
    record_click(
        db,
        db_url.id,
        str(request.client.host),
        request.headers.get("user-agent", "")
    )

    # Check Redis cache for fast redirect
    original_url = get_cached_url(short_code)
    if not original_url:
        set_cached_url(short_code, db_url.original_url)
        original_url = db_url.original_url

    # 302 redirect — tracks every click!
    return RedirectResponse(url=original_url, status_code=302)