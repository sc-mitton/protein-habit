import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from main import app
from tests.ios_variables import (
    TEST_KEY_ID,
    TEST_APP_ID,
    TEST_CHALLENGE_ID,
    TEST_CHALLENGE_VALUE,
    public_key_b64,
    TEST_ASSERTION_B64
)
from cache import (
    CHALLENGE_PREFIX,
    KEY_CHALLENGE_PREFIX,
    KEY_PUBLIC_KEY_PREFIX,
    KEY_COUNTER_PREFIX,
    get_redis
)

client = TestClient(app)
VERSION = "v1"


@pytest.fixture(scope="session", autouse=True)
def setup_test_redis():
    """Setup test Redis and cleanup after tests"""
    # Patch the conf module to use test values
    with patch('security.permissions.is_valid_mobile.IOS_APP_ID', TEST_APP_ID):

        # Get the actual Redis client
        redis_client = next(get_redis())

        # Clean up any existing test data
        redis_client.delete(f"{CHALLENGE_PREFIX}{TEST_CHALLENGE_ID}")
        redis_client.delete(f"{KEY_CHALLENGE_PREFIX}{TEST_KEY_ID}")
        redis_client.delete(f"{KEY_PUBLIC_KEY_PREFIX}{TEST_KEY_ID}")

        # Set up the challenge in Redis
        redis_client.set(
            f"{CHALLENGE_PREFIX}{TEST_CHALLENGE_ID}", TEST_CHALLENGE_VALUE)
        # Set up the key challenge in Redis
        redis_client.set(
            f"{KEY_CHALLENGE_PREFIX}{TEST_KEY_ID}", TEST_CHALLENGE_VALUE)
        # Set up the public key in Redis
        redis_client.set(
            f"{KEY_PUBLIC_KEY_PREFIX}{TEST_KEY_ID}", public_key_b64)
        # Set up the counter in Redis
        redis_client.set(f"{KEY_COUNTER_PREFIX}{TEST_KEY_ID}", 0)

        yield redis_client

        # Cleanup after tests
        redis_client.delete(f"{CHALLENGE_PREFIX}{TEST_CHALLENGE_ID}")
        redis_client.delete(f"{KEY_CHALLENGE_PREFIX}{TEST_KEY_ID}")
        redis_client.delete(f"{KEY_PUBLIC_KEY_PREFIX}{TEST_KEY_ID}")


def test_request_assertion_success():
    '''
    Test that calling an endpoint that requires assertion passes
    when a valid assertion is provided
    '''
    challenge = f"{TEST_CHALLENGE_ID}.{TEST_CHALLENGE_VALUE}"

    response = client.post(
        f"/{VERSION}/assertion-test",
        headers={
            "x-assertion": TEST_ASSERTION_B64,
            "x-challenge": challenge,
            "x-key-id": TEST_KEY_ID
        },
    )
    assert response.status_code == 200


def test_request_assertion_failure():
    '''
    Test that calling an endpoint that requires assertion fails
    when an invalid assertion is provided
    '''
    response = client.post(
        f"/{VERSION}/assertion-test",
        headers={
            "x-assertion": "invalid_assertion",
        }
    )
    assert response.status_code == 401

    response = client.post(f"/{VERSION}/assertion-test")
    assert response.status_code == 401
