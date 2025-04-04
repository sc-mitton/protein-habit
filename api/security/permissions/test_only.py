import os

env = os.getenv("ENVIRONMENT", "development")


async def test_only() -> bool:
    return env in ["test", "development"]
