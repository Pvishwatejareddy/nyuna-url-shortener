import os
import redis
from dotenv import load_dotenv
from fastapi import HTTPException, Request

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

MAX_REQUESTS = 10
WINDOW_SECONDS = 60


def check_rate_limit(request: Request):
    try:
        ip = str(request.client.host)
        key = f"rate_limit:{ip}"
        current = redis_client.get(key)

        if current is None:
            redis_client.setex(key, WINDOW_SECONDS, 1)
            return True
        elif int(current) < MAX_REQUESTS:
            redis_client.incr(key)
            return True
        else:
            ttl = redis_client.ttl(key)
            raise HTTPException(
                status_code=429,
                detail=f"Too many requests! Try again in {ttl} seconds."
            )
    except HTTPException:
        raise
    except Exception:
        # If Redis fails, allow the request
        return True