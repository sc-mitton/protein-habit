import json
import hashlib
import base64
import cbor2
from sqlalchemy.orm import Session, subqueryload
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import ec

from db.tables import Key


def _verify_nonce(assertion: dict, client_data: dict, public_key: str) -> bool:
    '''
    Step 1: Use the public key that you store from the attestation object to
    verify that the assertion signature is valid for nonce.
    '''

    # Create nonce from authenticator data and client data
    client_data_hash = hashlib.sha256(
        json.dumps(client_data).encode()).digest()
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
    db: Session,
    client_data: dict,
    assertion: str,
    key_id: str,
    app_id: str,
    bundle_id: str,
) -> bool:
    """Main validation method that orchestrates all validation steps"""
    try:
        # Get the stored public key, and eager load the challenge
        key_record = db.query(Key).filter(Key.id == key_id).\
            options(
            subqueryload(Key.challenge)
        ).one_or_none()

        last_challenge = key_record.challenge.value \
            if key_record.challenge else None

        assertion = cbor2.loads(base64.b64decode(assertion))
        assertion_count = int.from_bytes(assertion['authenticatorData']
                                         [32:], 'big')

        checks = [
            _verify_nonce(assertion, client_data, key_record.public_key),
            _verify_rp_id(assertion, f"{app_id}.{bundle_id}"),
            assertion_count > key_record.counter,
            client_data['challenge'].split(':')[1] == last_challenge
        ]

        passed = all(checks)

        if passed:
            # Increment counter
            key_record.counter = assertion_count
            db.commit()

        return passed

    except Exception:
        return False
