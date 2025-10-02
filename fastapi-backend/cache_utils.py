from functools import wraps
from typing import Any, Callable
import json
import hashlib
from redis import asyncio as aioredis
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis = aioredis.from_url(redis_url)

def cache(expire: int = 300):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            # Create cache key from function name and arguments
            key_data = {
                "func": func.__name__,
                "args": str(args),
                "kwargs": str(kwargs)
            }
            key = hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()

            # Try to get from cache
            cached = await redis.get(key)
            if cached:
                return json.loads(cached)

            # Execute function
            result = await func(*args, **kwargs)

            # Cache result
            await redis.setex(key, expire, json.dumps(result))

            return result
        return wrapper
    return decorator

# Initialize cache on startup
async def init_cache():
    await redis.ping()

# Close cache on shutdown
async def close_cache():
    await redis.close()
