import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from main import app
from tests.ios_variables import (
    TEST_ATTESTATION,
    TEST_KEY_ID,
    TEST_APP_ID,
    TEST_CHALLENGE_VALUE,
    public_key_b64
)
from cache import (
    CHALLENGE_PREFIX,
    KEY_CHALLENGE_PREFIX,
    KEY_PUBLIC_KEY_PREFIX,
    get_redis
)

client = TestClient(app)
VERSION = "v1"


@pytest.fixture(scope="session", autouse=True)
def setup_test_redis():
    """Setup test Redis and cleanup after tests"""
    # Patch the conf module to use test values
    with patch(f'api.{VERSION}.endpoints.IOS_APP_ID', TEST_APP_ID), \
            patch('security.attest.ios.validate_attestation.INTEGRITY_ENVIRONMENT',
                  'PRODUCTION'):

        # Get the actual Redis client
        redis_client = next(get_redis())

        # Clean up any existing test data
        challenge_id = "test_challenge_id"
        redis_client.delete(f"{CHALLENGE_PREFIX}{challenge_id}")
        redis_client.delete(f"{KEY_CHALLENGE_PREFIX}{TEST_KEY_ID}")
        redis_client.delete(f"{KEY_PUBLIC_KEY_PREFIX}{TEST_KEY_ID}")

        # Set up the challenge in Redis
        redis_client.set(f"{CHALLENGE_PREFIX}{challenge_id}",
                         TEST_CHALLENGE_VALUE)

        # Set up the key challenge in Redis
        redis_client.set(
            f"{KEY_CHALLENGE_PREFIX}{TEST_KEY_ID}", TEST_CHALLENGE_VALUE)

        # Set up the public key in Redis
        redis_client.set(
            f"{KEY_PUBLIC_KEY_PREFIX}{TEST_KEY_ID}", public_key_b64)

        # Make challenge data available to tests
        global TEST_CHALLENGE_ID
        TEST_CHALLENGE_ID = challenge_id

        yield redis_client

        # Cleanup after tests
        redis_client.delete(f"{CHALLENGE_PREFIX}{challenge_id}")
        redis_client.delete(f"{KEY_CHALLENGE_PREFIX}{TEST_KEY_ID}")
        redis_client.delete(f"{KEY_PUBLIC_KEY_PREFIX}{TEST_KEY_ID}")


def test_attest_success():
    """Test attestation with valid challenge and key"""
    response = client.post(
        f"/{VERSION}/attest",
        json={
            "attestation": TEST_ATTESTATION,
            "keyId": TEST_KEY_ID,
            "challenge": TEST_CHALLENGE_VALUE
        }
    )
    assert response.status_code == 200


def test_attest_invalid_challenge():
    """Test attestation with invalid challenge"""
    response = client.post(
        f"/{VERSION}/attest?platform=ios",
        json={
            "attestation": TEST_ATTESTATION,
            "keyId": TEST_KEY_ID,
            "challenge": "invalid_challenge"
        }
    )
    assert response.status_code == 400
    assert "Invalid attestation" in response.json()["detail"]


def test_attest_invalid_key_id():
    """Test attestation with invalid key ID"""
    # Use the test challenge
    response = client.post(
        f"/{VERSION}/attest?platform=ios",
        json={
            "attestation": TEST_ATTESTATION,
            "keyId": "invalid_key_id",
            "challenge": f"{TEST_CHALLENGE_ID}:{TEST_CHALLENGE_VALUE}"
        }
    )
    assert response.status_code == 400
