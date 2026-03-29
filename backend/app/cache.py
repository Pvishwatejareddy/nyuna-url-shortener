import redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

# Handle both local Redis and Upstash (SSL)
if REDIS_URL and REDIS_URL.startswith("rediss://"):
    redis_client = redis.from_url(
        REDIS_URL,
        ssl_cert_reqs=None
    )
else:
    redis_client = redis.from_url(
        REDIS_URL or "redis://localhost:6379"
    )

CACHE_TTL = 86400

def get_cached_url(short_code: str):
    try:
        cached = redis_client.get(short_code)
        if cached:
            return cached.decode("utf-8")
        return None
    except Exception:
        return None

def set_cached_url(short_code: str, original_url: str):
    try:
        redis_client.setex(
            name=short_code,
            time=CACHE_TTL,
            value=original_url
        )
    except Exception:
        pass

def delete_cached_url(short_code: str):
    try:
        redis_client.delete(short_code)
    except Exception:
        pass