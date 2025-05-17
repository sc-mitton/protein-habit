import json
import hashlib
import base64
import cbor2
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cache import KEY_CHALLENGE_PREFIX, KEY_COUNTER_PREFIX, KEY_PUBLIC_KEY_PREFIX
from redis import Redis


def _verify_nonce(assertion: dict, client_data: dict, public_key: str) -> bool:
    '''
    Step 1: Use the public key that you store from the attestation object to
    verify that the assertion signature is valid for nonce.
    '''

    # Create nonce from authenticator data and client data
    client_data_hash = hashlib.sha256(
        json.dumps(client_data, separators=(',', ':')).encode()).digest()
    nonce = hashlib.sha256(
        (assertion['authenticatorData'] + client_data_hash)
    ).digest()

    # Load the stored public key
    public_key_bytes = base64.b64decode(public_key)
    public_key_obj = serialization.load_der_public_key(public_key_bytes)

    # Verify the signature
    signature = assertion['signature']
    public_key_obj.verify(
        signature,
        nonce,
        ec.ECDSA(hashes.SHA256())
    )
    return True


def _verify_rp_id(assertion: dict, app_id: str) -> bool:
    '''
    Step 2: Compute the SHA256 hash of the clients App ID, and verify
    that it matches the RP ID in the authenticator data.
    '''

    app_id_hash = hashlib.sha256(app_id.encode()).hexdigest()
    rp_id = assertion['authenticatorData'][:32].hex()

    return app_id_hash == rp_id


def validate_assertion(
    redis_client: Redis,
    client_data: dict,
    assertion: str,
    key_id: str,
    app_id: str,
) -> bool:
    """Main validation method that orchestrates all validation steps"""
    try:
        # Batch the three Redis GET operations into a single MGET call
        keys = [
            f"{KEY_PUBLIC_KEY_PREFIX}{key_id}",
            f"{KEY_CHALLENGE_PREFIX}{key_id}",
            f"{KEY_COUNTER_PREFIX}{key_id}"
        ]
        public_key, last_challenge, counter = redis_client.mget(keys)
        counter = int(counter) if counter else 0

        assertion = cbor2.loads(base64.b64decode(assertion))
        assertion_count = int.from_bytes(assertion['authenticatorData']
                                         [32:], 'big')

        # Log validation inputs and check results
        print("Validation inputs:")
        print(f"  key_id: {key_id}")
        print(f"  app_id: {app_id}")
        print(f"  client_data: {client_data}")
        print(f"  assertion count: {assertion_count}")
        print(f"  stored counter: {counter}")
        print(f"  last challenge: {last_challenge}")
        print("\nCheck results:")
        try:
            print(
                f"  nonce verification: {_verify_nonce(assertion, client_data, public_key)}")
        except Exception as e:
            print(f"  nonce verification: {e}")
        try:
            print(
                f"  rp_id verification: {_verify_rp_id(assertion, f'{app_id}')}")
        except Exception as e:
            print(f"  rp_id verification: {e}")
        try:
            print(f"  counter check: {assertion_count > counter}")
        except Exception as e:
            print(f"  counter check: {e}")

        print(
            f"  challenge check: {client_data['challenge'] == last_challenge}")

        checks = [
            _verify_nonce(assertion, client_data, public_key),
            _verify_rp_id(assertion, f"{app_id}"),
            assertion_count > counter,
            client_data['challenge'] == last_challenge
        ]

        passed = all(checks)

        redis_client.set(f"{KEY_COUNTER_PREFIX}{key_id}", f'{assertion_count}')

        return passed

    except Exception as e:
        print(f"Error in validate_assertion: {e}")
        return False
