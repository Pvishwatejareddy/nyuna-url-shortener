import redis
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to Redis
redis_client = redis.from_url(os.getenv("REDIS_URL"))

# How long to keep URLs in cache (24 hours)
CACHE_TTL = 86400

def get_cached_url(short_code: str):
    """Look for a short code in Redis cache"""
    # Try to find it in Redis
    cached = redis_client.get(short_code)
    if cached:
        # Found it! Return the original URL
        return cached.decode("utf-8")
    # Not found in cache
    return None

def set_cached_url(short_code: str, original_url: str):
    """Save a short code → URL mapping in Redis"""
    redis_client.setex(
        name=short_code,
        time=CACHE_TTL,
        value=original_url
    )

def delete_cached_url(short_code: str):
    """Remove a URL from cache"""
    redis_client.delete(short_code)