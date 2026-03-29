import time
import redis
import os
from dotenv import load_dotenv
from fastapi import HTTPException, Request

load_dotenv()

# Connect to Redis
redis_client = redis.from_url(os.getenv("REDIS_URL"))

# Settings
MAX_REQUESTS = 10       # Max 10 requests
WINDOW_SECONDS = 60     # Per 60 seconds per IP


def check_rate_limit(request: Request):
    """
    Token Bucket Rate Limiter

    Each IP gets 10 requests per 60 seconds.
    Uses Redis to track request counts per IP.
    """
    # Get the IP address of the requester
    ip = str(request.client.host)

    # Create a unique key for this IP in Redis
    # Example: "rate_limit:192.168.1.1"
    key = f"rate_limit:{ip}"

    # Get current request count for this IP
    current = redis_client.get(key)

    if current is None:
        # First request from this IP
        # Start counter at 1, expires after 60 seconds
        redis_client.setex(key, WINDOW_SECONDS, 1)
        return True

    elif int(current) < MAX_REQUESTS:
        # Under the limit — increment counter
        redis_client.incr(key)
        return True

    else:
        # LIMIT REACHED — reject the request!
        # Get how many seconds until their limit resets
        ttl = redis_client.ttl(key)
        raise HTTPException(
            status_code=429,
            detail=f"Too many requests! Try again in {ttl} seconds. Max {MAX_REQUESTS} requests per {WINDOW_SECONDS} seconds."
        )