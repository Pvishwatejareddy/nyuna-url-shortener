from sqlalchemy.orm import Session
from app.models import URL, Click
from app.encoder import encode

def create_short_url(db: Session, original_url: str):
    """Save a new URL to database and generate short code"""
    # Step 1: Save URL to DB first (without short code)
    db_url = URL(original_url=original_url, short_code="temp")
    db.add(db_url)
    db.commit()
    db.refresh(db_url)

    # Step 2: Use the DB-generated ID to create short code
    short_code = encode(db_url.id)

    # Step 3: Update the record with the real short code
    db_url.short_code = short_code
    db.commit()
    db.refresh(db_url)

    return db_url

def get_url_by_code(db: Session, short_code: str):
    """Find a URL in database by its short code"""
    return db.query(URL).filter(URL.short_code == short_code).first()

def record_click(db: Session, url_id: int, ip_address: str, user_agent: str):
    """Record a click on a short URL"""
    click = Click(
        url_id=url_id,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(click)
    db.commit()
    return click

def get_analytics(db: Session, short_code: str):
    """Get all clicks for a short URL"""
    url = get_url_by_code(db, short_code)
    if not url:
        return None
    return url