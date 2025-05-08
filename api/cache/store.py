import os
import uuid
import secrets
import string
import redis

from utils.get_secret import get_secret

# Get Redis connection parameters from environment variables
REDIS_URL = get_secret("REDIS_URL")
ENV = os.getenv("ENVIRONMENT", "dev")

# Key prefixes for different stores
CHALLENGE_PREFIX = "challenge:"
KEY_CHALLENGE_PREFIX = "key_challenge:"
KEY_COUNTER_PREFIX = "key_counter:"
KEY_PUBLIC_KEY_PREFIX = "key_public_key:"


def get_redis():
    """Get Redis client for dependency injection"""
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    try:
        yield redis_client
    finally:
        redis_client.close()


def generate_challenge() -> tuple[str, str]:
    """Create a new challenge"""
    id = str(uuid.uuid4())
    challenge = ''.join(secrets.choice(
        string.ascii_letters + string.digits) for _ in range(32))
    return id, challenge
