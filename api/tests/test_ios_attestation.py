import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from main import app
from db.tables import get_db, Challenge, Key
from tests.ios_variables import (
    TEST_ATTESTATION,
    TEST_KEY_ID,
    TEST_APP_ID,
    TEST_CHALLENGE_VALUE,
    TEST_BUNDLE_ID,
    public_key_b64
)

client = TestClient(app)
VERSION = "v1"


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Setup test database and cleanup after tests"""
    # Patch the conf module to use test values
    with patch(f'api.{VERSION}.endpoints.IOS_APP_ID', TEST_APP_ID), \
            patch(f'api.{VERSION}.endpoints.IOS_BUNDLE_ID', TEST_BUNDLE_ID), \
            patch(f'api.{VERSION}.endpoints.ENV', 'PRODUCTION'):
        db = next(get_db())

        # Clean up any existing test data
        db.query(Key).filter(Key.id == TEST_KEY_ID).delete()
        db.query(Challenge).delete()
        db.commit()

        # Create a test challenge
        challenge_id = "test_challenge_id"
        test_challenge = Challenge(
            id=challenge_id,
            value=TEST_CHALLENGE_VALUE
        )
        db.add(test_challenge)
        db.commit()

        # Create a test key record
        test_key = Key(
            id=TEST_KEY_ID,
            public_key=public_key_b64,
            counter=0,
            challenge=test_challenge
        )
        db.add(test_key)
        db.commit()

        # Make challenge data available to tests
        global TEST_CHALLENGE_ID
        TEST_CHALLENGE_ID = challenge_id

        yield db

        # Cleanup after tests
        db.query(Key).filter(Key.id == TEST_KEY_ID).delete()
        db.query(Challenge).delete()
        db.commit()


def test_attest_success():
    """Test attestation with valid challenge and key"""
    response = client.post(
        f"/{VERSION}/attest?platform=ios",
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
