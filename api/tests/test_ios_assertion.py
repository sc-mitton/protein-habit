import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from main import app
from db.tables import get_db, Challenge, Key
from tests.ios_variables import (
    TEST_KEY_ID,
    TEST_APP_ID,
    TEST_CHALLENGE_ID,
    TEST_CHALLENGE_VALUE,
    TEST_BUNDLE_ID,
    public_key_b64,
    TEST_ASSERTION_B64
)

client = TestClient(app)
VERSION = "v1"


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Setup test database and cleanup after tests"""
    # Patch the conf module to use test values
    with patch('security.permissions.assertion_pass.IOS_APP_ID', TEST_APP_ID), \
            patch('security.permissions.assertion_pass.IOS_BUNDLE_ID', TEST_BUNDLE_ID):
        db = next(get_db())

        # Clean up any existing test data
        db.query(Key).filter(Key.id == TEST_KEY_ID).delete()
        db.query(Challenge).delete()
        db.commit()

        # Create a test challenge

        test_challenge = Challenge(
            id=TEST_CHALLENGE_ID,
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

        yield db

        # Cleanup after tests
        db.query(Key).filter(Key.id == TEST_KEY_ID).delete()
        db.query(Challenge).delete()
        db.commit()


def test_request_assertion_success():
    '''
    Test that calling an endpoint that requires assertion passes
    when a valid assertion is provided
    '''
    db = next(get_db())
    challenge = f"{TEST_CHALLENGE_ID}:{TEST_CHALLENGE_VALUE}"

    response = client.post(
        f"/{VERSION}/assertion-test",
        headers={
            "x-assertion": TEST_ASSERTION_B64,
            "x-challenge": challenge,
            "x-key": TEST_KEY_ID
        },
    )
    assert response.status_code == 200
    assert db.query(Key).count() == 1


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
