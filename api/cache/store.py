import os
import secrets
import string
import redis
import random

from utils.get_secret import get_secret

# Get Redis connection parameters from environment variables
REDIS_URL = get_secret("REDIS_URL")
ENV = os.getenv("ENVIRONMENT", "dev")

# Key prefixes for different stores
CHALLENGE_PREFIX = "challenge:"
KEY_CHALLENGE_PREFIX = "key_challenge:"
KEY_COUNTER_PREFIX = "key_counter:"
KEY_PUBLIC_KEY_PREFIX = "key_public_key:"
CHALLENGE_COUNTER_BIT_LENGTH = 8


def get_redis():
    """Get Redis client for dependency injection"""
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    try:
        yield redis_client
    finally:
        redis_client.close()


def get_random_str(length: int) -> str:
    """Get a random string of a given length"""
    return ''.join(secrets.choice(
        string.ascii_letters + string.digits) for _ in range(length))


def generate_challenge() -> tuple[str, str]:
    """Create a new challenge"""
    id = get_random_str(16)
    challenge = get_random_str(32)
    counter = random.randint(10**(CHALLENGE_COUNTER_BIT_LENGTH - 1),
                             (10**CHALLENGE_COUNTER_BIT_LENGTH) - 1)
    return f"{id}.{challenge}.{counter}"
